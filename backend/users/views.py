from django.shortcuts import render
from rest_framework.generics import CreateAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.http import JsonResponse

from .serializers import RegisterSerializer, UserSerializer
from django.contrib.auth.models import User

# Create your views here.
class RegisterView(CreateAPIView):
    """
    Register a new user
    """
    serializer_class = RegisterSerializer
    queryset = User.objects.all()

class MeView(RetrieveAPIView):
    """
    Return current user's details'
    """
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

class CookieTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            access = response.data['access']
            refresh = response.data['refresh']

            response.set_cookie(
                key=settings.SIMPLE_JWT["AUTH_COOKIE"],
                value=access,
                httponly=True,
                samesite=settings.SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],
                secure=settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"],
                path=settings.SIMPLE_JWT["AUTH_COOKIE_PATH"],
            )
            response.set_cookie(
                key=settings.SIMPLE_JWT["AUTH_COOKIE_REFRESH"],
                value=refresh,
                httponly=True,
                samesite=settings.SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],
                secure=settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"],
                path=settings.SIMPLE_JWT["AUTH_COOKIE_PATH"],
            )

            # Optional: remove tokens from response body
            del response.data["access"]
            del response.data["refresh"]

        return response


class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        # Read refresh token from cookie
        request.data["refresh"] = request.COOKIES.get(
            settings.SIMPLE_JWT["AUTH_COOKIE_REFRESH"]
        )

        # Call the base class to get the new tokens
        response = super().post(request, *args, **kwargs)

        # If the refresh was successful, set the new access token cookie
        if response.status_code == 200:
            access = response.data.get("access")

            res = JsonResponse({}, status=200)
            res.set_cookie(
                key=settings.SIMPLE_JWT["AUTH_COOKIE"],
                value=access,
                expires=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"],
                httponly=True,
                secure=settings.SIMPLE_JWT.get("AUTH_COOKIE_SECURE", False),
                samesite=settings.SIMPLE_JWT.get("AUTH_COOKIE_SAMESITE", "Lax"),
                path="/",
            )

            return res

        return response