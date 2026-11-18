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

    def test_product_categories_distinct(self):
        """Test categories action returns distinct list of categories."""
        url = reverse('product-categories')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)
        self.assertIn("Mid-Range", response.data)
        self.assertIn("Flagship", response.data)

    def test_product_brands_distinct(self):
        """Test brands action returns distinct list of brands."""
        url = reverse('product-brands')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)
        self.assertIn("Alpha", response.data)
        self.assertIn("Beta", response.data)

    def test_product_filter_by_brand_and_price(self):
        """Test filtering products by brand and min/max price."""
        url = f"{reverse('product-list')}?brand=Alpha&min_price=10000&max_price=20000"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get('results', response.data)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['brand'], 'Alpha')

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

    def test_compare_api_flexible_payload(self):
        """Test compare endpoint handles both 'products' and 'product_ids' lists."""
        url = reverse('compare')
        phone2 = Product.objects.create(
            name="Delta Comparison Phone",
            price=25000,
            brand="Delta",
            category="Upper Mid-Range",
            description="Chip: Dimensity 8200"
        )
        
        # Test using 'products'
        res1 = self.client.post(url, data={"products": [self.phone.id, phone2.id]}, format='json')
        self.assertEqual(res1.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res1.data.get('products', [])), 2)

        # Test using 'product_ids'
        res2 = self.client.post(url, data={"product_ids": [self.phone.id, phone2.id]}, format='json')
        self.assertEqual(res2.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res2.data.get('products', [])), 2)

    def test_analytics_default_overview(self):
        """Test analytics endpoint without action parameter returns full overview."""
        url = reverse('analytics')
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('top_products', res.data)
        self.assertIn('sources', res.data)

class ChatbotAPITests(APITestCase):
    def setUp(self):
        self.phone1 = Product.objects.create(
            name="Alpha Speed 5G",
            price=18999,
            brand="Alpha",
            category="Mid-Range",
            tag="Gaming Champion",
            description="Chip: Dimensity 7200 Ultra | Display: 120Hz AMOLED | Battery: 5000mAh 67W",
            specs={"Processor": "Dimensity 7200 Ultra", "Display": "120Hz AMOLED", "Camera": "64MP OIS", "Battery": "5000mAh"}
        )
        self.phone2 = Product.objects.create(
            name="Beta Pro Flagship",
            price=49999,
            brand="Beta",
            category="Flagship",
            tag="Pro Camera",
            description="Chip: Snapdragon 8 Gen 3 | Camera: 50MP Sony LYT-900 | Battery: 5400mAh",
            specs={"Processor": "Snapdragon 8 Gen 3", "Display": "2K LTPO 120Hz", "Camera": "50MP OIS LYTIA", "Battery": "5400mAh"}
        )

    def test_empty_query_personalized_greeting(self):
        """Test empty query responds with friendly greeting personalized by user name."""
        url = reverse('chat')
        res = self.client.post(url, data={"user_name": "Raghuram"}, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("Raghuram", res.data.get('response', ''))

    def test_gaming_budget_scenario_query(self):
        """Test gaming scenario under 20k retrieves budget-compliant gaming phone."""
        url = reverse('chat')
        res = self.client.post(url, data={"query": "Best BGMI gaming phone under 20k"}, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('response', res.data)
        products = res.data.get('products', [])
        self.assertTrue(any("Alpha Speed 5G" in p['name'] for p in products))

    def test_head_to_head_comparison_scenario(self):
        """Test 'Alpha vs Beta' triggers intelligent comparison showdown."""
        url = reverse('chat')
        res = self.client.post(url, data={"query": "Alpha Speed 5G vs Beta Pro Flagship"}, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        response_text = res.data.get('response', '')
        self.assertTrue("Alpha" in response_text and "Beta" in response_text)

    def test_multi_turn_history_acceptance(self):
        """Test API accepts multi-turn conversational history and user_name seamlessly."""
        url = reverse('chat')
        payload = {
            "query": "How is the battery backup?",
            "user_name": "Chima",
            "history": [
                {"role": "user", "text": "Show me Alpha Speed 5G"},
                {"role": "model", "text": "Alpha Speed 5G has Dimensity 7200 Ultra."}
            ]
        }
        res = self.client.post(url, data=payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('response', res.data)

