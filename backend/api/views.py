import os
import requests
from rest_framework import generics, viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
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
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return PriceAlert.objects.filter(user=self.request.user)

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
        
        openrouter_key = os.environ.get('OPENROUTER_API_KEY', "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")
        ai_response = "I couldn't find a specific match, but you can explore our 'Analyst Picks' for the best-vetted options!"
        
        if openrouter_key:
            try:
                headers = {
                    "Authorization": f"Bearer {openrouter_key}",
                    "Content-Type": "application/json"
                }
                data = {
                    "model": "meta-llama/llama-3-8b-instruct:free",
                    "messages": [
                        {"role": "system", "content": "You are TechBoy AI, an expert smartphone recommender. Be concise and conversational. Do not output markdown, just plain text."},
                        {"role": "user", "content": query}
                    ]
                }
                response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=data, timeout=10)
                if response.status_code == 200:
                    ai_response = response.json()['choices'][0]['message']['content']
            except Exception as e:
                print(f"OpenRouter Error: {e}")

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
        
        if not openrouter_key and matched.exists():
            names = ", ".join([p['name'] for p in recommendations])
            ai_response = f"Based on your interest, I recommend checking out: {names}. They offer great value in that category!"

        return Response({
            "response": ai_response,
            "products": recommendations
        })
