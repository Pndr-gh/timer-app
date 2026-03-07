from django.shortcuts import render
from django.http import HttpResponse

def timer_view(request):
    y = range(4)
    navbar = ['Timer', 'Tasks', 'Calender', 'Long term goals', 'Account']
    return render(request, "timer.html", {'y': y, 'navbar': navbar})

def task_view(request):
    return HttpResponse('task view')

def calender_view(request):
    return HttpResponse('calender view')

def goal_view(request):
    return HttpResponse('long-term-goals view')