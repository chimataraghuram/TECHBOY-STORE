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
        "image": "https://m.media-amazon.com/images/I/71RovE-O3EL._SL1500_.jpg", 
        "amazon_link": "https://amazon.in", "flipkart_link": "https://flipkart.com",
        "specs": { "display": "6.6' 90Hz", "ram": "4GB", "battery": "5000mAh", "camera": "50MP" }
    },
    { 
        "name": "Lava Play Storm", "price": 9999, "category": "Under ₹10,000", "tag": "Gamer's Choice",
        "description": "Only phone under 10k with a 120Hz refresh rate and gaming-tuned chipset.", 
        "image": "https://m.media-amazon.com/images/I/71X8k8uI1bL._SL1500_.jpg", 
        "amazon_link": "https://amazon.in", "flipkart_link": "https://flipkart.com",
        "specs": { "display": "6.7' 120Hz", "ram": "8GB", "battery": "6000mAh", "camera": "50MP" }
    },
    
    # Under ₹15,000
    { 
        "name": "POCO M7 Plus", "price": 12499, "category": "Under ₹15,000", "tag": "Value",
        "description": "A perfect balance of performance and display quality for budget users.", 
        "image": "https://m.media-amazon.com/images/I/61fva6y+uRL._SL1500_.jpg", 
        "amazon_link": "https://amazon.in", "flipkart_link": "https://flipkart.com",
        "specs": { "display": "6.7' 90Hz", "ram": "6GB", "battery": "5000mAh", "camera": "50MP" }
    },
    { 
        "name": "Samsung M15 5G", "price": 13999, "category": "Under ₹15,000", "tag": "Reliable",
        "description": "Massive 6000mAh battery and a beautiful sAMOLED display from a trusted brand.", 
        "image": "https://m.media-amazon.com/images/I/81Sc6A+aZ4L._SL1500_.jpg", 
        "amazon_link": "https://amazon.in", "flipkart_link": "https://flipkart.com",
        "specs": { "display": "6.5' sAMOLED", "ram": "6GB", "battery": "6000mAh", "camera": "50MP" }
    },

    # Under ₹20,000
    { 
        "name": "Infinix GT 30 5G", "price": 19999, "category": "Under ₹20,000", "tag": "Esports Edition",
        "description": "Highest RAM in the segment (12GB) and a unique cyber-gaming design.", 
        "image": "https://m.media-amazon.com/images/I/81I6mB1I8uL._SL1500_.jpg", 
        "amazon_link": "https://amazon.in", "flipkart_link": "https://flipkart.com",
        "specs": { "display": "6.7' 144Hz", "ram": "12GB", "battery": "5000mAh", "camera": "108MP" }
    },
    { 
        "name": "Redmi Note 15 5G", "price": 18999, "category": "Under ₹20,000", "tag": "Camera King",
        "description": "Incredible 200MP sensor that captures ultra-clear details in daylight.", 
        "image": "https://m.media-amazon.com/images/I/71m6k+uN3uL._SL1500_.jpg", 
        "amazon_link": "https://amazon.in", "flipkart_link": "https://flipkart.com",
        "specs": { "display": "6.6' AMOLED", "ram": "8GB", "battery": "5000mAh", "camera": "200MP" }
    },

    # High End
    { 
        "name": "iPhone 16 Pro Max", "price": 144900, "category": "₹1 Lakh+", "tag": "Premium",
        "description": "Unmatched video recording quality and the fastest mobile processor in the world.", 
        "image": "https://m.media-amazon.com/images/I/61VfL-39L3L._SL1500_.jpg", 
        "amazon_link": "https://amazon.in", "flipkart_link": "https://flipkart.com",
        "specs": { "display": "6.9' ProMotion", "ram": "8GB", "battery": "4676mAh", "camera": "48MP Triple" }
    },
    { 
        "name": "Samsung S25 Ultra", "price": 129999, "category": "₹1 Lakh+", "tag": "Ultimate",
        "description": "The absolute gold standard for productivity, zoom camera, and display quality.", 
        "image": "https://m.media-amazon.com/images/I/71fva6y+uRL._SL1500_.jpg", 
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
