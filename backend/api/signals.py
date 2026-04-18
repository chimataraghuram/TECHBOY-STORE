import os
import requests
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from django.conf import settings
from .models import Product, Watchlist

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
    Intercepts the save, checks if the price decreased, and fires n8n webhook.
    """
    if not created and hasattr(instance, '_old_price') and instance._old_price is not None:
        if instance.price < instance._old_price:
            # The Price Dropped! Find all users tracking this on their Watchlist
            watchers = Watchlist.objects.filter(product=instance).select_related('user')
            
            if not watchers.exists():
                return
                
            # Compress emails into a list
            emails = [watcher.user.email for watcher in watchers if watcher.user.email]
            
            if not emails:
                return

            webhook_url = getattr(settings, 'N8N_WEBHOOK_URL', None) or os.environ.get('N8N_WEBHOOK_URL')

            if webhook_url:
                payload = {
                    "event": "price_drop",
                    "product_name": instance.name,
                    "product_id": instance.pk,
                    "old_price": instance._old_price,
                    "new_price": instance.price,
                    "discount_amount": instance._old_price - instance.price,
                    "product_image": instance.image or "",
                    "target_emails": emails
                }
                
                try:
                    # Fire-and-forget logic for webhooks
                    requests.post(webhook_url, json=payload, timeout=5)
                except requests.exceptions.RequestException as e:
                    print(f"[TechBoy] Failed to post price drop to n8n Webhook: {e}")
