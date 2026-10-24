from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.utils import timezone
from django.conf import settings
from django.db.models import Q
from api.models import PriceAlert
from api.services.email_service import send_price_drop_alert_email

def check_and_send_price_alerts(price_history):
    """
    Checks active alerts for the given product and sends emails 
    if the new price meets or drops below the target price.
    Uses Resend email service with standard SMTP as graceful fallback.
    """
    product = price_history.product
    new_price = price_history.price

    # Find all active alerts for this product where target_price is met or any drop occurred
    triggered_alerts = PriceAlert.objects.filter(
        Q(product=product, alert_type='TARGET', target_price__gte=new_price) |
        Q(product=product, alert_type='ANY', current_price__gt=new_price),
        is_active=True,
    ).select_related('user')

    if not triggered_alerts.exists():
        return

    for alert in triggered_alerts:
        user = alert.user

        # Never send the same checkpoint twice, and do not resend after a small rebound.
        if alert.last_notified_price is not None and new_price >= alert.last_notified_price:
            continue
        recipient = alert.email or (user.email if user else None)
        if not recipient:
            continue
        
        old_price = alert.current_price or alert.last_notified_price

        # 1. Try sending via Resend first
        res = send_price_drop_alert_email(
            to_email=recipient,
            product_name=product.name,
            old_price=old_price,
            new_price=new_price,
            product_image=getattr(product, 'image', None),
            deal_link=product.amazon_link or product.flipkart_link or "https://techboy-store.vercel.app/"
        )

        sent_successfully = bool(res)

        # 2. Fallback to standard Django SMTP if Resend was not configured or failed
        if not sent_successfully:
            try:
                subject = f"🚨 Price Drop Alert: {product.name} is now ₹{new_price:,}!"
                html_content = f"""
                <html>
                    <body style="font-family: Arial, sans-serif; background-color: #0d0d0d; color: #f5f5f5; padding: 20px;">
                        <div style="max-width: 600px; margin: 0 auto; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 31, 61, 0.3); border-radius: 12px; padding: 30px; text-align: center;">
                            <h1 style="color: #ff1f3d;">TECHBOY STORE</h1>
                            <h2>Great News!</h2>
                            <p style="font-size: 16px;">The price for <strong>{product.name}</strong> dropped to ₹{new_price:,}.</p>
                            <a href="https://techboy-store.vercel.app/" style="display: inline-block; padding: 12px 24px; background: #ff1f3d; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 10px;">View Product</a>
                        </div>
                    </body>
                </html>
                """
                msg = EmailMultiAlternatives(
                    subject,
                    strip_tags(html_content),
                    getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@techboystore.com'),
                    [recipient]
                )
                msg.attach_alternative(html_content, "text/html")
                msg.send()
                sent_successfully = True
            except Exception as e:
                print(f"[AlertService] Failed fallback email to {recipient}: {e}")

        if sent_successfully:
            alert.last_notified_price = new_price
            alert.last_notified_at = timezone.now()
            alert.alert_sent = True
            alert.current_price = new_price
            alert.save(update_fields=['last_notified_price', 'last_notified_at', 'alert_sent', 'current_price'])


def send_watchlist_price_drop_email(user, product, old_price, new_price):
    """
    Sends a price drop alert for users watching a phone in their watchlist.
    """
    if not user.email:
        return False

    res = send_price_drop_alert_email(
        to_email=user.email,
        product_name=product.name,
        old_price=old_price,
        new_price=new_price,
        product_image=getattr(product, 'image', None),
        deal_link=product.amazon_link or product.flipkart_link or "https://techboy-store.vercel.app/"
    )
    return bool(res)
