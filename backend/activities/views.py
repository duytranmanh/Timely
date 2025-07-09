from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.views import APIView

from activities.models import Activity
from .serializers import ActivitySerializer
from rest_framework.response import Response
from datetime import date
from utils.time import get_utc_range_for_local_range

class ActivityViewSet(viewsets.ModelViewSet):
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Return activities for the current user, optionally filtered by a given date and timezone.

        - If the user is staff, all activities are returned.
        - If 'date' and 'tz' are provided in query params, filters activities that occur within
        the full local day converted to UTC.
        - If only 'date' is provided, all activities within given in UTC will be returned
        """

        user = self.request.user

        # BASE QUERYSET: ALL ACTIVITIES BY USER BY DEFAULT
        queryset = (
            Activity.objects.all()
            # RETURN ALL ACTIVITIES IN DB IS USER IS STAFF
            if user.is_staff
            else Activity.objects.filter(author=user)
        )

        # OPTIONAL FILTER BY DATE (YYYY-mm-dd)
        date_str = self.request.query_params.get("date")

        # GET TIMEZONE FOR ACCURATE
        tz = self.request.query_params.get("tz")

        if date_str:
            if tz:
                start,end = get_utc_range_for_local_range(start_str=date_str,end_str=None,timezone_str=tz)
                queryset = queryset.filter(start_time__gte=start, end_time__lte=end)
            else:
                queryset = queryset.filter(start_time__date= date_str)

        # SORT BY START TIME
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
