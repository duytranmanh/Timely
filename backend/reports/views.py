from collections import defaultdict
from datetime import timedelta, date, datetime, timezone

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from activities.models import Activity
from utils.time import get_utc_range_for_local_range, get_date_from_date_string


def generate_report(user, start_date, end_date, period_label):
    activities = Activity.objects.filter(
        author=user,
        start_time__gte=start_date,
        end_time__lte=end_date
    )

    activity_summary = defaultdict(float)
    total_hours = 0.0

    for act in activities:
        duration = (act.end_time - act.start_time).total_seconds() / 3600
        total_hours += duration
        activity_summary[act.category.name] += duration

    total_period_hours = (end_date - start_date).total_seconds() / 3600

    undefined_hours = total_period_hours - total_hours
    if undefined_hours > 0:
        activity_summary["undefined"] = undefined_hours

    activities_list = [
        {
            "name": name,
            "hours": round(hours, 2),
            "percentage": round((hours / total_period_hours) * 100, 2)
        }
        for name, hours in activity_summary.items()
    ]

    return {
        "period": period_label,
        "activities": activities_list
    }


def get_selected_date(request):
    date_str = request.query_params.get("date", datetime.now(timezone.utc).date().isoformat())
    tz = request.query_params.get("tz", "UTC")

    [date_str,_] = get_utc_range_for_local_range(date_str, None, tz)

    return date_str


class DailyReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        selected_date = request.query_params.get("date", datetime.now(timezone.utc).date().isoformat())
        tz = request.query_params.get("tz", "UTC")
        start, end = get_utc_range_for_local_range(selected_date, None, tz)

        report = generate_report(
            user=request.user,
            start_date=start,
            end_date=end,
            period_label=get_date_from_date_string(selected_date),
        )
        return Response(report)


class WeeklyReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        selected_date = get_selected_date(request)
        if not selected_date:
            return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=400)

        start_of_week = selected_date - timedelta(days=selected_date.weekday())
        end_of_week = start_of_week + timedelta(days=6)
        period_label = f"{get_date_from_date_string(start_of_week)} to {get_date_from_date_string(end_of_week)}"

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
        selected_date = get_selected_date(request)
        if not selected_date:
            return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=400)

        first_of_month = selected_date.replace(day=1)
        if selected_date.month == 12:
            next_month = selected_date.replace(year=selected_date.year + 1, month=1, day=1)
        else:
            next_month = selected_date.replace(month=selected_date.month + 1, day=1)
        last_of_month = next_month - timedelta(days=1)

        period_label = f"{get_date_from_date_string(first_of_month)} to {get_date_from_date_string(last_of_month)}"

        report = generate_report(
            user=request.user,
            start_date=first_of_month,
            end_date=last_of_month,
            period_label=period_label
        )
        return Response(report)
