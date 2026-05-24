import os
import json
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import Product

def populate():
    # Read the parsed phones data
    repo_root = os.path.dirname(os.path.dirname(__file__))
    json_path = os.path.join(repo_root, 'frontend', 'src', 'data', 'phones.json')
    with open(json_path, 'r', encoding='utf-8') as f:
        products_data = json.load(f)

    Product.objects.all().delete()
    
    for p in products_data:
        # Map the JSON data to the Product model fields
        product_dict = {
            "name": p.get("name"),
            "price": p.get("price", 0),
            "category": p.get("category"),
            "tag": p.get("tag", ""),
            "description": p.get("description", ""),
            "image": p.get("image") or "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
            "amazon_link": p.get("amazonLink") or "https://amazon.in",
            "flipkart_link": p.get("flipkartLink") or "https://flipkart.com",
            "brand": p.get("brand") or (p.get("name", "").split(" ")[0] if p.get("name") else ""),
            "rating": p.get("rating", 4.4),
            "specs": p.get("specs", {})
        }
        Product.objects.create(**product_dict)
        
    print(f"Successfully populated {len(products_data)} products from phones.json.")

if __name__ == '__main__':
    populate()
