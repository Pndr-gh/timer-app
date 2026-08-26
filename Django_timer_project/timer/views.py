#timer app
from django.shortcuts import render
from django.http import HttpResponse

from timer.models import *
import json
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.utils import timezone


import matplotlib
import matplotlib.pyplot as plt
import io
import urllib, base64

import datetime




matplotlib.use('Agg')


navbar = ['Timer', 'Stats', 'Signup']


def timer_view(request):
    
    y = ['session', 'pomodoro']

    if request.user.is_authenticated:
        prefs, created = PersonalPrefrences.objects.get_or_create(user=request.user)

        preferred_session_time = prefs.session_timeInSecond
        preferred_cycle_time = prefs.cycle_timeInSecond

    else:

        preferred_session_time = 5100
        preferred_cycle_time = 1500

    return render(request, "timer.html", {'y': y, 'navbar': navbar,
                                           "preferred_sessionTime": preferred_session_time,
                                             "preferred_cycleTime": preferred_cycle_time})

def task_view(request):
    return HttpResponse('task view')

def calender_view(request):
    return HttpResponse('calender view')

def stats_view(request):


    if not request.user.is_authenticated:
        
        return render(request, "stats.html", {'navbar': navbar, 'is_guest': True})



    today = timezone.now().date()
    all_objects = SessionTimer.objects.filter(user=request.user, pomodoro_cycles__isnull=False)
    minute_per_day = {}

    for x in range(6, -1 ,-1):
        target_day = today - datetime.timedelta(days= x)

        target_day_sessions = all_objects.filter(
            start_time__year = target_day.year,
            start_time__month = target_day.month,
            start_time__day = target_day.day
        )
        
        day_name = target_day.strftime("%a")
        minute_per_day[day_name] = 0
        for ses in target_day_sessions:
            minute_per_day[day_name] += ses.minute_amount



    days = list(minute_per_day.keys())
    minutes = list(minute_per_day.values())

    plt.figure(figsize=(5.5, 2.7), facecolor='#27282F')
    ax = plt.gca()
    ax.set_facecolor('#27282F')

    plt.plot(days, minutes, marker='o', color='#FF6B6B', linestyle='-', linewidth=2, markersize=8)
    
    plt.title('Daily Focused Time (Last 7 Days)', fontsize=14, pad=15, color='#F8FAFC')
    plt.ylabel('Minutes', fontsize=12, color='#94A3B8')
    plt.tick_params(colors='#94A3B8')
    plt.grid(True, linestyle='--', alpha=0.15, color='#FFFFFF')
    plt.ylim(bottom=0)

    for spine in ax.spines.values():
        spine.set_visible(False)
    
    buf = io.BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight', facecolor='#27282F')
    buf.seek(0)


    
    string = base64.b64encode(buf.read())
    uri = urllib.parse.quote(string)
    plt.close()



    return render(request, "stats.html", {'navbar': navbar, 'minute_per_day': minute_per_day, 'chart': uri})

    
      




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
            print(minutes)


            parrent_session = SessionTimer.objects.get(id= session_id)
            parrent_session.pomodoro_cycles += 1
            parrent_session.minute_amount += minutes
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
            print(minutes)

            current_session = SessionTimer.objects.get(user= request.user, id= session_id)
            current_session.minute_amount = minutes
            current_session.end_time = timezone.now()
            current_session.save()
            return JsonResponse({'status': 'success', 'message': 'saved session to db'})

        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status= 400)
    else:
        return JsonResponse({'error': 'Invalid request'}, status= 400)
    
@login_required
def save_time_prefrences(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            session_time = data.get('session_time')
            cycle_time = data.get('cycle_time')

            prefrences_model = PersonalPrefrences.objects.get(user= request.user)
            prefrences_model.session_timeInSecond= session_time
            prefrences_model.cycle_timeInSecond= cycle_time
            prefrences_model.save()

            return JsonResponse({'status': 'success', 'message': 'saved time prefrences'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status= 400)
    else:
        return JsonResponse({'error': 'Invalid request'}, status= 400)
    

# @login_required
# def timeline_starter_view(request):
#     if request.method == "POST":
        
    
