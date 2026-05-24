from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from api.models import PriceAlert

def check_and_send_price_alerts(price_history):
    """
    Checks active alerts for the given product and sends emails 
    if the new price meets or drops below the target price.
    """
    product = price_history.product
    new_price = price_history.price

    # Find all active alerts for this product where the target_price is greater than or equal to the new price
    triggered_alerts = PriceAlert.objects.filter(
        product=product,
        target_price__gte=new_price,
        is_active=True
    ).select_related('user')

    if not triggered_alerts.exists():
        return

    for alert in triggered_alerts:
        user = alert.user
        
        # Prepare email content
        subject = f"🚨 Price Drop Alert: {product.name} is now ₹{new_price}!"
        
        # We can construct a simple HTML email with inline styling for neon aesthetics
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; background-color: #0d0d0d; color: #f5f5f5; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 140, 66, 0.2); border-radius: 12px; padding: 30px; text-align: center;">
                    <h1 style="color: #ff8c42; text-shadow: 0 0 10px rgba(255, 140, 66, 0.5);">TECHBOY STORE</h1>
                    <h2>Great News, {user.username}!</h2>
                    <p style="font-size: 16px;">The price for <strong>{product.name}</strong> has dropped below your target of ₹{alert.target_price}.</p>
                    <div style="margin: 20px 0; padding: 15px; background: rgba(255, 140, 66, 0.1); border-radius: 8px;">
                        <h3 style="margin: 0; font-size: 24px; color: #fff;">Current Price: <span style="color: #00e676;">₹{new_price}</span></h3>
                    </div>
                    <p>Grab it before the price goes back up!</p>
                    <a href="https://techboy-store.vercel.app/" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #ff8c42, #e53935); color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 10px;">View Product</a>
                </div>
            </body>
        </html>
        """
        text_content = strip_tags(html_content)

        msg = EmailMultiAlternatives(
            subject,
            text_content,
            getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@techboystore.com'),
            [user.email]
        )
        msg.attach_alternative(html_content, "text/html")
        
        try:
            msg.send()
            # Mark alert as inactive after fulfilling it
            alert.is_active = False
            alert.save()
        except Exception as e:
            # Depending on how logging is handled
            print(f"Failed to send email to {user.email}: {str(e)}")


def send_watchlist_price_drop_email(user, product, old_price, new_price):
    """
    Sends a direct email fallback for watchlist users when n8n is not configured.
    """
    if not user.email:
        return False

    discount_amount = old_price - new_price
    subject = f"Price Drop Alert: {product.name} is now Rs {new_price}!"
    html_content = f"""
    <html>
        <body style="font-family: Arial, sans-serif; background-color: #0d0d0d; color: #f5f5f5; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: #160407; border: 1px solid rgba(255, 31, 61, 0.35); border-radius: 16px; padding: 28px;">
                <h1 style="color: #ff1f3d; margin-top: 0;">TECHBOY STORE</h1>
                <h2>Price dropped for {product.name}</h2>
                <p>Good news, {user.username}. A phone on your watchlist just became cheaper.</p>
                <p><b>Old price:</b> Rs {old_price}</p>
                <p><b>New price:</b> Rs {new_price}</p>
                <p><b>You save:</b> Rs {discount_amount}</p>
                <a href="https://techboy-store.vercel.app/" style="display: inline-block; padding: 12px 18px; background: linear-gradient(135deg, #ff1f3d, #ff4d2e); color: #fff; text-decoration: none; border-radius: 10px; font-weight: bold;">Open TechBoy Store</a>
            </div>
        </body>
    </html>
    """
    text_content = strip_tags(html_content)

    msg = EmailMultiAlternatives(
        subject,
        text_content,
        getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@techboystore.com'),
        [user.email]
    )
    msg.attach_alternative(html_content, "text/html")

    try:
        msg.send()
        return True
    except Exception as e:
        print(f"Failed to send watchlist price drop email to {user.email}: {str(e)}")
        return False
