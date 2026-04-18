from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Product, ClickTrack, PriceHistory, PriceAlert, Watchlist

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        # Custom user representation
        data['user'] = UserSerializer(self.user).data
        # Remove refresh token as requirements specify simple { token, user } response
        # If frontend expects exactly 'token' instead of 'access':
        data['token'] = data.pop('access')
        data.pop('refresh', None)
        return data

class ProductSerializer(serializers.ModelSerializer):
    score = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'description', 'image', 'amazon_link', 'flipkart_link', 'category', 'brand', 'rating', 'tag', 'specs', 'score']

    def get_score(self, obj):
        if obj.price and obj.price > 0 and isinstance(obj.specs, dict):
            # Scale score for cleanliness 
            score = (len(obj.specs.keys()) / obj.price) * 1000
            return round(score, 4)
        return 0.0

class ClickTrackSerializer(serializers.ModelSerializer):
    # accept product_id instead of full product object for ease of posting
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='product', write_only=True
    )

    class Meta:
        model = ClickTrack
        fields = ['product_id', 'source']

class PriceHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PriceHistory
        fields = ['id', 'product', 'price', 'timestamp']

class PriceAlertSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    product_name = serializers.ReadOnlyField(source='product.name')

    class Meta:
        model = PriceAlert
        fields = ['id', 'user', 'product', 'product_name', 'target_price', 'is_active', 'created_at']

class WatchlistSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    product_details = ProductSerializer(source='product', read_only=True)

    class Meta:
        model = Watchlist
        fields = ['id', 'user', 'product', 'product_details', 'created_at']
