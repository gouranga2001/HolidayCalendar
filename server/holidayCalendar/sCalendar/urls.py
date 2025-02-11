from django.urls import path
from .views import get_events,get_calendar

urlpatterns = [
    path("events/<int:year>/<int:month>/", get_events, name="get_events"),
    path("calendar/<int:year>/<int:month>/", get_calendar, name="get_calendar"),
]
