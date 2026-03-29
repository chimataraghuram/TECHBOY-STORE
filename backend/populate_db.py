import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import Product

products_data = [
    # Under ₹10,000
    { 
        "name": "Tecno Spark Go 5G", "price": 8999, "category": "Under ₹10,000", "tag": "Budget King",
        "description": "Unbeatable 5G connectivity at this price point with a smooth 90Hz display.", 
        "image": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80", 
        "amazon_link": "https://amazon.in", "flipkart_link": "https://flipkart.com",
        "specs": { "display": "6.6' 90Hz", "ram": "4GB", "battery": "5000mAh", "camera": "50MP" }
    },
    { 
        "name": "Lava Play Storm", "price": 9999, "category": "Under ₹10,000", "tag": "Gamer's Choice",
        "description": "Only phone under 10k with a 120Hz refresh rate and gaming-tuned chipset.", 
        "image": "https://images.unsplash.com/photo-1592890288564-76628a30a657?w=800&q=80", 
        "amazon_link": "https://amazon.in", "flipkart_link": "https://flipkart.com",
        "specs": { "display": "6.7' 120Hz", "ram": "8GB", "battery": "6000mAh", "camera": "50MP" }
    },
    
    # Under ₹15,000
    { 
        "name": "POCO M7 Plus", "price": 12499, "category": "Under ₹15,000", "tag": "Value",
        "description": "A perfect balance of performance and display quality for budget users.", 
        "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80", 
        "amazon_link": "https://amazon.in", "flipkart_link": "https://flipkart.com",
        "specs": { "display": "6.7' 90Hz", "ram": "6GB", "battery": "5000mAh", "camera": "50MP" }
    },
    { 
        "name": "Samsung M15 5G", "price": 13999, "category": "Under ₹15,000", "tag": "Reliable",
        "description": "Massive 6000mAh battery and a beautiful sAMOLED display from a trusted brand.", 
        "image": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80", 
        "amazon_link": "https://amazon.in", "flipkart_link": "https://flipkart.com",
        "specs": { "display": "6.5' sAMOLED", "ram": "6GB", "battery": "6000mAh", "camera": "50MP" }
    },

    # Under ₹20,000
    { 
        "name": "Infinix GT 30 5G", "price": 19999, "category": "Under ₹20,000", "tag": "Esports Edition",
        "description": "Highest RAM in the segment (12GB) and a unique cyber-gaming design.", 
        "image": "https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=800&q=80", 
        "amazon_link": "https://amazon.in", "flipkart_link": "https://flipkart.com",
        "specs": { "display": "6.7' 144Hz", "ram": "12GB", "battery": "5000mAh", "camera": "108MP" }
    },
    { 
        "name": "Redmi Note 15 5G", "price": 18999, "category": "Under ₹20,000", "tag": "Camera King",
        "description": "Incredible 200MP sensor that captures ultra-clear details in daylight.", 
        "image": "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=800&q=80", 
        "amazon_link": "https://amazon.in", "flipkart_link": "https://flipkart.com",
        "specs": { "display": "6.6' AMOLED", "ram": "8GB", "battery": "5000mAh", "camera": "200MP" }
    },

    # High End
    { 
        "name": "iPhone 16 Pro Max", "price": 144900, "category": "₹1 Lakh+", "tag": "Premium",
        "description": "Unmatched video recording quality and the fastest mobile processor in the world.", 
        "image": "https://images.unsplash.com/photo-1678911820864-e2c567c655d7?w=800&q=80", 
        "amazon_link": "https://amazon.in", "flipkart_link": "https://flipkart.com",
        "specs": { "display": "6.9' ProMotion", "ram": "8GB", "battery": "4676mAh", "camera": "48MP Triple" }
    },
    { 
        "name": "Samsung S25 Ultra", "price": 129999, "category": "₹1 Lakh+", "tag": "Ultimate",
        "description": "The absolute gold standard for productivity, zoom camera, and display quality.", 
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59d?w=800&q=80", 
        "amazon_link": "https://amazon.in", "flipkart_link": "https://flipkart.com",
        "specs": { "display": "6.8' QHD+", "ram": "12GB", "battery": "5000mAh", "camera": "200MP Quad" }
    },
]

def populate():
    Product.objects.all().delete()
    for p in products_data:
        Product.objects.create(**p)
    print(f"Successfully populated {len(products_data)} products with full specs.")

if __name__ == '__main__':
    populate()
