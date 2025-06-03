# This test checks the CategorySerializer logic directly.
# It ensures that validation for correct and incorrect inputs works as expected.

from rest_framework.test import APITestCase
from categories.serializers import CategorySerializer
from django.contrib.auth.models import User

class CategorySerializerTest(APITestCase):
    def setUp(self):
        # Create a test user and log them in
        self.user = User.objects.create_user(username="testuser", password="testpass")

    def test_valid_data(self):
        # Test case: a valid category should pass validation
        data = {
            "name": "Focus",
            "color": "#112233",
            "is_default": False,
            "user": self.user.id
        }
        serializer = CategorySerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_invalid_color(self):
        # Test case: an invalid color (not a valid hex) should fail validation
        data = {
            "name": "Focus",
            "color": "blue",  # Not a valid hex code
            "is_default": False
        }
        serializer = CategorySerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("color", serializer.errors)
