from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken

class UserAPITestCase(APITestCase):
    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123"
        )
        self.register_url = reverse("register")
        self.token_url = reverse("token_obtain_pair")
        self.me_url = reverse("me")
        self.refresh_url = reverse("token_refresh")

    def test_register_user(self):
        data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "newpass123"
        }
        response = self.client.post(self.register_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("username", response.data)
        self.assertEqual(response.data["username"], "newuser")

    def test_token_login(self):
        data = {
            "username": "testuser",
            "password": "testpass123"
        }
        response = self.client.post(self.token_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_me_endpoint_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "testuser")

    def test_me_endpoint_unauthenticated(self):
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_refresh_token(self):
        # Get refresh token first
        refresh = RefreshToken.for_user(self.user)
        data = {
            "refresh": str(refresh)
        }
        response = self.client.post(self.refresh_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)

