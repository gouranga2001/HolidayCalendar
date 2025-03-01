from django.urls import path
from .views import get_events,get_calendar,get_date,create_note,get_notes_by_id,update_notes,delete_notes,get_all_notes,search_view

urlpatterns = [
    path("events/<int:year>/<int:month>/", get_events, name="get_events"),
    path("calendar/<int:year>/<int:month>/", get_calendar, name="get_calendar"),
    path("calendar/day/",get_date,name="get_date"),
    path("calendar/createnote/",create_note,name="create_note"),
    path("calendar/<int:id>/getnote/",get_notes_by_id,name = "get_note"),
    path("calendar/getnotes/",get_all_notes,name = "get_all_notes"),
    path("calendar/<int:id>/updatenotes/",update_notes,name="update_notes"),
    path("calendar/<int:id>/deletenotes/",delete_notes,name="delete_notes"),
    path('calendar/search/', search_view.as_view(), name='search-notes'), #/calendar/search/?search=my_note_title or /?start_date = or /?end_date = 
]

