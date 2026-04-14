from .models import Product, ClickTrack

def track_click_task(product_id, source):
    try:
        product = Product.objects.get(id=product_id)
        ClickTrack.objects.create(product=product, source=source)
    except Product.DoesNotExist:
        pass
