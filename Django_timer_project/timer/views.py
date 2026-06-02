#timer app
from django.shortcuts import render
from django.http import HttpResponse

from timer.models import *
import json
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.utils import timezone

def timer_view(request):
    y = ['session', 'pomodoro']
    navbar = ['Timer', 'Tasks', 'Calender', 'Long term goals', 'Signup']
    return render(request, "timer.html", {'y': y, 'navbar': navbar})

def task_view(request):
    return HttpResponse('task view')

def calender_view(request):
    return HttpResponse('calender view')

def goal_view(request):
    return HttpResponse('long-term-goals view')

# fetch functions

@login_required
def start_cycle_view(request):
    if request.method == "POST":
        try:
            new_cycle = PomodoroCycle.objects.create(user = request.user, minute_amount = 0)
            return JsonResponse({
               'cycle_id' : new_cycle.id
            })
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status= 400)
    else:
        return JsonResponse({'error': 'Invalid request'}, status= 400)
            


@login_required
def save_cycles_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            minutes = data.get('minute_amount')
            session_id = data.get('session_id')
            cycle_id = data.get('cycle_id')
            

            current_cycle = PomodoroCycle.objects.get(user= request.user, id= cycle_id)
            current_cycle.minute_amount = minutes
            current_cycle.end_time = timezone.now()
            current_cycle.save()


            parrent_session = SessionTimer.objects.get(id= session_id)
            parrent_session.pomodoro_cycles += 1
            parrent_session.save()

            return JsonResponse({
                'status': 'success',
                'message': 'Cycle saved successfully!'
            })
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status= 400)
    
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status= 405)

@login_required
def start_session_view(request):
    if request.method == "POST":
        try:
            new_session = SessionTimer.objects.create(user = request.user, minute_amount = 0, pomodoro_cycles = 0)
            return JsonResponse({
               'session_id' : new_session.id
            })
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status= 400)
    else:
        return JsonResponse({'error': 'Invalid request'}, status= 400)

@login_required
def save_session_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            session_id = data.get('session_id')
            minutes = data.get('minute_amount')

            current_session = SessionTimer.objects.get(user= request.user, id= session_id)
            current_session.minute_amount = minutes
            current_session.end_time = timezone.now()
            current_session.save()
            return JsonResponse({'status': 'success', 'message': 'saved session to db'})

        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status= 400)
    else:
        return JsonResponse({'error': 'Invalid request'}, status= 400)
