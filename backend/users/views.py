from django.shortcuts import render
from rest_framework.generics import CreateAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated

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