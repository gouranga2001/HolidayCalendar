import calendar
from datetime import date,timedelta
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Event,Note
from .serializers import EventSerializer,NoteSerializer
import django_filters
from django.utils import timezone
from rest_framework import generics
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend,FilterSet
from rest_framework.generics import ListAPIView


@api_view(['GET'])
def get_events(request, year, month):
    events = Event.objects.filter(date__year=year, date__month=month)
    serializer = EventSerializer(events, many=True)
    return Response(serializer.data)




#api to get the whole calendar for a month and can toggle between before and after months

@api_view(['GET'])
def get_calendar(request, year, month):
    try:
        year, month = int(year), int(month)
        total_days = calendar.monthrange(year, month)[1]
        first_weekday = calendar.monthrange(year, month)[0]  # 0 = Monday

        today = timezone.now().date()
        
        # Get previous month days
        prev_month_days = calendar.monthrange(year, month - 1)[1] if month > 1 else calendar.monthrange(year - 1, 12)[1]
        start_offset = (first_weekday) % 7 

        days = []

        # Fill in previous month's days
        for i in range(start_offset):
            days.append({"day": prev_month_days - start_offset + i + 1, "isCurrentMonth": False})

        # Fill in current month's days
        for i in range(1, total_days + 1):
            days.append({
                "day": i,
                "isCurrentMonth": True,
                "isToday": i == today.day and month == today.month and year == today.year
            })

        # Fill in next month's days
        while len(days) % 7 != 0:
            days.append({"day": len(days) - total_days - start_offset + 1, "isCurrentMonth": False})

        return Response({
            "year": year,
            "month": calendar.month_name[month],
            "days": days
        })
    except ValueError:
        return Response({"error": "Invalid year or month"}, status=400)

#api to get the todays date and can toggle between before and after the dates    
@api_view(['GET'])
def get_date(request,offset=0):
    try:
        offset = int(request.GET.get("offset", offset)) 
        todays_date = date.today() + timedelta(days=offset)
        current_date = todays_date.day 
        return Response({
            current_date
        })
    except Exception as e:
        return Response({
            str(e)
        },status=400)
    
#api to create a note
@api_view(['POST'])
def create_note(request):
    serializer = NoteSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        # This will return the specific validation errors including empty note cases.
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


#api to get a particular notes by its id

@api_view(['GET'])
def get_notes_by_id(request,id):
    try:
        model = Note.objects.get(id=id)
    except Note.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        serializer = NoteSerializer(model)
        return Response(serializer.data)



#api to get all notes notes
@api_view(['GET'])
def get_all_notes(request):
    try:
        model = Note.objects.all()
    except Note.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        serializer = NoteSerializer(model,many=True)
        return Response(serializer.data)


 #api to update notes   
@api_view(['PUT'])
def update_notes(request,id):
    try:
        model = Note.objects.get(id=id)
    except Note.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method == 'PUT':
        serializer = NoteSerializer(model,data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

#api to delete notes
@api_view(['DELETE'])
def delete_notes(request,id):
    try:
        model = Note.objects.get(id=id)
    except Note.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method == 'DELETE':
        model.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

    
# api to search with title(?search=) and search by start date(?=search_date=) or end date (?=end_date=)

class search_filter(django_filters.FilterSet):
    start_date = django_filters.DateFilter(field_name="start_date",lookup_expr = "date")
    end_date = django_filters.DateFilter(field_name="end_date",lookup_expr = "date")
    class Meta:
        model = Note
        fields = ['start_date','end_date']

class search_view(generics.ListCreateAPIView):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    filter_backends = [DjangoFilterBackend,filters.SearchFilter]
    search_fields = ['note_title']
    filterset_class = search_filter

