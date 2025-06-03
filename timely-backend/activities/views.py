from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from activities.models import Activity
from .serializers import ActivitySerializer


# Create your views here.
class ActivityViewSet(viewsets.ModelViewSet):
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Activity.objects.all()
        return Activity.objects.filter(author=user)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)