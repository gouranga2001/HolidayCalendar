from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone


def validate_nonempty(value):
    if value is None or not value.strip():
        raise ValidationError(
            ("this field cannot be empty" ), params={"value": value},
        )
def validate_date(value):
     current_date = timezone.now()
     if value <= current_date:
          raise ValidationError('start date cannot be past date')


def validate_time(value):
     current_time = timezone.now().time()
     if value <= current_time:
          raise ValidationError('end time cannot be in the past')


# Create your models here.
class Event(models.Model):
    title = models.CharField(max_length=250)
    date = models.DateField()
    description = models.TextField(blank=True)

class Note(models.Model):
        note_title = models.TextField(max_length=100,null=False,blank=False,default="Default note",validators = [validate_nonempty])
        note_description = models.TextField(max_length=100,null=False,blank=False,default="Default note",validators = [validate_nonempty])
        start_date = models.DateTimeField(validators=[validate_date])
        end_date = models.DateTimeField(validators=[validate_date])
        start_time = models.TimeField(validators=[validate_time])
        end_time = models.TimeField(validators=[validate_time])

        
