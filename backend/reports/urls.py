from django.urls import path

from reports.views import DailyReportView, WeeklyReportView, MonthlyReportView

urlpatterns = [
    path('daily/', DailyReportView.as_view(), name='daily-report'),
    path('weekly/', WeeklyReportView.as_view(), name='weekly-report'),
    path('monthly/', MonthlyReportView.as_view(), name='monthly-report'),
]