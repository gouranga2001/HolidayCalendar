from django.db import models
from django.core.exceptions import ValidationError

def validate_nonempty(value):
    if value is None or not value.strip():
        raise ValidationError(
            ("this field cannot be empty" ), params={"value": value},
        )

# Create your models here.
class Event(models.Model):
    title = models.CharField(max_length=250)
    date = models.DateField()
    description = models.TextField(blank=True)

class Note(models.Model):
        note = models.TextField(max_length=300,null=False,blank=False,default="Default note",validators = [validate_nonempty])
