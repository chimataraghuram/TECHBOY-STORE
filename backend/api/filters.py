import django_filters
from .models import Product

class ProductFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name="price", lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name="price", lookup_expr='lte')
    category = django_filters.CharFilter(field_name='category', lookup_expr='iexact')
    brand = django_filters.CharFilter(field_name='brand', lookup_expr='iexact')
    tag = django_filters.CharFilter(field_name='tag', lookup_expr='iexact')
    min_rating = django_filters.NumberFilter(field_name='rating', lookup_expr='gte')
    
    class Meta:
        model = Product
        fields = ['category', 'brand', 'tag', 'min_price', 'max_price', 'min_rating']
