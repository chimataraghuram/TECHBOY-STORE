from django.contrib import admin
from django.http import JsonResponse
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView


def health(request):
    """Lightweight liveness probe used by uptime monitors / deploy platforms."""
    return JsonResponse({"status": "ok"})


urlpatterns = [
    path('admin/', admin.site.urls),
    path('health/', health, name='health'),
    path('health', health),
    path('api/', include('api.urls')),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]
