from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from categories.serializers import CategorySerializer
from .models import Category
from django.contrib.auth.models import User
from django.db.models import Q

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        """
        perform_create is called within create after validation.
        Overwrite this function to attach user manually before saving
        """
        # ASSIGN CURRENT USER TO AUTHOR WHEN CREATING
        serializer.save(user=self.request.user, is_default=False)

    def get_queryset(self):
        """
        Include default categories or user created by default
        """
        # GET USER FROM REQUEST
        user = self.request.user

        # Q IS USED FOR COMPLEX QUERIES 
        return Category.objects.filter(Q(user=user) | Q(is_default=True))
