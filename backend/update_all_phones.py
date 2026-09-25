import os
import json
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import Product, PriceHistory

# Curated, top-tier mobile phones for every single price category with authentic specs, tags & links
CURATED_PHONES = [
  # --- Under ₹10K ---
  {
    "id": 1,
    "name": "Tecno Spark 30C",
    "tag": "🎮 Best Gaming",
    "category": "Under ₹10K",
    "brand": "Tecno",
    "price": 8499,
    "description": "Chip: Helio G88 | Display: 6.67\" 90Hz IPS | Camera: 50MP | Battery: 5000mAh 18W | RAM: 8GB | Storage: 128GB",
    "image": "/images/phones/tecno-spark-30c.png",
    "amazonLink": "https://www.amazon.in/s?k=Tecno+Spark+30C&tag=techboy-21",
    "flipkartLink": "https://www.flipkart.com/search?q=Tecno+Spark+30C&affid=techboy",
    "rating": 4.3,
    "specs": {"Processor": "MediaTek Helio G88", "Display": "6.67\" 90Hz IPS LCD", "Camera": "50MP AI Main", "Battery": "5000mAh 18W", "RAM": "8GB", "Storage": "128GB"}
  },
  {
    "id": 2,
    "name": "Redmi 13C 5G",
    "tag": "📷 Best Camera",
    "category": "Under ₹10K",
    "brand": "Xiaomi",
    "price": 9299,
    "description": "Chip: Dimensity 6100+ | Display: 6.74\" 90Hz LCD | Camera: 50MP AI | Battery: 5000mAh 18W | RAM: 4GB | Storage: 128GB",
    "image": "/images/phones/redmi-13c-5g.png",
    "amazonLink": "https://www.amazon.in/s?k=Redmi+13C+5G&tag=techboy-21",
    "flipkartLink": "https://www.flipkart.com/search?q=Redmi+13C+5G&affid=techboy",
    "rating": 4.4,
    "specs": {"Processor": "MediaTek Dimensity 6100+", "Display": "6.74\" 90Hz Dot Drop", "Camera": "50MP AI Dual", "Battery": "5000mAh 18W", "RAM": "4GB", "Storage": "128GB"}
  },
  {
    "id": 3,
    "name": "Samsung Galaxy M07",
    "tag": "✨ Best UI",
    "category": "Under ₹10K",
    "brand": "Samsung",
    "price": 9499,
    "description": "Chip: Helio G99 | Display: 6.7\" 90Hz PLS LCD | Camera: 50MP Dual | Battery: 6000mAh 25W | RAM: 6GB | Storage: 128GB",
    "image": "/images/phones/samsung-galaxy-m07.png",
    "amazonLink": "https://www.amazon.in/s?k=Samsung+Galaxy+M07&tag=techboy-21",
    "flipkartLink": "https://www.flipkart.com/search?q=Samsung+Galaxy+M07&affid=techboy",
    "rating": 4.3,
    "specs": {"Processor": "MediaTek Helio G99", "Display": "6.7\" 90Hz PLS LCD", "Camera": "50MP + 2MP Depth", "Battery": "6000mAh 25W", "RAM": "6GB", "Storage": "128GB"}
  },
  {
    "id": 4,
    "name": "Realme C75",
    "tag": "⭐ All-round Best",
    "category": "Under ₹10K",
    "brand": "Realme",
    "price": 9999,
    "description": "Chip: Helio G91 | Display: 6.74\" 90Hz IPS | Camera: 50MP | Battery: 6000mAh 45W | RAM: 8GB | Storage: 128GB",
    "image": "/images/phones/realme-c75.png",
    "amazonLink": "https://www.amazon.in/s?k=Realme+C75&tag=techboy-21",
    "flipkartLink": "https://www.flipkart.com/search?q=Realme+C75&affid=techboy",
    "rating": 4.4,
    "specs": {"Processor": "MediaTek Helio G91", "Display": "6.74\" 90Hz IPS", "Camera": "50MP AI Main", "Battery": "6000mAh 45W SUPERVOOC", "RAM": "8GB", "Storage": "128GB"}
  },
  {
    "id": 5,
    "name": "Infinix Hot 50i",
    "tag": "💰 Best Value",
    "category": "Under ₹10K",
    "brand": "Infinix",
    "price": 7499,
    "description": "Chip: Helio G81 | Display: 6.7\" 120Hz IPS | Camera: 48MP Dual | Battery: 5000mAh 18W | RAM: 6GB | Storage: 128GB",
    "image": "/images/phones/infinix-hot-50i.png",
    "amazonLink": "https://www.amazon.in/s?k=Infinix+Hot+50i&tag=techboy-21",
    "flipkartLink": "https://www.flipkart.com/search?q=Infinix+Hot+50i&affid=techboy",
    "rating": 4.2,
    "specs": {"Processor": "MediaTek Helio G81", "Display": "6.7\" 120Hz Punch-Hole", "Camera": "48MP Dual Flash", "Battery": "5000mAh 18W", "RAM": "6GB", "Storage": "128GB"}
  },

  # --- Under ₹20K ---
  {
    "id": 6,
    "name": "iQOO Z9 5G",
    "tag": "🎮 Best Gaming",
    "category": "Under ₹20K",
    "brand": "iQOO",
    "price": 17999,
    "description": "Chip: Dimensity 7200 | Display: 6.67\" 120Hz AMOLED | Camera: 50MP Sony OIS | Battery: 5000mAh 44W | RAM: 8GB | Storage: 128GB",
    "image": "/images/phones/iqoo-z9-5g.png",
    "amazonLink": "https://www.amazon.in/s?k=iQOO+Z9+5G&tag=techboy-21",
    "flipkartLink": "https://www.flipkart.com/search?q=iQOO+Z9+5G&affid=techboy",
    "rating": 4.5,
    "specs": {"Processor": "MediaTek Dimensity 7200", "Display": "6.67\" 120Hz AMOLED 1800nits", "Camera": "50MP Sony IMX882 OIS", "Battery": "5000mAh 44W FlashCharge", "RAM": "8GB", "Storage": "128GB"}
  },
  {
    "id": 7,
    "name": "Redmi Note 14 5G",
    "tag": "📷 Best Camera",
    "category": "Under ₹20K",
    "brand": "Xiaomi",
    "price": 18999,
    "description": "Chip: Dimensity 7025 Ultra | Display: 6.67\" 120Hz AMOLED | Camera: 50MP Sony LYT-600 OIS | Battery: 5110mAh 45W | RAM: 8GB | Storage: 128GB",
    "image": "/images/phones/redmi-note-14-5g.png",
    "amazonLink": "https://www.amazon.in/s?k=Redmi+Note+14+5G&tag=techboy-21",
    "flipkartLink": "https://www.flipkart.com/search?q=Redmi+Note+14+5G&affid=techboy",
    "rating": 4.5,
    "specs": {"Processor": "Dimensity 7025 Ultra 6nm", "Display": "6.67\" 120Hz OLED 2100nits", "Camera": "50MP Sony LYT-600 OIS", "Battery": "5110mAh 45W HyperCharge", "RAM": "8GB", "Storage": "128GB"}
  },
  {
    "id": 8,
    "name": "Samsung Galaxy A26 5G",
    "tag": "✨ Best UI",
    "category": "Under ₹20K",
    "brand": "Samsung",
    "price": 19999,
    "description": "Chip: Exynos 1380 | Display: 6.6\" 120Hz Super AMOLED | Camera: 50MP OIS | Battery: 5000mAh 25W | RAM: 8GB | Storage: 128GB",
    "image": "/images/phones/samsung-galaxy-a26-5g.png",
    "amazonLink": "https://www.amazon.in/s?k=Samsung+Galaxy+A26+5G&tag=techboy-21",
    "flipkartLink": "https://www.flipkart.com/search?q=Samsung+Galaxy+A26+5G&affid=techboy",
    "rating": 4.4,
    "specs": {"Processor": "Samsung Exynos 1380", "Display": "6.6\" 120Hz Super AMOLED", "Camera": "50MP OIS + 8MP Ultra + 2MP Macro", "Battery": "5000mAh 25W", "RAM": "8GB", "Storage": "128GB"}
  },
  {
    "id": 9,
    "name": "Nothing Phone (3a)",
    "tag": "⭐ All-round Best",
    "category": "Under ₹20K",
    "brand": "Nothing",
    "price": 19999,
    "description": "Chip: Dimensity 7200 Pro | Display: 6.7\" 120Hz Flexible AMOLED | Camera: 50MP Dual OIS | Battery: 5000mAh 45W | RAM: 8GB | Storage: 128GB",
    "image": "/images/phones/nothing-phone-3a.png",
    "amazonLink": "https://www.amazon.in/s?k=Nothing+Phone+3a&tag=techboy-21",
    "flipkartLink": "https://www.flipkart.com/search?q=Nothing+Phone+3a&affid=techboy",
    "rating": 4.6,
    "specs": {"Processor": "MediaTek Dimensity 7200 Pro", "Display": "6.7\" 120Hz AMOLED Glyph", "Camera": "50MP Main OIS + 50MP Ultra-wide", "Battery": "5000mAh 45W Fast Charge", "RAM": "8GB", "Storage": "128GB"}
  },
  {
    "id": 10,
    "name": "vivo T5x 5G",
    "tag": "💰 Best Value",
    "category": "Under ₹20K",
    "brand": "Vivo",
    "price": 15999,
    "description": "Chip: Dimensity 6300 | Display: 6.72\" 120Hz FHD+ | Camera: 50MP AI | Battery: 6000mAh 44W | RAM: 8GB | Storage: 128GB",
    "image": "/images/phones/vivo-t5x-5g.png",
    "amazonLink": "https://www.amazon.in/s?k=vivo+T5x+5G&tag=techboy-21",
    "flipkartLink": "https://www.flipkart.com/search?q=vivo+T5x+5G&affid=techboy",
    "rating": 4.4,
    "specs": {"Processor": "MediaTek Dimensity 6300", "Display": "6.72\" 120Hz FHD+", "Camera": "50MP Super Night AI", "Battery": "6000mAh 44W FlashCharge", "RAM": "8GB", "Storage": "128GB"}
  },

  # --- Under ₹30K ---
  {
    "id": 11,
    "name": "iQOO Neo 10R",
    "tag": "🎮 Best Gaming",
    "category": "Under ₹30K",
    "brand": "iQOO",
    "price": 27999,
    "description": "Chip: Snapdragon 8s Gen 3 | Display: 6.78\" 144Hz 1.5K AMOLED | Camera: 50MP Sony OIS | Battery: 5500mAh 120W | RAM: 8GB | Storage: 256GB",
    "image": "/images/phones/iqoo-neo-10r.png",
    "amazonLink": "https://www.amazon.in/s?k=iQOO+Neo+10R&tag=techboy-21",
    "flipkartLink": "https://www.flipkart.com/search?q=iQOO+Neo+10R&affid=techboy",
    "rating": 4.6,
    "specs": {"Processor": "Snapdragon 8s Gen 3 4nm", "Display": "6.78\" 144Hz 1.5K AMOLED", "Camera": "50MP Sony IMX920 OIS", "Battery": "5500mAh 120W FlashCharge", "RAM": "8GB", "Storage": "256GB"}
  },
  {
    "id": 12,
    "name": "Google Pixel 9a",
    "tag": "📷 Best Camera",
    "category": "Under ₹30K",
    "brand": "Google",
    "price": 29999,
    "description": "Chip: Google Tensor G4 | Display: 6.3\" 120Hz Actua OLED | Camera: 48MP Dual Pixel AI | Battery: 4700mAh 27W | RAM: 8GB | Storage: 128GB",
    "image": "/images/phones/google-pixel-9a.png",
    "amazonLink": "https://www.amazon.in/s?k=Google+Pixel+9a&tag=techboy-21",
    "flipkartLink": "https://www.flipkart.com/search?q=Google+Pixel+9a&affid=techboy",
    "rating": 4.6,
    "specs": {"Processor": "Google Tensor G4 AI", "Display": "6.3\" 120Hz Actua OLED", "Camera": "48MP OIS + 13MP Ultra-wide AI", "Battery": "4700mAh 27W Fast Charge", "RAM": "8GB", "Storage": "128GB"}
  },
  {
    "id": 13,
    "name": "Nothing Phone (3a) Pro",
    "tag": "✨ Best UI",
    "category": "Under ₹30K",
    "brand": "Nothing",
    "price": 25999,
    "description": "Chip: Snapdragon 7s Gen 3 | Display: 6.7\" 120Hz Flexible OLED | Camera: 50MP Triple OIS | Battery: 5000mAh 45W | RAM: 12GB | Storage: 256GB",
    "image": "/images/phones/nothing-phone-3a-pro.png",
    "amazonLink": "https://www.amazon.in/s?k=Nothing+Phone+3a+Pro&tag=techboy-21",
    "flipkartLink": "https://www.flipkart.com/search?q=Nothing+Phone+3a+Pro&affid=techboy",
    "rating": 4.5,
    "specs": {"Processor": "Snapdragon 7s Gen 3", "Display": "6.7\" 120Hz Flexible OLED Glyph 2.0", "Camera": "50MP OIS + 50MP Ultra + 50MP Tele", "Battery": "5000mAh 45W", "RAM": "12GB", "Storage": "256GB"}
  },
  {
    "id": 14,
    "name": "Realme GT 7T",
    "tag": "⭐ All-round Best",
    "category": "Under ₹30K",
    "brand": "Realme",
    "price": 26999,
    "description": "Chip: Snapdragon 8s Gen 3 | Display: 6.78\" 144Hz 1.5K 6000nits | Camera: 50MP Sony OIS | Battery: 5500mAh 120W | RAM: 12GB | Storage: 256GB",
    "image": "/images/phones/realme-gt7t.png",
    "amazonLink": "https://www.amazon.in/s?k=Realme+GT+7T&tag=techboy-21",
    "flipkartLink": "https://www.flipkart.com/search?q=Realme+GT+7T&affid=techboy",
    "rating": 4.5,
    "specs": {"Processor": "Snapdragon 8s Gen 3", "Display": "6.78\" 144Hz 1.5K 6000nits", "Camera": "50MP Sony IMX890 OIS", "Battery": "5500mAh 120W SuperVOOC", "RAM": "12GB", "Storage": "256GB"}
  },
  {
    "id": 15,
    "name": "POCO F7 5G",
    "tag": "💰 Best Value",
    "category": "Under ₹30K",
    "brand": "Xiaomi",
    "price": 24999,
    "description": "Chip: Snapdragon 8s Gen 3 | Display: 6.67\" 120Hz CrystalRes AMOLED | Camera: 50MP OIS | Battery: 6000mAh 90W | RAM: 12GB | Storage: 256GB",
    "image": "/images/phones/poco-f7-5g.png",
    "amazonLink": "https://www.amazon.in/s?k=POCO+F7+5G&tag=techboy-21",
    "flipkartLink": "https://www.flipkart.com/search?q=POCO+F7+5G&affid=techboy",
    "rating": 4.5,
    "specs": {"Processor": "Snapdragon 8s Gen 3 4nm", "Display": "6.67\" 120Hz 1.5K Flow AMOLED", "Camera": "50MP Light Hunter 800 OIS", "Battery": "6000mAh 90W Turbo", "RAM": "12GB", "Storage": "256GB"}
  },
  {
    "id": 16,
    "name": "OnePlus Nord CE 5",
    "tag": "🏆 Brand Value",
    "category": "Under ₹30K",
    "brand": "OnePlus",
    "price": 28710,
    "description": "Chip: Snapdragon 7 Gen 3 | Display: 6.7\" 120Hz Fluid AMOLED | Camera: 50MP Sony OIS | Battery: 5500mAh 100W | RAM: 8GB | Storage: 256GB",
    "image": "/images/phones/oneplus-nord-ce5.png",
    "amazonLink": "https://www.amazon.in/s?k=OnePlus+Nord+CE+5&tag=techboy-21",
    "flipkartLink": "https://www.flipkart.com/search?q=OnePlus+Nord+CE+5&affid=techboy",
    "rating": 4.5,
    "specs": {"Processor": "Snapdragon 7 Gen 3", "Display": "6.7\" 120Hz Fluid AMOLED", "Camera": "50MP Sony LYT-600 OIS", "Battery": "5500mAh 100W SuperVOOC", "RAM": "8GB", "Storage": "256GB"}
  },

  # --- Under ₹40K ---
  {
    "id": 17,
    "name": "POCO X8 Pro Max",
    "tag": "🎮 Best Gaming",
    "category": "Under ₹40K",
    "brand": "Xiaomi",
    "price": 39999,
    "description": "Chip: Snapdragon 8 Gen 3 | Display: 6.73\" 144Hz AMOLED | Camera: 50MP Triple OIS | Battery: 5500mAh 120W | RAM: 16GB | Storage: 512GB",
    "image": "/images/phones/poco-x8-pro-max.png",
    "amazonLink": "https://www.amazon.in/s?k=POCO+X8+Pro+Max&tag=techboy-21",
    "flipkartLink": "https://www.flipkart.com/search?q=POCO+X8+Pro+Max&affid=techboy",
    "rating": 4.7,
    "specs": {"Processor": "Snapdragon 8 Gen 3", "Display": "6.73\" 144Hz 2K AMOLED", "Camera": "50MP OIS + 50MP Ultra + 50MP Tele", "Battery": "5500mAh 120W HyperCharge", "RAM": "16GB", "Storage": "512GB"}
  },
  {
    "id": 18,
    "name": "vivo V70 FE",
    "tag": "📷 Best Camera",
    "category": "Under ₹40K",
    "brand": "Vivo",
    "price": 37088,
    "description": "Chip: Dimensity 9200 | Display: 6.73\" 120Hz 1.5K AMOLED | Camera: 50MP ZEISS OIS Studio | Battery: 5000mAh 80W | RAM: 8GB | Storage: 256GB",
    "image": "/images/phones/vivo-v70-fe.png",
    "amazonLink": "https://www.amazon.in/s?k=vivo+V70+FE&tag=techboy-21",
    "flipkartLink": "https://www.flipkart.com/search?q=vivo+V70+FE&affid=techboy",
    "rating": 4.6,
    "specs": {"Processor": "MediaTek Dimensity 9200", "Display": "6.73\" 120Hz 1.5K AMOLED Curved", "Camera": "50MP ZEISS OIS + 50MP Telephoto", "Battery": "5000mAh 80W FlashCharge", "RAM": "8GB", "Storage": "256GB"}
  },
  {
    "id": 19,
    "name": "Samsung Galaxy A37 5G",
    "tag": "✨ Best UI",
    "category": "Under ₹40K",
    "brand": "Samsung",
    "price": 34999,
    "description": "Chip: Exynos 1480 | Display: 6.5\" 120Hz Super AMOLED | Camera: 50MP OIS Triple | Battery: 5000mAh 25W | RAM: 8GB | Storage: 256GB",
    "image": "/images/phones/samsung-galaxy-a37-5g.png",
    "amazonLink": "https://www.amazon.in/s?k=Samsung+Galaxy+A37+5G&tag=techboy-21",
    "flipkartLink": "https://www.flipkart.com/search?q=Samsung+Galaxy+A37+5G&affid=techboy",
    "rating": 4.5,
    "specs": {"Processor": "Samsung Exynos 1480 4nm", "Display": "6.5\" 120Hz Super AMOLED FHD+", "Camera": "50MP OIS + 12MP Ultra-wide", "Battery": "5000mAh 25W Fast Charge", "RAM": "8GB", "Storage": "256GB"}
  },
  {
    "id": 20,
    "name": "OnePlus Nord 6",
    "tag": "⭐ All-round Best",
    "category": "Under ₹40K",
    "brand": "OnePlus",
    "price": 35999,
    "description": "Chip: Snapdragon 8s Gen 3 | Display: 6.77\" 120Hz ProXDR AMOLED | Camera: 50MP Sony LYT-700 OIS | Battery: 5500mAh 100W | RAM: 12GB | Storage: 256GB",
    "image": "/images/phones/oneplus-nord-6.png",
    "amazonLink": "https://www.amazon.in/s?k=OnePlus+Nord+6&tag=techboy-21",
    "flipkartLink": "https://www.flipkart.com/search?q=OnePlus+Nord+6&affid=techboy",
    "rating": 4.6,
    "specs": {"Processor": "Snapdragon 8s Gen 3", "Display": "6.77\" 120Hz ProXDR AMOLED", "Camera": "50MP Sony LYT-700 OIS", "Battery": "5500mAh 100W SuperVOOC", "RAM": "12GB", "Storage": "256GB"}
  },
  {
    "id": 21,
    "name": "Realme GT 7 Pro",
    "tag": "💰 Best Value",
    "category": "Under ₹40K",
    "brand": "Realme",
    "price": 37999,
    "description": "Chip: Snapdragon 8 Elite | Display: 6.78\" 144Hz Eco² Sky OLED | Camera: 50MP Sony IMX906 OIS | Battery: 6500mAh 120W | RAM: 12GB | Storage: 256GB",
    "image": "/images/phones/realme-gt7-pro.png",
    "amazonLink": "https://www.amazon.in/s?k=Realme+GT+7+Pro&tag=techboy-21",
    "flipkartLink": "https://www.flipkart.com/search?q=Realme+GT+7+Pro&affid=techboy",
    "rating": 4.7,
    "specs": {"Processor": "Snapdragon 8 Elite 3nm", "Display": "6.78\" 144Hz Eco² Sky OLED", "Camera": "50MP OIS + 50MP 3x Periscope", "Battery": "6500mAh 120W Ultra Charge", "RAM": "12GB", "Storage": "256GB"}
  },

  # --- Under ₹50K ---
  {
    "id": 22,
    "name": "iQOO 13 5G",
    "tag": "🎮 Best Gaming",
    "category": "Under ₹50K",
    "brand": "iQOO",
    "price": 47999,
    "description": "Chip: Snapdragon 8 Elite | Display: 6.82\" 144Hz 2K LTPO AMOLED | Camera: 50MP Sony OIS Triple | Battery: 6150mAh 120W | RAM: 16GB | Storage: 512GB",
    "image": "/images/phones/iqoo-13-5g.png",
    "amazonLink": "https://www.amazon.in/s?k=iQOO+13+5G&tag=techboy-21",
    "flipkartLink": "https://www.flipkart.com/search?q=iQOO+13+5G&affid=techboy",
    "rating": 4.8,
    "specs": {"Processor": "Snapdragon 8 Elite + Supercomputing Chip Q2", "Display": "6.82\" 2K 144Hz LTPO AMOLED", "Camera": "50MP + 50MP + 50MP Triple OIS", "Battery": "6150mAh 120W FlashCharge", "RAM": "16GB", "Storage": "512GB"}
  },
  {
    "id": 23,
    "name": "vivo V70",
    "tag": "📷 Best Camera",
    "category": "Under ₹50K",
    "brand": "Vivo",
    "price": 45999,
    "description": "Chip: Dimensity 9300+ | Display: 6.78\" 120Hz 1.5K AMOLED | Camera: 50MP ZEISS Triple Telephoto | Battery: 5500mAh 90W | RAM: 12GB | Storage: 256GB",
    "image": "/images/phones/vivo-v70.png",
    "amazonLink": "https://www.amazon.in/s?k=vivo+V70&tag=techboy-21",
    "flipkartLink": "https://www.flipkart.com/search?q=vivo+V70&affid=techboy",
    "rating": 4.7,
    "specs": {"Processor": "MediaTek Dimensity 9300+", "Display": "6.78\" 120Hz 1.5K AMOLED 3000nits", "Camera": "50MP ZEISS OIS + 50MP ZEISS Telephoto", "Battery": "5500mAh 90W FlashCharge", "RAM": "12GB", "Storage": "256GB"}
  },
  {
    "id": 24,
    "name": "Samsung Galaxy A57 5G",
    "tag": "✨ Best UI",
    "category": "Under ₹50K",
    "brand": "Samsung",
    "price": 48999,
    "description": "Chip: Exynos 1580 | Display: 6.6\" 120Hz Dynamic AMOLED 2X | Camera: 108MP OIS Triple | Battery: 5000mAh 45W | RAM: 12GB | Storage: 256GB",
    "image": "/images/phones/samsung-galaxy-a57-5g.png",
    "amazonLink": "https://www.amazon.in/s?k=Samsung+Galaxy+A57+5G&tag=techboy-21",
    "flipkartLink": "https://www.flipkart.com/search?q=Samsung+Galaxy+A57+5G&affid=techboy",
    "rating": 4.6,
    "specs": {"Processor": "Samsung Exynos 1580 4nm", "Display": "6.6\" 120Hz Dynamic AMOLED 2X", "Camera": "108MP OIS + 12MP Ultra-wide", "Battery": "5000mAh 45W Fast Charge", "RAM": "12GB", "Storage": "256GB"}
  },
  {
    "id": 25,
    "name": "OnePlus 13R",
    "tag": "⭐ All-round Best",
    "category": "Under ₹50K",
    "brand": "OnePlus",
    "price": 42999,
    "description": "Chip: Snapdragon 8 Gen 3 | Display: 6.78\" 120Hz 1.5K LTPO4 AMOLED | Camera: 50MP Sony OIS | Battery: 6000mAh 100W | RAM: 16GB | Storage: 256GB",
    "image": "/images/phones/oneplus-13r.png",
    "amazonLink": "https://www.amazon.in/s?k=OnePlus+13R&tag=techboy-21",
    "flipkartLink": "https://www.flipkart.com/search?q=OnePlus+13R&affid=techboy",
    "rating": 4.7,
    "specs": {"Processor": "Snapdragon 8 Gen 3 4nm", "Display": "6.78\" 1.5K 120Hz LTPO4 AMOLED", "Camera": "50MP Sony IMX890 OIS", "Battery": "6000mAh 100W SuperVOOC", "RAM": "16GB", "Storage": "256GB"}
  },

  # --- Under ₹60K ---
  {
    "id": 26,
    "name": "OnePlus 13",
    "tag": "🎮 Best Gaming",
    "category": "Under ₹60K",
    "brand": "OnePlus",
    "price": 58999,
    "description": "Chip: Snapdragon 8 Elite | Display: 6.82\" 2K Oriental AMOLED 120Hz | Camera: 50MP Hasselblad Triple | Battery: 6000mAh 100W | RAM: 16GB | Storage: 512GB",
    "image": "/images/phones/oneplus-13.png",
    "amazonLink": "https://www.amazon.in/s?k=OnePlus+13&tag=techboy-21",
    "flipkartLink": "https://www.flipkart.com/search?q=OnePlus+13&affid=techboy",
    "rating": 4.8,
    "specs": {"Processor": "Snapdragon 8 Elite 3nm", "Display": "6.82\" 2K 120Hz LTPO Oriental", "Camera": "50MP + 50MP + 50MP Hasselblad Triple", "Battery": "6000mAh 100W + 50W Wireless", "RAM": "16GB", "Storage": "512GB"}
  },
  {
    "id": 27,
    "name": "Google Pixel 9 Pro",
    "tag": "📷 Best Camera",
    "category": "Under ₹60K",
    "brand": "Google",
    "price": 59999,
    "description": "Chip: Google Tensor G4 | Display: 6.3\" Super Actua OLED 120Hz | Camera: 50MP Triple 5x Telephoto | Battery: 4700mAh 27W | RAM: 16GB | Storage: 256GB",
    "image": "/images/phones/google-pixel-9-pro.png",
    "amazonLink": "https://www.amazon.in/s?k=Google+Pixel+9+Pro&tag=techboy-21",
    "flipkartLink": "https://www.flipkart.com/search?q=Google+Pixel+9+Pro&affid=techboy",
    "rating": 4.8,
    "specs": {"Processor": "Google Tensor G4 AI", "Display": "6.3\" Super Actua OLED 120Hz 3000nits", "Camera": "50MP OIS + 48MP Ultra + 48MP 5x Telephoto", "Battery": "4700mAh 27W Fast Qi", "RAM": "16GB", "Storage": "256GB"}
  },
  {
    "id": 28,
    "name": "Samsung Galaxy S25",
    "tag": "✨ Best UI",
    "category": "Under ₹60K",
    "brand": "Samsung",
    "price": 59999,
    "description": "Chip: Snapdragon 8 Elite | Display: 6.2\" Dynamic AMOLED 2X 120Hz | Camera: 50MP Triple OIS | Battery: 4000mAh 25W | RAM: 12GB | Storage: 256GB",
    "image": "/images/phones/samsung-galaxy-s25.png",
    "amazonLink": "https://www.amazon.in/s?k=Samsung+Galaxy+S25&tag=techboy-21",
    "flipkartLink": "https://www.flipkart.com/search?q=Samsung+Galaxy+S25&affid=techboy",
    "rating": 4.7,
    "specs": {"Processor": "Snapdragon 8 Elite for Galaxy", "Display": "6.2\" Dynamic AMOLED 2X 120Hz", "Camera": "50MP Dual Pixel OIS + 12MP + 10MP 3x", "Battery": "4000mAh 25W Fast Wireless", "RAM": "12GB", "Storage": "256GB"}
  },
  {
    "id": 29,
    "name": "Apple iPhone 15",
    "tag": "⭐ All-round Best",
    "category": "Under ₹60K",
    "brand": "Apple",
    "price": 58900,
    "description": "Chip: Apple A16 Bionic | Display: 6.1\" Super Retina XDR Dynamic Island | Camera: 48MP Dual Fusion | Battery: 3349mAh 20W | RAM: 6GB | Storage: 128GB",
    "image": "/images/phones/apple-iphone-15.png",
    "amazonLink": "https://www.amazon.in/s?k=Apple+iPhone+15&tag=techboy-21",
    "flipkartLink": "https://www.flipkart.com/search?q=Apple+iPhone+15&affid=techboy",
    "rating": 4.7,
    "specs": {"Processor": "Apple A16 Bionic 4nm", "Display": "6.1\" Super Retina XDR OLED", "Camera": "48MP Dual Fusion 2x Telephoto", "Battery": "3349mAh 20W MagSafe", "RAM": "6GB", "Storage": "128GB"}
  },

  # --- Under ₹1 Lakh ---
  {
    "id": 30,
    "name": "Samsung Galaxy S26+",
    "tag": "🎮 Best Gaming",
    "category": "Under ₹1 Lakh",
    "brand": "Samsung",
    "price": 89999,
    "description": "Chip: Snapdragon 8 Elite | Display: 6.7\" QHD+ Dynamic AMOLED 2X 120Hz | Camera: 50MP Triple OIS | Battery: 4900mAh 45W | RAM: 12GB | Storage: 256GB",
    "image": "/images/phones/samsung-galaxy-s26-plus.png",
    "amazonLink": "https://www.amazon.in/s?k=Samsung+Galaxy+S26%2B&tag=techboy-21",
    "flipkartLink": "https://www.flipkart.com/search?q=Samsung+Galaxy+S26%2B&affid=techboy",
    "rating": 4.8,
    "specs": {"Processor": "Snapdragon 8 Elite Gen 2", "Display": "6.7\" QHD+ Dynamic AMOLED 2X 120Hz", "Camera": "50MP OIS + 12MP Ultra + 10MP 3x", "Battery": "4900mAh 45W Super Fast 2.0", "RAM": "12GB", "Storage": "256GB"}
  },
  {
    "id": 31,
    "name": "Apple iPhone 17",
    "tag": "📷 Best Camera",
    "category": "Under ₹1 Lakh",
    "brand": "Apple",
    "price": 82900,
    "description": "Chip: Apple A19 | Display: 6.3\" 120Hz ProMotion Super Retina XDR | Camera: 48MP Dual Fusion | Battery: 3600mAh 25W | RAM: 8GB | Storage: 128GB",
    "image": "/images/phones/apple-iphone-17.png",
    "amazonLink": "https://www.amazon.in/s?k=Apple+iPhone+17&tag=techboy-21",
    "flipkartLink": "https://www.flipkart.com/search?q=Apple+iPhone+17&affid=techboy",
    "rating": 4.8,
    "specs": {"Processor": "Apple A19 Bionic 3nm", "Display": "6.3\" 120Hz ProMotion Super Retina XDR", "Camera": "48MP Dual Fusion OIS", "Battery": "3600mAh 25W MagSafe", "RAM": "8GB", "Storage": "128GB"}
  },
  {
    "id": 32,
    "name": "Samsung Galaxy S26",
    "tag": "✨ Best UI",
    "category": "Under ₹1 Lakh",
    "brand": "Samsung",
    "price": 74999,
    "description": "Chip: Exynos 2600 / Snapdragon 8 Elite | Display: 6.36\" Dynamic AMOLED 120Hz | Camera: 50MP Triple | Battery: 4300mAh 25W | RAM: 12GB | Storage: 256GB",
    "image": "/images/phones/samsung-galaxy-s26.png",
    "amazonLink": "https://www.amazon.in/s?k=Samsung+Galaxy+S26&tag=techboy-21",
    "flipkartLink": "https://www.flipkart.com/search?q=Samsung+Galaxy+S26&affid=techboy",
    "rating": 4.7,
    "specs": {"Processor": "Exynos 2600 / Snapdragon 8 Elite", "Display": "6.36\" Dynamic AMOLED 2X 120Hz", "Camera": "50MP OIS + 12MP + 10MP 3x", "Battery": "4300mAh 25W Fast Charge", "RAM": "12GB", "Storage": "256GB"}
  },
  {
    "id": 33,
    "name": "Apple iPhone 16",
    "tag": "⭐ All-round Best",
    "category": "Under ₹1 Lakh",
    "brand": "Apple",
    "price": 72900,
    "description": "Chip: Apple A18 | Display: 6.1\" Super Retina XDR OLED | Camera: 48MP Dual Fusion | Battery: 3561mAh 20W | RAM: 8GB | Storage: 128GB",
    "image": "/images/phones/apple-iphone-16.png",
    "amazonLink": "https://www.amazon.in/s?k=Apple+iPhone+16&tag=techboy-21",
    "flipkartLink": "https://www.flipkart.com/search?q=Apple+iPhone+16&affid=techboy",
    "rating": 4.7,
    "specs": {"Processor": "Apple A18 3nm", "Display": "6.1\" Super Retina XDR Ceramic Shield", "Camera": "48MP Dual Fusion + Spatial Photo", "Battery": "3561mAh 20W Fast MagSafe", "RAM": "8GB", "Storage": "128GB"}
  },
  {
    "id": 34,
    "name": "Apple iPhone 15 Pro Max",
    "tag": "💰 Best Value",
    "category": "Under ₹1 Lakh",
    "brand": "Apple",
    "price": 89900,
    "description": "Chip: Apple A17 Pro | Display: 6.7\" 120Hz ProMotion OLED | Camera: 48MP Triple 5x Telephoto | Battery: 4422mAh 27W | RAM: 8GB | Storage: 256GB",
    "image": "/images/phones/apple-iphone-15-pro-max.png",
    "amazonLink": "https://www.amazon.in/s?k=Apple+iPhone+15+Pro+Max&tag=techboy-21",
    "flipkartLink": "https://www.flipkart.com/search?q=Apple+iPhone+15+Pro+Max&affid=techboy",
    "rating": 4.8,
    "specs": {"Processor": "Apple A17 Pro 3nm", "Display": "6.7\" 120Hz Super Retina XDR Titanium", "Camera": "48MP Quad + 12MP 5x Telephoto", "Battery": "4422mAh 27W MagSafe", "RAM": "8GB", "Storage": "256GB"}
  },

  # --- Flagship 1L+ ---
  {
    "id": 35,
    "name": "Samsung Galaxy S26 Ultra",
    "tag": "🔥 Ultimate Android Flagship",
    "category": "Flagship 1L+",
    "brand": "Samsung",
    "price": 119999,
    "description": "Chip: Snapdragon 8 Elite Gen 2 | Display: 6.9\" Dynamic AMOLED 2X 120Hz | Camera: 200MP Quad AI | Battery: 5500mAh 65W | RAM: 16GB | Storage: 512GB",
    "image": "/images/phones/samsung-galaxy-s26-ultra.png",
    "amazonLink": "https://www.amazon.in/s?k=Samsung+Galaxy+S26+Ultra&tag=techboy-21",
    "flipkartLink": "https://www.flipkart.com/search?q=Samsung+Galaxy+S26+Ultra&affid=techboy",
    "rating": 4.9,
    "specs": {"Processor": "Snapdragon 8 Elite Gen 2", "Display": "6.9\" Dynamic AMOLED 2X 120Hz Gorilla Armor", "Camera": "200MP Quad OIS + 50MP 5x Periscope", "Battery": "5500mAh 65W Super Fast 2.0", "RAM": "16GB", "Storage": "512GB"}
  },
  {
    "id": 36,
    "name": "Apple iPhone 17 Pro Max",
    "tag": "⭐ Ultimate iOS Flagship",
    "category": "Flagship 1L+",
    "brand": "Apple",
    "price": 149900,
    "description": "Chip: Apple A19 Pro | Display: 6.9\" 120Hz Super Retina XDR OLED | Camera: 48MP Quad 8x Telephoto | Battery: 4832mAh 35W | RAM: 12GB | Storage: 512GB",
    "image": "/images/phones/apple-iphone-17-pro-max.png",
    "amazonLink": "https://www.amazon.in/s?k=Apple+iPhone+17+Pro+Max&tag=techboy-21",
    "flipkartLink": "https://www.flipkart.com/search?q=Apple+iPhone+17+Pro+Max&affid=techboy",
    "rating": 4.9,
    "specs": {"Processor": "Apple A19 Pro 3nm", "Display": "6.9\" 120Hz Super Retina XDR 3000nits", "Camera": "48MP Quad with 8x Telephoto + 48MP Ultra", "Battery": "4832mAh 35W Fast MagSafe", "RAM": "12GB", "Storage": "512GB"}
  },
  {
    "id": 37,
    "name": "Samsung Galaxy Z Fold 7",
    "tag": "📱 Next-Gen Foldable",
    "category": "Flagship 1L+",
    "brand": "Samsung",
    "price": 154999,
    "description": "Chip: Snapdragon 8 Elite | Display: 8.0\" Foldable Dynamic AMOLED 120Hz | Camera: 108MP Triple | Battery: 4600mAh 45W | RAM: 16GB | Storage: 512GB",
    "image": "/images/phones/samsung-galaxy-z-fold-7.png",
    "amazonLink": "https://www.amazon.in/s?k=Samsung+Galaxy+Z+Fold+7&tag=techboy-21",
    "flipkartLink": "https://www.flipkart.com/search?q=Samsung+Galaxy+Z+Fold+7&affid=techboy",
    "rating": 4.9,
    "specs": {"Processor": "Snapdragon 8 Elite", "Display": "8.0\" Foldable QXGA+ 120Hz + 6.5\" Cover", "Camera": "108MP + 12MP + 10MP 3x Telephoto", "Battery": "4600mAh 45W", "RAM": "16GB", "Storage": "512GB"}
  },
  {
    "id": 38,
    "name": "Samsung Galaxy Z Flip 7",
    "tag": "✨ Icon Clamshell",
    "category": "Flagship 1L+",
    "brand": "Samsung",
    "price": 109999,
    "description": "Chip: Snapdragon 8 Elite | Display: 6.7\" Dynamic AMOLED 120Hz + 4.0\" Flex | Camera: 50MP Dual OIS | Battery: 4300mAh 25W | RAM: 12GB | Storage: 256GB",
    "image": "/images/phones/samsung-galaxy-z-flip-7.png",
    "amazonLink": "https://www.amazon.in/s?k=Samsung+Galaxy+Z+Flip+7&tag=techboy-21",
    "flipkartLink": "https://www.flipkart.com/search?q=Samsung+Galaxy+Z+Flip+7&affid=techboy",
    "rating": 4.8,
    "specs": {"Processor": "Snapdragon 8 Elite", "Display": "6.7\" FHD+ 120Hz + 4.0\" Outer Flex", "Camera": "50MP Dual OIS", "Battery": "4300mAh 25W Fast Wireless", "RAM": "12GB", "Storage": "256GB"}
  },
  {
    "id": 39,
    "name": "Apple iPhone 17 Pro",
    "tag": "🎯 Compact Pro Power",
    "category": "Flagship 1L+",
    "brand": "Apple",
    "price": 118900,
    "description": "Chip: Apple A19 Pro | Display: 6.3\" 120Hz Super Retina XDR OLED | Camera: 48MP Quad 5x Telephoto | Battery: 3800mAh 30W | RAM: 12GB | Storage: 256GB",
    "image": "/images/phones/apple-iphone-17-pro.png",
    "amazonLink": "https://www.amazon.in/s?k=Apple+iPhone+17+Pro&tag=techboy-21",
    "flipkartLink": "https://www.flipkart.com/search?q=Apple+iPhone+17+Pro&affid=techboy",
    "rating": 4.9,
    "specs": {"Processor": "Apple A19 Pro 3nm", "Display": "6.3\" 120Hz Super Retina XDR", "Camera": "48MP Quad 5x Telephoto", "Battery": "3800mAh 30W MagSafe", "RAM": "12GB", "Storage": "256GB"}
  },
  {
    "id": 40,
    "name": "Apple iPhone 16 Pro Max",
    "tag": "🏆 Pro Flagship Deal",
    "category": "Flagship 1L+",
    "brand": "Apple",
    "price": 119900,
    "description": "Chip: Apple A18 Pro | Display: 6.9\" 120Hz Super Retina XDR OLED | Camera: 48MP Triple 5x | Battery: 4685mAh 27W | RAM: 8GB | Storage: 256GB",
    "image": "/images/phones/apple-iphone-16-pro-max.png",
    "amazonLink": "https://www.amazon.in/s?k=Apple+iPhone+16+Pro+Max&tag=techboy-21",
    "flipkartLink": "https://www.flipkart.com/search?q=Apple+iPhone+16+Pro+Max&affid=techboy",
    "rating": 4.9,
    "specs": {"Processor": "Apple A18 Pro 3nm", "Display": "6.9\" 120Hz Super Retina XDR Titanium", "Camera": "48MP + 48MP + 12MP 5x Telephoto", "Battery": "4685mAh 27W Fast Qi", "RAM": "8GB", "Storage": "256GB"}
  }
]

def populate_database_and_json():
    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    json_path = os.path.join(repo_root, 'frontend', 'src', 'data', 'phones.json')
    
    # 1. Update phones.json
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(CURATED_PHONES, f, indent=2, ensure_ascii=False)
    print(f"Successfully saved {len(CURATED_PHONES)} top mobile models to {json_path}")

    # 2. Populate SQLite Product and PriceHistory
    Product.objects.all().delete()
    for item in CURATED_PHONES:
        brand = item.get("brand") or item["name"].split()[0]
        prod = Product.objects.create(
            id=item["id"],
            name=item["name"],
            price=item["price"],
            category=item["category"],
            brand=brand,
            tag=item["tag"],
            description=item["description"],
            image=item["image"],
            amazon_link=item["amazonLink"],
            flipkart_link=item["flipkartLink"],
            rating=item.get("rating", 4.5),
            specs=item.get("specs", {})
        )
        PriceHistory.objects.create(
            product=prod,
            price=item["price"]
        )
    print(f"Successfully loaded {Product.objects.count()} curated products into Django SQLite DB!")

if __name__ == '__main__':
    populate_database_and_json()
