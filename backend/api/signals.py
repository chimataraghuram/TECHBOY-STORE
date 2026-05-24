import os
import requests
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from django.conf import settings
from .models import Product, Watchlist, PriceHistory
from api.services.alert_service import send_watchlist_price_drop_email

@receiver(pre_save, sender=Product)
def cache_old_price(sender, instance, **kwargs):
    """
    Caches the old price of a product before it's saved so we can detect drops.
    """
    if instance.pk:
        try:
            old_product = Product.objects.get(pk=instance.pk)
            instance._old_price = old_product.price
        except Product.DoesNotExist:
            instance._old_price = None
    else:
        instance._old_price = None

@receiver(post_save, sender=Product)
def trigger_price_drop_webhook(sender, instance, created, **kwargs):
    """
    Records price history, checks price drops, and fires n8n/email alerts.
    """
    old_price = getattr(instance, '_old_price', None)

    if created:
        PriceHistory.objects.get_or_create(product=instance, price=instance.price)
        return

    if old_price is None or instance.price == old_price:
        return

    PriceHistory.objects.create(product=instance, price=instance.price)

    if instance.price >= old_price:
        return

    watchers = Watchlist.objects.filter(product=instance).select_related('user')
    emails = [watcher.user.email for watcher in watchers if watcher.user.email]

    if not emails:
        return

    webhook_url = getattr(settings, 'N8N_WEBHOOK_URL', None) or os.environ.get('N8N_WEBHOOK_URL')
    payload = {
        "event": "price_drop",
        "product_name": instance.name,
        "product_id": instance.pk,
        "old_price": old_price,
        "new_price": instance.price,
        "discount_amount": old_price - instance.price,
        "product_image": instance.image or "",
        "target_emails": emails
    }

    if webhook_url:
        try:
            requests.post(webhook_url, json=payload, timeout=5)
            return
        except requests.exceptions.RequestException as e:
            print(f"[TechBoy] Failed to post price drop to n8n Webhook: {e}")

    for watcher in watchers:
        send_watchlist_price_drop_email(watcher.user, instance, old_price, instance.price)


from api.tasks import process_price_alerts

@receiver(post_save, sender=PriceHistory)
def trigger_global_price_alerts(sender, instance, created, **kwargs):
    """
    Triggers checking of global PriceAlerts whenever a new PriceHistory is recorded.
    Runs synchronously to be compatible with free hosts like PythonAnywhere.
    """
    if created:
        process_price_alerts(instance.id)
