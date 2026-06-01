import os
import requests
from rest_framework import generics, viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
import firebase_admin
from firebase_admin import credentials, auth as firebase_auth
from django.conf import settings
import uuid
from rest_framework import filters
from rest_framework.decorators import action
from django.db.models import Count
from django_filters.rest_framework import DjangoFilterBackend
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from .services import product_service, analytics_service
from .models import Product, ClickTrack, PriceHistory, PriceAlert, Watchlist
from .filters import ProductFilter
from .serializers import (
    UserSerializer, 
    RegisterSerializer, 
    CustomTokenObtainPairSerializer,
    ProductSerializer,
    ClickTrackSerializer,
    PriceHistorySerializer,
    PriceAlertSerializer,
    WatchlistSerializer
)

User = get_user_model()

# Initialize Firebase Admin
try:
    if not firebase_admin._apps:
        import json
        
        # 1. Try to load from raw JSON string (for production/Render)
        cred_json = os.environ.get('FIREBASE_SERVICE_ACCOUNT_JSON')
        if cred_json:
            cred_dict = json.loads(cred_json)
            cred = credentials.Certificate(cred_dict)
            firebase_admin.initialize_app(cred)
        else:
            # 2. Try to load from local file path
            cred_path = getattr(settings, 'FIREBASE_SERVICE_ACCOUNT_PATH', None)
            if cred_path and os.path.exists(cred_path):
                cred = credentials.Certificate(cred_path)
                firebase_admin.initialize_app(cred)
            else:
                print("Firebase service account credentials not found. Google Auth will fail.")
except Exception as e:
    print(f"Failed to initialize Firebase: {e}")

# --- Auth Views ---

