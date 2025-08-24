from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
    

# Create your models here.
class Event(models.Model):
    title = models.CharField(max_length=250)
    date = models.DateField()
    description = models.TextField(blank=True)

class Note(models.Model):
    note_title = models.TextField(max_length=100,null=False,blank=False,default="Default note")
    note_description = models.TextField(max_length=100,null=True,blank=True,default="Default note")
    start_date = models.DateTimeField(null=False,blank=False)
    end_date = models.DateTimeField(null=False,blank=False)
    start_time = models.TimeField(null=False,blank=False)
    end_time = models.TimeField(null=False,blank=False)
    # color = models.CharField(max_length=50,default="#3B82F6")

    
    def validate_dates(self):
        current_date = timezone.now().date()
        if self.start_date.date() < current_date:
            raise ValidationError("Start date cannot be in the past.")
        if self.end_date.date() < current_date:
            raise ValidationError("End date cannot be in the past.")

    def validate_time(self):
        current_datetime = timezone.now()
        current_time = current_datetime.time()
        if self.start_date.date() == current_datetime.date() and self.start_time < current_time:
            raise ValidationError('time cannot be in the past')
        if self.start_date.date() == self.end_date.date() and self.end_time < self.start_time:
            raise ValidationError({'end_time':'end_time cannot be less than start_time'})
    def clean(self):
        self.validate_dates()
        self.validate_time()
    
    def save(self, *args, **kwargs):
        self.full_clean()  
        super().save(*args, **kwargs)

    