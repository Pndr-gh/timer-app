from django.db import models
from django.contrib.auth.models import User

class SessionTimer(models.Model):
    user = models.ForeignKey(User, on_delete= models.CASCADE)
    end_time = models.DateTimeField(null=True, blank=True)
