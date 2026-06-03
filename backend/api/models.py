from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    google_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    firebase_uid = models.CharField(max_length=255, unique=True, null=True, blank=True)
    profile_picture = models.URLField(max_length=1024, null=True, blank=True)
    display_name = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self):
        return self.username

class Product(models.Model):
    name = models.CharField(max_length=255)
    price = models.IntegerField(db_index=True)
    description = models.TextField()
    image = models.URLField(max_length=1024)
    amazon_link = models.URLField(max_length=1024, blank=True, null=True)
    flipkart_link = models.URLField(max_length=1024, blank=True, null=True)
    category = models.CharField(max_length=100, db_index=True)
    brand = models.CharField(max_length=100, blank=True, null=True, db_index=True)
    rating = models.FloatField(default=0.0)
    tag = models.CharField(max_length=100, blank=True, null=True)
    specs = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    def __str__(self):
        return self.name

class ClickTrack(models.Model):
    SOURCE_CHOICES = [
        ('amazon', 'Amazon'),
        ('flipkart', 'Flipkart')
    ]
    user = models.ForeignKey(CustomUser, null=True, blank=True, on_delete=models.SET_NULL, related_name='clicks')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='clicks')
    source = models.CharField(max_length=20, choices=SOURCE_CHOICES)
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)

    def __str__(self):
        return f"{self.product.name} - {self.source} - {self.timestamp}"
class PriceHistory(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='price_history')
    price = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product.name} - ₹{self.price} @ {self.timestamp}"

class PriceAlert(models.Model):
    ALERT_TYPES = [
        ('ANY', 'Any Change'),
        ('TARGET', 'Target Price')
    ]
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='alerts', null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    product_name = models.CharField(max_length=255, null=True, blank=True)
    current_price = models.IntegerField(null=True, blank=True)
    alert_type = models.CharField(max_length=50, choices=ALERT_TYPES, default='ANY')
    target_price = models.IntegerField(null=True, blank=True)
    alert_sent = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        ident = self.email if self.email else (self.user.username if self.user else 'Unknown')
        return f"{ident} - {self.product.name} ({self.alert_type})"

class Watchlist(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='watchlist')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='watchlisted_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')

    def __str__(self):
        return f"{self.user.username} watching {self.product.name}"
