from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.views import APIView

from activities.models import Activity
from .serializers import ActivitySerializer
from rest_framework.response import Response
from datetime import date


# TODO: time zone
class ActivityViewSet(viewsets.ModelViewSet):
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        # Base queryset: all activities by user (or all if staff)
        queryset = (
            Activity.objects.all()
            if user.is_staff
            else Activity.objects.filter(author=user)
        )

        # Optional filter by ?date=YYYY-MM-DD
        date_str = self.request.query_params.get("date")
        if date_str:
            queryset = queryset.filter(start_time__date=date_str)

        return queryset.order_by("start_time")

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
