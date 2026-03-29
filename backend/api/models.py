from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.username

class Product(models.Model):
    name = models.CharField(max_length=255)
    price = models.IntegerField()
    description = models.TextField()
    image = models.URLField(max_length=1024)
    amazon_link = models.URLField(max_length=1024, blank=True, null=True)
    flipkart_link = models.URLField(max_length=1024, blank=True, null=True)
    category = models.CharField(max_length=100)
    tag = models.CharField(max_length=100, blank=True, null=True)
    specs = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class ClickTrack(models.Model):
    SOURCE_CHOICES = [
        ('amazon', 'Amazon'),
        ('flipkart', 'Flipkart')
    ]
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='clicks')
    source = models.CharField(max_length=20, choices=SOURCE_CHOICES)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product.name} - {self.source} - {self.timestamp}"
