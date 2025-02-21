import calendar
from datetime import date
from django.utils import timezone

def cal():
    first_day_of_month,number_of_days = calendar.monthrange(2025,1)
    print(first_day_of_month,number_of_days)

    today = date.today()
    print(today)

cal()

def printCalendar(year,month):
    calen = {"da","mon","isToday"}
    first_day_of_month,number_of_days = calendar.monthrange(year,month)
    today = date.today()
    for i in range(1, number_of_days + 1 ):
        calen = {"da":i,
                    "mon":month,
                    "isToday": i == today.day and month == today.month and year == today.year ,}
        print(calen)
printCalendar(2025,2)
today = timezone.now().date()
print(today)