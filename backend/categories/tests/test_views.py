# This test checks the actual API endpoints for Category.
# It ensures that authenticated users can create and list categories correctly.

from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from categories.models import Category

class CategoryAPITest(APITestCase):

    def setUp(self):
        # Create a test user and log them in
        self.user = User.objects.create_user(username="testuser", password="testpass")
        # self.client.login(username="testuser", password="testpass")

    def test_create_category(self):
        # Test case: POST /api/categories/ creates a new category
        response = self.client.post("/api/categories/", {
            "name": "Work",
            "color": "#123456",
            "is_default": False
        })

        self.assertEqual(response.status_code, 201)  # Created
        self.assertEqual(response.data["name"], "Work")
        self.assertEqual(response.data["color"], "#123456")

    def test_list_categories(self):
        # Test case: GET /api/categories/ returns only the user's categories
        Category.objects.create(name="Sleep", color="#000000", is_default=False, user=self.user)

        response = self.client.get("/api/categories/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "Sleep")
