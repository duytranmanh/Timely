from django.urls import include, path
from rest_framework.routers import DefaultRouter

from activities.views import ActivityViewSet, MoodChoicesView

router = DefaultRouter()
router.register('', ActivityViewSet, basename='activities')
urlpatterns = [
    path('moods/', MoodChoicesView.as_view(), name='mood-choices'),
    path('', include(router.urls))
]