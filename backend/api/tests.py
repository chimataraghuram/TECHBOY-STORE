from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Product, PriceHistory, PriceAlert, ClickTrack, CustomUser

class ProductAPITests(APITestCase):
    def setUp(self):
        self.phone1 = Product.objects.create(
            name="Alpha Phone 1",
            price=15000,
            brand="Alpha",
            category="Mid-Range",
            description="Chip: Dimensity 7050 | Camera: 64MP | Battery: 5000mAh",
            specs={"Processor": "Dimensity 7050", "Camera": "64MP", "Battery": "5000mAh"}
        )
        self.phone2 = Product.objects.create(
            name="Beta Flagship X",
            price=45000,
            brand="Beta",
            category="Flagship",
            description="Chip: Snapdragon 8 Gen 3 | Camera: 200MP | Battery: 5400mAh",
            specs={"Processor": "Snapdragon 8 Gen 3", "Camera": "200MP", "Battery": "5400mAh"}
        )

    def test_get_products_list(self):
        """Test fetching product list."""
        url = reverse('product-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should contain at least our 2 test products
        self.assertGreaterEqual(response.data.get('count', len(response.data)), 2)

    def test_search_product_by_name(self):
        """Test searching products by query term."""
        url = f"{reverse('product-list')}?search=Alpha"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get('results', response.data)
        self.assertTrue(any(p['name'] == 'Alpha Phone 1' for p in results))

    def test_sort_products_price_asc(self):
        """Test sorting products by price ascending."""
        url = f"{reverse('product-list')}?sort=price_asc"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get('results', response.data)
        prices = [p['price'] for p in results]
        self.assertEqual(prices, sorted(prices))

    def test_trending_products_endpoint(self):
        """Test trending products action endpoint."""
        url = reverse('product-trending')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)

    def test_deal_of_the_day_endpoint(self):
        """Test deal of the day endpoint returns a valid deal."""
        url = reverse('product-deal-of-the-day')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('name', response.data)
        self.assertIn('price', response.data)

class FeatureAPITests(APITestCase):
    def setUp(self):
        self.phone = Product.objects.create(
            name="Gamma Test Phone",
            price=20000,
            brand="Gamma",
            category="Mid-Range",
            description="Chip: Snapdragon 7s Gen 2 | Battery: 5000mAh"
        )
        self.history = PriceHistory.objects.create(
            product=self.phone,
            price=19000
        )

    def test_price_history_unpaginated(self):
        """Test price history returns unpaginated array for charting."""
        url = f"{reverse('price-history-list')}?product_id={self.phone.id}"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should be a raw list without pagination metadata
        self.assertIsInstance(response.data, list)
        self.assertGreaterEqual(len(response.data), 1)
        prices = [p['price'] for p in response.data]
        self.assertIn(19000, prices)

    def test_price_alert_creation_and_update(self):
        """Test setting price alert and updating existing alert without unique conflict."""
        url = reverse('alerts-list')
        payload = {
            "product": self.phone.id,
            "email": "user@example.com",
            "target_price": 18000,
            "alert_type": "TARGET"
        }
        # First creation
        res1 = self.client.post(url, data=payload, format='json')
        self.assertIn(res1.status_code, [status.HTTP_200_OK, status.HTTP_201_CREATED])
        self.assertTrue(res1.data.get('created'))

        # Second submission with updated target (update_or_create)
        payload["target_price"] = 17500
        res2 = self.client.post(url, data=payload, format='json')
        self.assertEqual(res2.status_code, status.HTTP_200_OK)
        self.assertFalse(res2.data.get('created'))
        self.assertEqual(res2.data.get('target_price'), 17500)

    def test_click_tracking_resilience(self):
        """Test click tracking accepts both product and product_id and normalizes source."""
        url = reverse('track-click')
        
        # Test 1: using product_id
        res1 = self.client.post(url, data={"product_id": self.phone.id, "source": "AMAZON"}, format='json')
        self.assertEqual(res1.status_code, status.HTTP_201_CREATED)

        # Test 2: using product
        res2 = self.client.post(url, data={"product": self.phone.id, "source": "Flipkart"}, format='json')
        self.assertEqual(res2.status_code, status.HTTP_201_CREATED)

        # Verify DB records
        self.assertEqual(ClickTrack.objects.filter(product=self.phone).count(), 2)

    def test_unauthorized_profile_guard(self):
        """Test profile endpoint is strictly protected."""
        url = reverse('profile')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
