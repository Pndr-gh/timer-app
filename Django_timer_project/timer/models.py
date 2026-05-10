from django.db import models
from django.contrib.auth.models import User

class SessionTimer(models.Model):
    user = models.ForeignKey(User, on_delete= models.CASCADE)
    end_time = models.DateTimeField(null=True, blank=True, auto_now_add=True)
    minute_amount = models.PositiveIntegerField()
    pomodoro_cycles = models.PositiveIntegerField()


class PomodoroCycle(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    end_time = models.DateTimeField(null=True, blank=True)
    minute_amount = models.PositiveIntegerField()
    session = models.ForeignKey(SessionTimer, on_delete= models.CASCADE)

