from django.urls import path

from reports.views import DailyReportView, WeeklyReportView, MonthlyReportView
from reports.trends import CategoryTrendView

urlpatterns = [
    path('daily/', DailyReportView.as_view(), name='daily-report'),
    path('weekly/', WeeklyReportView.as_view(), name='weekly-report'),
    path('monthly/', MonthlyReportView.as_view(), name='monthly-report'),
    path('trends/category/', CategoryTrendView.as_view(), name="category-trend")
]