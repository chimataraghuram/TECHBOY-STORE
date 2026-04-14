from django.db.models import Count
from api.models import ClickTrack

def track_click(product_id, source, user=None):
    return ClickTrack.objects.create(
        product_id=product_id,
        source=source,
        user=user
    )

def get_top_products(limit=10):
    # Returns { "product_id": 1, "clicks": 120 }
    return ClickTrack.objects.values('product_id').annotate(clicks=Count('id')).order_by('-clicks')[:limit]

def get_source_breakdown():
    # Returns summary of clicks per source
    return ClickTrack.objects.values('source').annotate(clicks=Count('id')).order_by('-clicks')
