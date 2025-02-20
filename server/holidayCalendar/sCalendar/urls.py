from django.urls import path
from .views import get_events,get_calendar,get_date,create_note

urlpatterns = [
    path("events/<int:year>/<int:month>/", get_events, name="get_events"),
    path("calendar/<int:year>/<int:month>/", get_calendar, name="get_calendar"),
    path("calendar/day/",get_date,name="get_date"),
    path("calendar/createnote/",create_note,name="create_note")
]

