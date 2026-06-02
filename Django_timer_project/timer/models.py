from django.db import models
from django.contrib.auth.models import User

class SessionTimer(models.Model):
    user = models.ForeignKey(User, on_delete= models.CASCADE)
    start_time = models.DateTimeField(null= True, auto_now_add= True)
    end_time = models.DateTimeField(null=True, blank=True)
    minute_amount = models.PositiveIntegerField(null= True)
    pomodoro_cycles = models.PositiveIntegerField(null= True, blank= True)


class PomodoroCycle(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    start_time = models.DateTimeField(null= True, auto_now_add= True)
    end_time = models.DateTimeField(null=True, blank=True)
    minute_amount = models.PositiveIntegerField()

