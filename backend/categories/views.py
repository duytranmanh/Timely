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

    # Assign current user to the category if creating new
    def perform_create(self, serializer):
        serializer.save(user=self.request.user, is_default=False)

    def get_queryset(self):
        """
        Only returns categories created by user or defaults
        """
        user = self.request.user
        return Category.objects.filter(Q(user=user) | Q(is_default=True))
