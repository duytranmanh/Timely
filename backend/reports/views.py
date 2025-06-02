from collections import defaultdict
from datetime import timedelta
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from activities.models import Activity


def generate_report(user, start_date, end_date, period_label):
    activities = Activity.objects.filter(
        author=user,
        start_time__date__gte=start_date,
        start_time__date__lte=end_date
    )

    activity_summary = defaultdict(float)
    total_hours = 0.0

    for act in activities:
        duration = (act.end_time - act.start_time).total_seconds() / 3600
        total_hours += duration
        activity_summary[act.category.name] += duration

    activities_list = [
        {
            "name": name,
            "hours": round(hours, 2),
            "percentage": round((hours / total_hours) * 100, 2) if total_hours > 0 else 0
        }
        for name, hours in activity_summary.items()
    ]

    return {
        "period": period_label,
        "total_hours": round(total_hours, 2),
        "activities": activities_list
    }


class DailyReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = timezone.localdate()
        report = generate_report(
            user=request.user,
            start_date=today,
            end_date=today,
            period_label=str(today)
        )
        return Response(report)


class WeeklyReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = timezone.localdate()
        start_of_week = today - timedelta(days=today.weekday())
        end_of_week = start_of_week + timedelta(days=6)
        period_label = f"{start_of_week} to {end_of_week}"

        report = generate_report(
            user=request.user,
            start_date=start_of_week,
            end_date=end_of_week,
            period_label=period_label
        )
        return Response(report)


class MonthlyReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = timezone.localdate()
        first_of_month = today.replace(day=1)
        if today.month == 12:
            next_month = today.replace(year=today.year + 1, month=1, day=1)
        else:
            next_month = today.replace(month=today.month + 1, day=1)
        last_of_month = next_month - timedelta(days=1)
        period_label = f"{first_of_month} to {last_of_month}"

        report = generate_report(
            user=request.user,
            start_date=first_of_month,
            end_date=last_of_month,
            period_label=period_label
        )
        return Response(report)
