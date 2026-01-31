from django.shortcuts import render
from django.http import HttpResponse

def timer_view(request):
    y = range(4)
    navbar = ['Timer', 'Tasks', 'Calender', 'Long term goals', 'Account']
    return render(request, "timer.html", {'y': y, 'navbar': navbar})

