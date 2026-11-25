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
from django.core.cache import cache
from hashlib import sha256
from django_filters.rest_framework import DjangoFilterBackend
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from .services import product_service, analytics_service
from .services.rag_service import retrieve_products, build_context, local_answer
from .services.email_service import send_welcome_email, send_login_notification_email
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

# Live NVIDIA NIM model used for grounded summaries / chat.
# Override with the NVIDIA_MODEL env var. The previous default
# (meta/llama-3.1-8b-instruct) was retired on 2026-08-26 and returns HTTP 410.
NVIDIA_CHAT_MODEL = os.environ.get('NVIDIA_MODEL', 'meta/llama-3.2-11b-vision-instruct')

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
        try:
            user_display = getattr(user, 'display_name', '') or user.username
            send_welcome_email(user.email, user_display)
        except Exception as e:
            print(f'[RegisterView] Welcome email error: {e}')
        refresh = RefreshToken.for_user(user)
        return Response({
            "token": str(refresh.access_token),
            "user": UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            try:
                username = request.data.get('username')
                user = User.objects.filter(username=username).first() or User.objects.filter(email=username).first()
                if user and user.email:
                    ip = request.META.get('HTTP_X_FORWARDED_FOR', request.META.get('REMOTE_ADDR', 'Unknown'))
                    ua = request.META.get('HTTP_USER_AGENT', 'Web Browser')
                    send_login_notification_email(user.email, user.display_name or user.username, ip, ua)
            except Exception as e:
                print(f'[LoginView] Login notification error: {e}')
        return response

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
                'google_id': uid,
                'firebase_uid': uid,
                'display_name': name,
                'profile_picture': picture
            })

            ip = request.META.get('HTTP_X_FORWARDED_FOR', request.META.get('REMOTE_ADDR', 'Unknown'))
            ua = request.META.get('HTTP_USER_AGENT', 'Web Browser')

            if not created:
                user.google_id = uid
                user.firebase_uid = uid
                user.display_name = name
                user.profile_picture = picture
                user.save(update_fields=['google_id', 'firebase_uid', 'display_name', 'profile_picture'])
                try:
                    send_login_notification_email(user.email, user.display_name or user.username, ip, ua)
                except Exception as e:
                    print(f'[GoogleAuth] Login alert error: {e}')
            else:
                try:
                    send_welcome_email(user.email, user.display_name or user.username)
                except Exception as e:
                    print(f'[GoogleAuth] Welcome email error: {e}')

            # Issue our own JWT token
            refresh = RefreshToken.for_user(user)
            return Response({
                "token": str(refresh.access_token),
                "refresh": str(refresh),
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
    search_fields = ['name', 'brand', 'category', 'tag', 'description']

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

    @action(detail=False, methods=['get'])
    def categories(self, request):
        categories = list(Product.objects.values_list('category', flat=True).distinct())
        return Response([c for c in categories if c])

    @action(detail=False, methods=['get'])
    def brands(self, request):
        brands = list(Product.objects.values_list('brand', flat=True).distinct())
        return Response([b for b in brands if b])

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
        gemini_key = os.environ.get('GEMINI_API_KEY')
        nvidia_key = os.environ.get('NVIDIA_API_KEY')
        ai_response = f"AI Verdict: The {product.name} offers great value with a focus on core performance and reliability in its price segment."
        
        # 1. Primary: Google Gemini 2.5 Flash API
        if gemini_key:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={gemini_key}"
                prompt = (
                    f"You are TechBoy AI, an expert smartphone recommender. Write a 1-sentence punchy verdict "
                    f"about the {product.name} (Price: ₹{product.price:,}, Brand: {product.brand}). "
                    f"Focus on who this phone is best for, without listing technical specs. Keep under 25 words."
                )
                res = requests.post(url, json={
                    "contents": [{"parts": [{"text": prompt}]}],
                    "generationConfig": {"temperature": 0.25, "maxOutputTokens": 60}
                }, timeout=10)
                if res.status_code == 200:
                    raw_text = res.json().get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', '')
                    cleaned = raw_text.replace('*', '').strip()
                    if cleaned:
                        return Response({"summary": f"AI Verdict: {cleaned}"})
            except Exception as e:
                print(f"Gemini API Error in ai_summary: {e}")

        # 2. Secondary Fallback: NVIDIA NIM API
        if nvidia_key:
            try:
                headers = {
                    "Authorization": f"Bearer {nvidia_key}",
                    "Content-Type": "application/json"
                }
                data = {
                    "model": NVIDIA_CHAT_MODEL,
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
        product_ids = request.data.get('products') or request.data.get('product_ids') or []
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
        elif not action:
            return Response({
                "top_products": analytics_service.get_top_products(),
                "sources": analytics_service.get_source_breakdown()
            })
        return Response({"error": "Invalid action parameter"}, status=400)

# --- New Feature Views ---

class PriceHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PriceHistory.objects.all()
    serializer_class = PriceHistorySerializer
    permission_classes = [AllowAny]
    pagination_class = None
    
    def get_queryset(self):
        product_id = self.request.query_params.get('product_id')
        if product_id:
            return self.queryset.filter(product_id=product_id).order_by('timestamp')
        return self.queryset

class PriceAlertViewSet(viewsets.ModelViewSet):
    serializer_class = PriceAlertSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        # Require authentication to list/read/modify/delete alerts to prevent email PII enumeration & IDOR
        if self.request.user.is_authenticated:
            return PriceAlert.objects.filter(user=self.request.user)
        return PriceAlert.objects.none()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = serializer.validated_data['product']
        user = request.user if request.user.is_authenticated else None
        if user and user.email:
            email = user.email.strip().lower()
        else:
            email = (request.data.get('email') or '').strip().lower()
        if not email:
            return Response({'error': 'Email is required for guest price alerts.'}, status=400)

        # Prevent unauthenticated callers from overwriting an authenticated user's alert
        if not user and PriceAlert.objects.filter(email=email, product=product, user__isnull=False).exists():
            return Response({'error': 'Please sign in to update alerts for this account.'}, status=403)

        alert, created = PriceAlert.objects.update_or_create(
            email=email,
            product=product,
            defaults={
                'user': user,
                'product_name': product.name,
                'current_price': product.price,
                'alert_type': serializer.validated_data.get('alert_type', 'ANY'),
                'target_price': serializer.validated_data.get('target_price'),
                'is_active': True,
                'alert_sent': False,
                'last_notified_price': None,
                'last_notified_at': None,
            },
        )
        output = self.get_serializer(alert)
        return Response({**output.data, 'created': created, 'message': f'Alert set for {product.name}.'}, status=200)

class WatchlistViewSet(viewsets.ModelViewSet):
    serializer_class = WatchlistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Watchlist.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['post'])
    def toggle(self, request):
        product_id = request.data.get('product') or request.data.get('product_id')
        if not product_id:
            return Response({'error': 'product id is required'}, status=status.HTTP_400_BAD_REQUEST)
        existing = Watchlist.objects.filter(user=request.user, product_id=product_id)
        if existing.exists():
            existing.delete()
            return Response({'saved': False}, status=status.HTTP_200_OK)
        product = Product.objects.filter(id=product_id).first()
        if not product:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
        item = Watchlist.objects.create(user=request.user, product=product)
        return Response({'saved': True, 'id': item.id}, status=status.HTTP_201_CREATED)

def _format_gemini_contents(history, current_prompt):
    """
    Ensures strict alternation of 'user' and 'model' turns for Gemini 2.5 Flash API.
    """
    turns = []
    if isinstance(history, list):
        for item in history[-6:]:
            role = "user" if item.get('role') in ('user', 'human') else "model"
            text = str(item.get('text') or item.get('content') or '').strip()
            if not text:
                continue
            if turns and turns[-1]['role'] == role:
                turns[-1]['parts'][0]['text'] += f"\n{text}"
            else:
                turns.append({"role": role, "parts": [{"text": text}]})
    
    while turns and turns[0]['role'] != 'user':
        turns.pop(0)

    if turns and turns[-1]['role'] == 'user':
        turns[-1]['parts'][0]['text'] += f"\n\n{current_prompt}"
    else:
        turns.append({"role": "user", "parts": [{"text": current_prompt}]})
    return turns

class ChatbotAPIView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        query = str(request.data.get('query') or request.data.get('message') or '').strip()
        user_name = str(request.data.get('user_name') or request.data.get('user') or '').strip()
        history = request.data.get('history') or []

        if not query:
            greeting = f"Hey {user_name}! " if user_name else "I'm ready to help! "
            return Response({"response": f"{greeting}What kind of smartphone are you looking for?"})

        # Cache key incorporates query, user_name, and conversational context
        cache_salt = f"{query.lower()}:{user_name}:{len(history)}"
        cache_key = f"rag-chat:{sha256(cache_salt.encode()).hexdigest()}"
        cached = cache.get(cache_key)
        if cached:
            return Response({**cached, 'cached': True})

        retrieved = retrieve_products(query)
        context = build_context(retrieved)
        gemini_key = os.environ.get('GEMINI_API_KEY')
        nvidia_key = os.environ.get('NVIDIA_API_KEY')
        ai_response = local_answer(retrieved, query=query)

        # Build personalized customer prompt
        customer_header = f"Customer Name: {user_name}\n" if user_name else ""
        current_prompt = f"{customer_header}Customer Question: {query}\n\nRetrieved Verified TechBoy Catalog Context:\n{context}"

        # 1. Primary: Google Gemini 2.5 Flash API with Catalog Grounding & Multi-Scenario Training
        if gemini_key:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={gemini_key}"
                system_instruction = (
                    "You are TechBoy AI, the elite smartphone engineering advisor for TECHBOY-STORE.\n"
                    "Your core guidelines:\n"
                    "1. GROUNDING: Answer strictly from the retrieved TechBoy catalog context. Never fabricate specs or unlisted prices.\n"
                    "2. PERSONALIZATION: When the customer name is provided, address them warmly (e.g., 'Hey [Name]!').\n"
                    "3. SCENARIOS:\n"
                    "   • Gaming (BGMI/CoD/Genshin): Distinguish sustained 90/120 FPS capable silicon from entry-level chips; emphasize cooling chambers and refresh rates.\n"
                    "   • Content Creation & Optics: Highlight OIS, sensor quality (Sony IMX), and 4K recording capabilities over pure megapixel marketing.\n"
                    "   • Software & Longevity: Distinguish bloatware-free clean OS (Pixel, Nothing, Moto) from ad-heavy skins, citing update policies.\n"
                    "   • Comparisons: Provide clear side-by-side pros, cons, and a definitive 'Who Should Buy Which' verdict.\n"
                    "4. FORMATTING: Use concise markdown, bold phone names with ₹ prices, and bullet points."
                )
                payload = {
                    "system_instruction": {"parts": [{"text": system_instruction}]},
                    "contents": _format_gemini_contents(history, current_prompt),
                    "generationConfig": {
                        "temperature": 0.25,
                        "maxOutputTokens": 600
                    }
                }
                res = requests.post(url, json=payload, timeout=20)
                if res.status_code == 200:
                    raw_text = res.json().get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', '')
                    if raw_text.strip():
                        ai_response = raw_text.strip()
            except Exception as e:
                print(f"Gemini API Error in chat: {e}")

        # 2. Secondary Fallback: NVIDIA NIM API
        elif nvidia_key:
            try:
                headers = {
                    "Authorization": f"Bearer {nvidia_key}",
                    "Content-Type": "application/json"
                }
                messages = [
                    {"role": "system", "content": "You are TechBoy AI, an expert smartphone advisor. Answer strictly from the provided TechBoy catalog context. Use clean markdown formatting with bullets and bold prices."}
                ]
                if isinstance(history, list):
                    for turn in history[-4:]:
                        role = "user" if turn.get('role') in ('user', 'human') else "assistant"
                        text = str(turn.get('text') or turn.get('content') or '').strip()
                        if text:
                            messages.append({"role": role, "content": text})
                messages.append({"role": "user", "content": current_prompt})

                data = {
                    "model": NVIDIA_CHAT_MODEL,
                    "messages": messages,
                    "temperature": 0.25,
                    "max_tokens": 500,
                }
                response = requests.post("https://integrate.api.nvidia.com/v1/chat/completions", headers=headers, json=data, timeout=30)
                if response.status_code == 200:
                    ai_response = response.json()['choices'][0]['message']['content']
            except Exception as e:
                print(f"NVIDIA API Error: {e}")

        payload = {
            "response": ai_response,
            "products": ProductSerializer(retrieved[:3], many=True).data,
            "sources": [{"id": product.id, "name": product.name} for product in retrieved],
            "retrieval": {"strategy": "hybrid_catalog", "count": len(retrieved)},
        }
        cache.set(cache_key, payload, timeout=300)
        return Response(payload)

class TriggerDealsCronAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        """
        Secure webhook / cron endpoint to update live market prices, graphs & store links.
        Must be invoked by GitHub Actions or Vercel Cron with header Authorization: Bearer <CRON_SECRET>
        """
        auth_header = request.headers.get('Authorization', '')
        secret = os.environ.get('CRON_SECRET', '')

        if not secret or auth_header != f"Bearer {secret}":
            return Response({"error": "Unauthorized cron request"}, status=status.HTTP_401_UNAUTHORIZED)
        
        from scripts.update_live_deals import update_all_deals
        res = update_all_deals()
        return Response(res, status=status.HTTP_200_OK)
