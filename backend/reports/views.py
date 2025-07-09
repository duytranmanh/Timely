from collections import defaultdict
from datetime import timedelta, date, datetime, timezone

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from activities.models import Activity
from utils.time import get_utc_range_for_local_range, get_date_from_date_string


def generate_report(user, start_date, end_date, period_label):
    """
    Generate usage report based for user from start_date to end_date
    """
    # TRAVERSE ALL ACTIVITIES WITHIN THE GIVEN TIME FRAME
    # ACCUMULATE ALL ACTIVITIES DURATION
    # UNDEFINED TIME WILL BE DIFFERENCE BETWEEN TOTAL TIME FRAME AND TOTAL RECORDED ACTIVITIES DURATION

    # FILTER ALL ACTIVITY FROM GIVEN USER WITHIN GIVEN TIME FRAME
    activities = Activity.objects.filter(
        author=user,
        start_time__gte=start_date,
        end_time__lte=end_date
    )

    # Activity buckets for total hours
    activity_summary = defaultdict(float)
    # Total length of recorded activities
    total_hours = 0.0

    # TRAVERSE ACTIVITIES
    for act in activities:
        duration = (act.end_time - act.start_time).total_seconds() / 3600   # GET DURATION FOR EACH ACTIVITY
        total_hours += duration                                             # ADD DURATION TO TOTAL HOURS RECORDED
        activity_summary[act.category.name] += duration                     # ADD DURATION TO ACCORDING BUCKET

    # GET TOTAL HOURS FOR THE WHOLE TIME FRAME
    total_period_hours = (end_date - start_date).total_seconds() / 3600

    # GET UNDEFINED DURATION
    undefined_hours = total_period_hours - total_hours
    if undefined_hours > 0:
        activity_summary["undefined"] = undefined_hours

    # FORMAT
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
    """
    Get the selected end date in UTC from user's request
    """
    # GET DATE FROM QUERY PARAMS, IF NOT AVAILABLE, GET CURRENT UTC TIME 
    date_str = request.query_params.get("date", datetime.now(timezone.utc).date().isoformat())

    # GET TIMEZONE FROM QUERY PARAM, UTC OTHERWISE
    tz = request.query_params.get("tz", "UTC")

    # GET ACCORDING UTC TIME FROM USER'S LOCAL TIMEZONE
    [date_str,_] = get_utc_range_for_local_range(date_str, None, tz)

    return date_str


class DailyReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Returns daily time usage reports
        """
        # GET SELECTED DATE FROM USER'S REQUEST, CURRENT UTC DAY BY DEFAULT
        selected_date = request.query_params.get("date", datetime.now(timezone.utc).date().isoformat())

        # GET TIMEZONE FROM USER'S REQUEST, UTC BY DEFAULT
        tz = request.query_params.get("tz", "UTC")

        # GET EQUIVALENT UTC DATE FROM USER'S (TYPICALLY LOCAL DATE)
        start, end = get_utc_range_for_local_range(selected_date, None, tz)

        # GENERATE REPORT
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
        end_of_week = start_of_week + timedelta(days=7)
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
