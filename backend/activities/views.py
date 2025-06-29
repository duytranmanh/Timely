from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.views import APIView

from activities.models import Activity
from .serializers import ActivitySerializer
from rest_framework.response import Response


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


class MoodChoicesView(APIView):
    """
    Returns available moods in activities for selection
    """
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        mood_choices = [{"value": c[0], "label": c[1]} for c in Activity.MOOD_CHOICES]
        return Response(mood_choices)