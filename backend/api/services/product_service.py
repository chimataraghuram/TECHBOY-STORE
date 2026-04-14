from datetime import timedelta
from django.utils import timezone
from django.db.models import Count, ExpressionWrapper, IntegerField, F, Q
from api.models import Product, ClickTrack

def get_trending_products(limit=10):
    # Score = clicks_last_24h * 2 + total_clicks
    last_24h = timezone.now() - timedelta(days=1)
    
    products = Product.objects.annotate(
        total_clicks=Count('clicks'),
        clicks_24h=Count('clicks', filter=Q(clicks__timestamp__gte=last_24h))
    ).annotate(
        trending_score=ExpressionWrapper(
            F('clicks_24h') * 2 + F('total_clicks'),
            output_field=IntegerField()
        )
    ).order_by('-trending_score')[:limit]
    
    return products

def get_recommendations(product, limit=5):
    # Same category products, similar price range (+/- 20%)
    min_price = product.price * 0.8
    max_price = product.price * 1.2
    
    recommendations = Product.objects.filter(
        category=product.category,
        price__gte=min_price,
        price__lte=max_price
    ).exclude(id=product.id)[:limit]
    
    return recommendations

def get_featured_products(limit=6):
    # Highest rated and expensive products (Premium selection)
    return Product.objects.order_by('-rating', '-price')[:limit]

def compare_products(product_ids):
    products = list(Product.objects.filter(id__in=product_ids))
    
    lowest_price_id = None
    highest_price_id = None
    best_value_id = None
    
    lowest_price = float('inf')
    highest_price = 0
    highest_score = -1
    
    all_spec_keys = set()
    
    for p in products:
        # Price tracking
        if p.price < lowest_price:
            lowest_price = p.price
            lowest_price_id = p.id
        if p.price > highest_price:
            highest_price = p.price
            highest_price_id = p.id
            
        # Specs tracking
        if isinstance(p.specs, dict):
            # Best value tracking (score logic: len(specs) / price)
            if p.price and p.price > 0:
                score = (len(p.specs.keys()) / p.price) * 1000
                if score > highest_score:
                    highest_score = score
                    best_value_id = p.id
                    
            for key in p.specs.keys():
                all_spec_keys.add(key)
                
    specs_comparison = {}
    for key in all_spec_keys:
        specs_comparison[key] = []
        for p in products:
            val = p.specs.get(key, "N/A") if isinstance(p.specs, dict) else "N/A"
            specs_comparison[key].append(val)
            
    return products, {
        "price": {
            "lowest": lowest_price_id,
            "highest": highest_price_id
        },
        "specs": specs_comparison,
        "winner": best_value_id
    }
