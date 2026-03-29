from rest_framework import generics, viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Product, ClickTrack
from .serializers import (
    UserSerializer, 
    RegisterSerializer, 
    CustomTokenObtainPairSerializer,
    ProductSerializer,
    ClickTrackSerializer
)

User = get_user_model()

# --- Auth Views ---

class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                "token": str(refresh.access_token),
                "user": UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response({"error": "Invalid request", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

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
    filterset_fields = ['category']
    search_fields = ['name', 'category']

class CompareAPIView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        product_ids = request.data.get('products', [])
        if not isinstance(product_ids, list):
            return Response({"error": "Invalid request. 'products' should be a list of IDs."}, status=status.HTTP_400_BAD_REQUEST)
        
        products = Product.objects.filter(id__in=product_ids)
        serializer = ProductSerializer(products, many=True)
        return Response({
            "products": serializer.data
        })

class TrackClickAPIView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = ClickTrackSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Click tracked successfully"}, status=status.HTTP_201_CREATED)
        return Response({"error": "Invalid request", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
