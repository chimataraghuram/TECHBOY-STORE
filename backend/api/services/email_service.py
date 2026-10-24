import os
import logging
import resend

logger = logging.getLogger(__name__)

# Configure Resend API Key
RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
RESEND_FROM_EMAIL = os.environ.get('RESEND_FROM_EMAIL', 'TechBoy Store <onboarding@resend.dev>')

if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY


def send_email_via_resend(to_email: str, subject: str, html_content: str):
    """
    Sends an email using Resend API.
    Gracefully logs error if sending fails or if API key is missing.
    """
    if not RESEND_API_KEY:
        logger.warning(f"[Resend] Skipped email to {to_email} - RESEND_API_KEY is not set.")
        return None

    try:
        params: resend.Emails.SendParams = {
            "from": RESEND_FROM_EMAIL,
            "to": [to_email],
            "subject": subject,
            "html": html_content,
        }
        response = resend.Emails.send(params)
        logger.info(f"[Resend] Email sent successfully to {to_email}: {response}")
        return response
    except Exception as e:
        logger.error(f"[Resend] Failed to send email to {to_email}: {e}")
        return None


def send_welcome_email(user_email: str, user_name: str = "Tech Explorer"):
    """
    Triggered when a new user registers or signs up via Google Auth.
    """
    subject = "⚡ Welcome to TechBoy Store - Smartphone Intelligence Platform"
    
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #07070c; color: #ffffff; margin: 0; padding: 24px; }}
            .container {{ max-width: 600px; margin: 0 auto; background: #0d0d17; border: 1px solid rgba(255, 31, 61, 0.25); border-radius: 20px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.8); }}
            .header {{ background: linear-gradient(135deg, rgba(255, 31, 61, 0.2) 0%, rgba(13, 13, 23, 0) 100%); padding: 36px 30px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); text-align: center; }}
            .logo {{ font-size: 26px; font-weight: 900; letter-spacing: -0.5px; color: #ffffff; text-transform: uppercase; }}
            .logo span {{ color: #ff1f3d; }}
            .content {{ padding: 36px 30px; }}
            .title {{ font-size: 22px; font-weight: 800; color: #ffffff; margin-bottom: 12px; }}
            .text {{ font-size: 15px; line-height: 1.6; color: #a1a1aa; margin-bottom: 24px; }}
            .features {{ background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 14px; padding: 20px; margin-bottom: 28px; }}
            .feature-item {{ display: flex; align-items: center; margin-bottom: 12px; font-size: 14px; color: #e4e4e7; }}
            .feature-item:last-child {{ margin-bottom: 0; }}
            .badge {{ display: inline-block; padding: 3px 8px; border-radius: 6px; background: rgba(255, 31, 61, 0.15); color: #ff4d66; font-size: 11px; font-weight: 700; margin-right: 10px; }}
            .btn-wrap {{ text-align: center; margin: 30px 0; }}
            .btn {{ display: inline-block; background: linear-gradient(135deg, #ff1f3d 0%, #b8001f 100%); color: #ffffff; text-decoration: none; padding: 14px 34px; border-radius: 12px; font-weight: 800; font-size: 14px; letter-spacing: 0.3px; box-shadow: 0 8px 24px rgba(255, 31, 61, 0.4); }}
            .footer {{ padding: 20px 30px; text-align: center; font-size: 12px; color: #71717a; border-top: 1px solid rgba(255, 255, 255, 0.06); }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">TECHBOY<span>STORE</span></div>
                <div style="font-size: 11px; color: #ff1f3d; font-weight: 700; letter-spacing: 2px; margin-top: 6px;">NEXT-GEN SMARTPHONE INTELLIGENCE</div>
            </div>
            <div class="content">
                <div class="title">Welcome aboard, {user_name}! 🚀</div>
                <div class="text">
                    Your account has been successfully created. You now have access to real-time price tracking, verified specs, AI smartphone comparison, and instant drop alerts.
                </div>
                <div class="features">
                    <div class="feature-item"><span class="badge">LIVE TRACK</span> Set target alerts on any smartphone &amp; get emailed instantly on drops.</div>
                    <div class="feature-item"><span class="badge">AI MATRIX</span> Compare camera, battery, and benchmarks side-by-side.</div>
                    <div class="feature-item"><span class="badge">VERIFIED</span> Accurate deals scraped live from official stores.</div>
                </div>
                <div class="btn-wrap">
                    <a href="https://techboy-store.vercel.app/" class="btn">Explore Smartphones Now &rarr;</a>
                </div>
            </div>
            <div class="footer">
                &copy; TechBoy Store. All rights reserved. You received this because you signed up on TechBoy Store.
            </div>
        </div>
    </body>
    </html>
    """
    return send_email_via_resend(user_email, subject, html)


def send_login_notification_email(user_email: str, user_name: str = "User", ip_address: str = "Unknown", user_agent: str = "Web Browser"):
    """
    Triggered when an existing user logs in (security notification).
    """
    subject = "🔐 New Sign-in to Your TechBoy Store Account"
    
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #07070c; color: #ffffff; margin: 0; padding: 24px; }}
            .container {{ max-width: 560px; margin: 0 auto; background: #0d0d17; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 18px; padding: 32px; box-shadow: 0 16px 40px rgba(0,0,0,0.7); }}
            .logo {{ font-size: 20px; font-weight: 900; color: #ffffff; margin-bottom: 20px; }}
            .logo span {{ color: #ff1f3d; }}
            .title {{ font-size: 19px; font-weight: 800; color: #ffffff; margin-bottom: 12px; }}
            .text {{ font-size: 14px; line-height: 1.6; color: #a1a1aa; margin-bottom: 20px; }}
            .box {{ background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 16px; margin-bottom: 24px; font-size: 13px; color: #d4d4d8; line-height: 1.8; }}
            .footer {{ font-size: 12px; color: #71717a; border-top: 1px solid rgba(255, 255, 255, 0.06); padding-top: 18px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">TECHBOY<span>STORE</span></div>
            <div class="title">Security Notice: New Login Detected</div>
            <div class="text">
                Hello <strong>{user_name}</strong>, a sign-in was just recorded for your TechBoy Store account.
            </div>
            <div class="box">
                <strong>Account:</strong> {user_email}<br>
                <strong>Device/Browser:</strong> {user_agent[:60]}<br>
                <strong>Network IP:</strong> {ip_address}
            </div>
            <div class="text" style="font-size: 13px;">
                If this was you, you can safely disregard this email. If you did not initiate this sign-in, please change your password immediately.
            </div>
            <div class="footer">
                Security Alert &bull; TechBoy Store Intelligence Protection
            </div>
        </div>
    </body>
    </html>
    """
    return send_email_via_resend(user_email, subject, html)


def send_price_drop_alert_email(to_email: str, product_name: str, old_price: int, new_price: int, product_image: str = None, deal_link: str = None):
    """
    Triggered when a price drops to/below the user's alert condition.
    """
    savings = (old_price - new_price) if old_price and old_price > new_price else None
    savings_text = f"Save ₹{savings:,}" if savings else "Price Dropped!"
    
    subject = f"🔥 Price Drop Alert: {product_name} is now ₹{new_price:,}!"
    link = deal_link or "https://techboy-store.vercel.app/"
    image_tag = f'<img src="{product_image}" alt="{product_name}" style="max-height: 180px; max-width: 100%; border-radius: 12px; margin-bottom: 18px; object-fit: contain;">' if product_image else ''

    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #07070c; color: #ffffff; margin: 0; padding: 24px; }}
            .container {{ max-width: 600px; margin: 0 auto; background: #0d0d17; border: 1px solid rgba(255, 31, 61, 0.3); border-radius: 20px; overflow: hidden; box-shadow: 0 25px 60px rgba(255, 31, 61, 0.15); }}
            .header {{ background: linear-gradient(135deg, rgba(255, 31, 61, 0.3) 0%, rgba(13, 13, 23, 0) 100%); padding: 30px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.08); }}
            .tag {{ display: inline-block; background: #10b981; color: #ffffff; font-size: 11px; font-weight: 900; letter-spacing: 1px; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; margin-bottom: 10px; }}
            .title {{ font-size: 24px; font-weight: 900; color: #ffffff; margin: 0; }}
            .content {{ padding: 32px; text-align: center; }}
            .price-card {{ background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 24px; margin: 20px 0; }}
            .old-price {{ font-size: 15px; color: #71717a; text-decoration: line-through; }}
            .new-price {{ font-size: 34px; font-weight: 900; color: #10b981; margin: 6px 0; }}
            .savings-badge {{ display: inline-block; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); color: #10b981; font-weight: 800; font-size: 13px; padding: 5px 14px; border-radius: 20px; }}
            .btn {{ display: inline-block; background: linear-gradient(135deg, #ff1f3d 0%, #b8001f 100%); color: #ffffff; text-decoration: none; padding: 15px 38px; border-radius: 12px; font-weight: 800; font-size: 15px; box-shadow: 0 10px 25px rgba(255, 31, 61, 0.4); margin-top: 20px; }}
            .footer {{ padding: 20px; text-align: center; font-size: 12px; color: #71717a; border-top: 1px solid rgba(255, 255, 255, 0.06); }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <span class="tag">PRICE DROP ALERT</span>
                <h1 class="title">Your Target Price Reached!</h1>
            </div>
            <div class="content">
                {image_tag}
                <h2 style="font-size: 20px; margin: 0 0 10px 0; color: #ffffff;">{product_name}</h2>
                <div class="price-card">
                    {f'<div class="old-price">Previous: ₹{old_price:,}</div>' if old_price else ''}
                    <div class="new-price">₹{new_price:,}</div>
                    <div class="savings-badge">{savings_text}</div>
                </div>
                <p style="color: #a1a1aa; font-size: 14px; line-height: 1.5;">
                    The price for this phone just dropped to meet your alert condition. Deals often sell out quickly — grab it before it resets!
                </p>
                <a href="{link}" class="btn">View Live Deal &rarr;</a>
            </div>
            <div class="footer">
                You are receiving this because you set a price alert on TechBoy Store.
            </div>
        </div>
    </body>
    </html>
    """
    return send_email_via_resend(to_email, subject, html)
