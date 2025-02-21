import calendar
from datetime import date,timedelta
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Event,Note
from .serializers import EventSerializer,NoteSerializer
from django.utils import timezone

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


