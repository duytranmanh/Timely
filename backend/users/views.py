from django.conf import settings
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView, RetrieveAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.permissions import AllowAny

from .serializers import RegisterSerializer, UserSerializer


class RegisterView(CreateAPIView):
    """
    Register a new user.
    """
    serializer_class = RegisterSerializer
    queryset = User.objects.all()
    permission_classes = [AllowAny]


class MeView(RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        """
        Return current logged-in user info.
        """
        return self.request.user


class CookieTokenObtainPairView(TokenObtainPairView):
    """
    Obtain JWT tokens and set them as HttpOnly cookies.
    """
    def post(self, request, *args, **kwargs):
        # CALL PARENT POST REQUEST
        response = super().post(request, *args, **kwargs)

        # IF REQUEST IS SUCCESSFUL
        if response.status_code == 200:
            # GET ACCESS AND REFRESH TOKEN FROM BODY OF RESPONSE
            access = response.data["access"]
            refresh = response.data["refresh"]

            # SET ACCESS COOKIES
            response.set_cookie(
                key=settings.SIMPLE_JWT["AUTH_COOKIE"],
                value=access,
                httponly=True,
                samesite=settings.SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],
                secure=settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"],
                path=settings.SIMPLE_JWT["AUTH_COOKIE_PATH"],
            )

            # SET REFRESH COOKIES
            response.set_cookie(
                key=settings.SIMPLE_JWT["AUTH_COOKIE_REFRESH"],
                value=refresh,
                httponly=True,
                samesite=settings.SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],
                secure=settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"],
                path=settings.SIMPLE_JWT["AUTH_COOKIE_PATH"],
            )

            # REMOVE TOKENS FROM RESPONSE BODY
            response.data.pop("access", None)
            response.data.pop("refresh", None)

        return response


class CookieTokenRefreshView(TokenRefreshView):
    """
    Refresh access token from HttpOnly refresh cookie.
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        # ATTACH REFRESH COOKIE FROM REQUEST TO ITS BODY 
        request.data["refresh"] = request.COOKIES.get(
            settings.SIMPLE_JWT["AUTH_COOKIE_REFRESH"]
        )

        # SEND REQUEST WITH REFRESH ATTACHED TO BODY TO PARENTS
        original_response = super().post(request, *args, **kwargs)

        # IF REQUEST IS SUCCESSFUL
        if original_response.status_code == 200:
            access = original_response.data.get("access")

            response = Response({"detail": "Token refreshed"}, status=200)

            # SET NEW ACCESS TOKEN TO RESPONSE
            response.set_cookie(
                key=settings.SIMPLE_JWT["AUTH_COOKIE"],
                value=access,
                httponly=True,
                secure=settings.SIMPLE_JWT.get("AUTH_COOKIE_SECURE", False),
                samesite=settings.SIMPLE_JWT.get("AUTH_COOKIE_SAMESITE", "Lax"),
                path="/",
            )
            return response

        return original_response


class LogoutView(APIView):
    """
    Log out by clearing HttpOnly JWT cookies.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        response = Response({"message": "Logged out successfully"}, status=200)

        # EXPIRE ACCESS COOKIE
        response.set_cookie(
            key=settings.SIMPLE_JWT["AUTH_COOKIE"],
            value="",
            expires=0,
            path="/",
            httponly=True,
            secure=settings.SIMPLE_JWT.get("AUTH_COOKIE_SECURE", False),
            samesite=settings.SIMPLE_JWT.get("AUTH_COOKIE_SAMESITE", "Lax"),
        )

        # EXPIRE REFRESH COOKIE
        response.set_cookie(
            key=settings.SIMPLE_JWT["AUTH_COOKIE_REFRESH"],
            value="",
            expires=0,
            path="/",
            httponly=True,
            secure=settings.SIMPLE_JWT.get("AUTH_COOKIE_SECURE", False),
            samesite=settings.SIMPLE_JWT.get("AUTH_COOKIE_SAMESITE", "Lax"),
        )

        return response
