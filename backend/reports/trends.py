from collections import defaultdict
from datetime import date, timedelta
from calendar import monthrange

from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from activities.models import Activity
from categories.models import Category

class CategoryTrendView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Parse query parameters
        trend_type = request.query_params.get("type", "daily")  # default to 'daily'
        date_str = request.query_params.get("date")
        category_ids_str = request.query_params.get("categories")  # e.g., "1,2,3"
        

        # Default to today if no date provided
        if date_str:
            try:
                end_date = date.fromisoformat(date_str)
            except ValueError:
                return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=400)
        else:
            end_date = timezone.localdate()

        # Determine start date and grouping logic based on trend type
        if trend_type == "weekly":
            # Get start date from end date
            start_date = end_date - timedelta(weeks=8)
            
            # Function that takes an end date and create a label of type
            group_func = lambda d: f"{d.isocalendar().year}-W{d.isocalendar().week}"
            
            # Create pairs of year and week
            date_labels = [(end_date - timedelta(weeks=i)).isocalendar() for i in reversed(range(8))]
            
            # From each pair of year and week, create a label
            x_axis = [f"{y}-W{w}" for (y, w, _) in date_labels]
        elif trend_type == "monthly":
            start_date = (end_date.replace(day=1) - timedelta(days=365))
            group_func = lambda d: d.strftime("%Y-%m")
            x_axis = [(end_date.replace(day=1) - timedelta(days=30 * i)).strftime("%Y-%m") for i in reversed(range(12))]
        else:  # default to daily
            start_date = end_date - timedelta(days=6)
            group_func = lambda d: d.strftime("%Y-%m-%d")
            x_axis = [(end_date - timedelta(days=i)).strftime("%Y-%m-%d") for i in reversed(range(7))]

        if category_ids_str:
            try:
                category_ids = [int(cid) for cid in category_ids_str.split(",")]
            except ValueError:
                return Response({"error": "Invalid category ID list."}, status=400)
        else:
            category_ids = []

        # Load categories to preserve even empty ones
        categories = Category.objects.filter(user=user)
        if category_ids:
            categories = categories.filter(id__in=category_ids)

        category_map = {cat.id: cat for cat in categories}

        # Filter activities with the correct user, within start and end date
        activities = Activity.objects.filter(
            author=user,
            start_time__date__gte=start_date,
            start_time__date__lte=end_date
        )
        
        # Filter all activities with the selected category id
        if category_ids:
            activities = activities.filter(category_id__in=category_ids)

        # Get all info of all related category (optimization)
        activities = activities.select_related("category")

        # Group by bucket (date/week/month)
        trend_data = defaultdict(lambda: defaultdict(float))  # {category_id: {bucket: hours}}

        for act in activities:
            # Bucket is decided by activity's start date
            bucket = group_func(act.start_time.date())
            hours = (act.end_time - act.start_time).total_seconds() / 3600
            trend_data[act.category_id][bucket] += hours

        # Format response
        response_data = []

        for category_id, category in category_map.items():
            bucket_data = trend_data.get(category_id, {})
            trend = [
                {"label": label, "hours": round(bucket_data.get(label, 0.0), 2)}
                for label in x_axis
            ]
            response_data.append({
                "category_id": category.id,
                "category_name": category.name,
                "trend": trend
            })

        return Response({
            "type": trend_type,
            "start": str(start_date),
            "end": str(end_date),
            "data": response_data
        })
