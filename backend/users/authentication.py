from rest_framework_simplejwt.authentication import JWTAuthentication
from django.conf import settings

class CookieJWTAuthentication(JWTAuthentication):
    """
    Custom authentication for Http-Only Cookie JWT
    """
    def authenticate(self, request):
        # GET ACCESS TOKEN FROM REQUEST
        raw_token = request.COOKIES.get(settings.SIMPLE_JWT["AUTH_COOKIE"])

        # IF NO TOKEN, NO AUTHENTICATED USER
        if raw_token is None:
            return None

        try:
            # CHECK VALIDATION
            validated_token = self.get_validated_token(raw_token)

            # IF VALID, RETURNS A USER, TOKEN PAIR
            # ELSE RAISE EXCEPTION
            return self.get_user(validated_token), validated_token
        except Exception:
            return None
