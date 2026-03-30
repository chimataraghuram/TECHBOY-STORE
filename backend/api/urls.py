from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView, 
    CustomTokenObtainPairView, 
    ProfileView,
    ProductViewSet,
    CompareAPIView,
    TrackClickAPIView,
    PriceHistoryViewSet,
    PriceAlertViewSet,
    ChatbotAPIView
)

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'price-history', PriceHistoryViewSet, basename='price-history')
router.register(r'alerts', PriceAlertViewSet, basename='alerts')

urlpatterns = [
    # Auth Endpoints
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('auth/profile/', ProfileView.as_view(), name='profile'),
    
    # Feature Endpoints
    path('compare/', CompareAPIView.as_view(), name='compare'),
    path('track-click/', TrackClickAPIView.as_view(), name='track-click'),
    path('chatbot/', ChatbotAPIView.as_view(), name='chatbot'),
    
    # Router covers products/ API
    path('', include(router.urls)),
]
