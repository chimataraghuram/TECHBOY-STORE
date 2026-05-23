from .models import Product, ClickTrack, PriceHistory
from django_q.tasks import async_task

def track_click_task(product_id, source):
    try:
        product = Product.objects.get(id=product_id)
        ClickTrack.objects.create(product=product, source=source)
    except Product.DoesNotExist:
        pass

def process_price_alerts(price_history_id):
    """
    Task to process price alerts asynchronously.
    """
    from api.services.alert_service import check_and_send_price_alerts
    try:
        price_history = PriceHistory.objects.get(id=price_history_id)
        check_and_send_price_alerts(price_history)
    except PriceHistory.DoesNotExist:
        pass