class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            "token": str(refresh.access_token),
            "user": UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class GoogleAuthView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        id_token = request.data.get('token')
        if not id_token:
            return Response({"error": "No token provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not firebase_admin._apps:
            return Response({"error": "Firebase admin not initialized. Please configure credentials on the server."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        try:
            # Verify the token against the Firebase Admin SDK
            decoded_token = firebase_auth.verify_id_token(id_token)
            uid = decoded_token.get('uid')
            email = decoded_token.get('email')
            name = decoded_token.get('name', 'User')
            picture = decoded_token.get('picture', '')

            if not email:
                return Response({"error": "Google account has no email"}, status=status.HTTP_400_BAD_REQUEST)

            # Check if user already exists
            user, created = User.objects.get_or_create(email=email, defaults={
                'username': email.split('@')[0] + '_' + str(uuid.uuid4())[:8],
                'firebase_uid': uid,
                'display_name': name,
                'profile_picture': picture
            })

            # If user exists but fields are empty, update them
            if not created:
                updated = False
                if not user.firebase_uid:
                    user.firebase_uid = uid
                    updated = True
                if not user.display_name:
                    user.display_name = name
                    updated = True
                if not user.profile_picture:
                    user.profile_picture = picture
                    updated = True
                if updated:
                    user.save()

            # Issue our own JWT token
            refresh = RefreshToken.for_user(user)
            return Response({
                "token": str(refresh.access_token),
                "user": UserSerializer(user).data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_401_UNAUTHORIZED)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

# --- Product Views ---

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'category', 'description']

    def get_queryset(self):
        qs = super().get_queryset()
        sort = self.request.query_params.get('sort')
        if sort == 'price_asc':
            qs = qs.order_by('price')
        elif sort == 'price_desc':
            qs = qs.order_by('-price')
        return qs

    @method_decorator(cache_page(60))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @method_decorator(cache_page(60))
    @action(detail=False, methods=['get'])
    def trending(self, request):
        trending_products = product_service.get_trending_products(limit=10)
        serializer = self.get_serializer(trending_products, many=True)
        return Response(serializer.data)

    @method_decorator(cache_page(60))
    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured_products = product_service.get_featured_products(limit=6)
        serializer = self.get_serializer(featured_products, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def recommendations(self, request, pk=None):
        product = self.get_object()
        recommendations = product_service.get_recommendations(product, limit=5)
        serializer = self.get_serializer(recommendations, many=True)
        return Response(serializer.data)

    @method_decorator(cache_page(60))
    @action(detail=False, methods=['get'])
    def deal_of_the_day(self, request):
        deal = product_service.get_deal_of_the_day()
        if not deal:
            return Response({"error": "No deals available"}, status=404)
        serializer = self.get_serializer(deal)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def ai_summary(self, request, pk=None):
        product = self.get_object()
        nvidia_key = os.environ.get('NVIDIA_API_KEY')
        ai_response = f"AI Verdict: The {product.name} offers great value with a focus on core performance and reliability in its price segment."
        
        if nvidia_key:
            try:
                headers = {
                    "Authorization": f"Bearer {nvidia_key}",
                    "Content-Type": "application/json"
                }
                data = {
                    "model": "meta/llama-3.1-8b-instruct",
                    "messages": [
                        {"role": "system", "content": "You are TechBoy AI, an expert smartphone recommender. Keep your response to exactly one short, punchy sentence. Do NOT list any technical specifications or repeat the specs."},
                        {"role": "user", "content": f"Write a 1-sentence punchy verdict about the {product.name}. Focus on who this phone is best for, without listing specs."}
                    ]
                }
                response = requests.post("https://integrate.api.nvidia.com/v1/chat/completions", headers=headers, json=data, timeout=10)
                if response.status_code == 200:
                    ai_response = "AI Verdict: " + response.json()['choices'][0]['message']['content']
            except Exception as e:
                print(f"NVIDIA API Error in ai_summary: {e}")
                
        return Response({"summary": ai_response})

class CompareAPIView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        product_ids = request.data.get('products', [])
        if not isinstance(product_ids, list):
            return Response({"error": "Invalid request. 'products' should be a list of IDs."}, status=status.HTTP_400_BAD_REQUEST)
        
        products, comparison_data = product_service.compare_products(product_ids)
        serializer = ProductSerializer(products, many=True)
        
        return Response({
            "products": serializer.data,
            "comparison": comparison_data
        })

class TrackClickAPIView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = ClickTrackSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product_id = serializer.validated_data['product'].id
        source = serializer.validated_data['source']
        user = request.user if request.user.is_authenticated else None
        
        analytics_service.track_click(product_id, source, user)
        return Response({"message": "Click tracked successfully"}, status=status.HTTP_201_CREATED)

class AnalyticsAPIView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        action = request.query_params.get('action')
        if action == 'top-products':
            return Response(analytics_service.get_top_products())
        elif action == 'sources':
            return Response(analytics_service.get_source_breakdown())
        return Response({"error": "Invalid action parameter"}, status=400)

# --- New Feature Views ---

class PriceHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PriceHistory.objects.all()
    serializer_class = PriceHistorySerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        product_id = self.request.query_params.get('product_id')
        if product_id:
            return self.queryset.filter(product_id=product_id).order_by('timestamp')
        return self.queryset

class PriceAlertViewSet(viewsets.ModelViewSet):
    serializer_class = PriceAlertSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        if self.request.user.is_authenticated:
            return PriceAlert.objects.filter(user=self.request.user)
        return PriceAlert.objects.none()

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(user=user)

class WatchlistViewSet(viewsets.ModelViewSet):
    serializer_class = WatchlistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Watchlist.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ChatbotAPIView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        query = request.data.get('query', '').lower()
        if not query:
            return Response({"response": "I'm ready to help! What kind of smartphone are you looking for?"})
        
        nvidia_key = os.environ.get('NVIDIA_API_KEY')
        ai_response = "I couldn't find a specific match, but you can explore our 'Analyst Picks' for the best-vetted options!"
        
        if nvidia_key:
            try:
                headers = {
                    "Authorization": f"Bearer {nvidia_key}",
                    "Content-Type": "application/json"
                }
                data = {
                    "model": "meta/llama-3.1-8b-instruct",
                    "messages": [
                        {"role": "system", "content": "You are TechBoy AI, an expert smartphone recommender. Be concise and conversational. Do not output markdown, just plain text."},
                        {"role": "user", "content": query}
                    ]
                }
                response = requests.post("https://integrate.api.nvidia.com/v1/chat/completions", headers=headers, json=data, timeout=10)
                if response.status_code == 200:
                    ai_response = response.json()['choices'][0]['message']['content']
            except Exception as e:
                print(f"NVIDIA API Error: {e}")

        # Extract some mock products for the demo UI based on query if AI didn't explicitly return product objects
        products = Product.objects.all()
        matched = []
        if 'gaming' in query:
            matched = products.filter(description__icontains='gaming') | products.filter(tag__icontains='gaming')
        elif 'budget' in query or 'cheap' in query:
            matched = products.order_by('price')[:3]
        elif 'camera' in query or 'photo' in query:
            matched = products.filter(specs__icontains='MP') | products.filter(description__icontains='camera')
        else:
            matched = products.filter(name__icontains=query) | products.filter(category__icontains=query)
        
        recommendations = ProductSerializer(matched[:3], many=True).data if matched.exists() else []
        
        if not nvidia_key and matched.exists():
            names = ", ".join([p['name'] for p in recommendations])
            ai_response = f"Based on your interest, I recommend checking out: {names}. They offer great value in that category!"

        return Response({
            "response": ai_response,
            "products": recommendations
        })
