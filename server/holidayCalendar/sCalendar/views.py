import calendar
from datetime import date,timedelta
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Event,Note
from .serializers import EventSerializer,NoteSerializer
from django.utils import timezone
from rest_framework import filters
from rest_framework.generics import ListAPIView
import datetime

@api_view(['GET'])
def get_events(request, year, month):
    events = Event.objects.filter(date__year=year, date__month=month)
    serializer = EventSerializer(events, many=True)
    return Response(serializer.data)


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
    
#create a note
@api_view(['POST'])
def create_note(request):
    serializer = NoteSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        # This will return the specific validation errors including empty note cases.
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_notes_by_id(request,id):
    try:
        model = Note.objects.get(id=id)
    except Note.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        serializer = NoteSerializer(model)
        return Response(serializer.data)

@api_view(['GET'])
def get_all_notes(request):
    try:
        model = Note.objects.all()
    except Note.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        serializer = NoteSerializer(model,many=True)
        return Response(serializer.data)
    
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


@api_view(['DELETE'])
def delete_notes(request,id):
    try:
        model = Note.objects.get(id=id)
    except Note.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method == 'DELETE':
        model.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

    
# @api_view(['GET'])
# def search(request):
#     query = request.GET.get('q', None)
#     if query:
#         results = Note.objects.filter(
#             Q(note_title__icontains=query) |
#             Q(start_date__icontains=query) |
#             Q(end_date__icontains=query)
#         )
#     else:
#         results = Note.objects.all()
#     if not results.exists():
#         return Response(status=status.HTTP_204_NO_CONTENT)

#     serializer = NoteSerializer(results, many=True)
#     return Response(serializer.data)

class search_note(ListAPIView):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['note_title', 'start_date','end_date']

    def get_queryset(self):
        queryset = super().get_queryset()
        query = self.request.GET.get('q', None)
        date_query = None

        try:
            date_query = datetime.striptime(query, "%d-%m-%Y").date()
        except (ValueError, TypeError):
            pass  # If it fails, it's not a date, so continue normally

        if query:
            # Smart searching across multiple fields
            queryset = queryset.filter(
                Q(note_title__icontains=query) |
                (Q(start_date__date=date_query) if date_query else Q(start_date__icontains=query)) |
                (Q(end_date__date=date_query) if date_query else Q(end_date__icontains=query))
            )
        
        return queryset