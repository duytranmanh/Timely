from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from categories.serializers import CategorySerializer
from .models import Category


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    # Assign current user to the category if creating new
    # TODO: remove this for full functionality
    # def perform_create(self, serializer):
    #
    #     serializer.save(user=self.request.user)

