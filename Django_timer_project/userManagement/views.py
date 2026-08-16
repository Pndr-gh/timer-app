#UserManagement app
from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from timer.models import *

from django.contrib.auth import login
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required


navbar = ['Timer', 'Tasks', 'Calender', 'Stats', 'Signup']


def signUp_view(request):

    if request.method == 'GET':
        form = UserCreationForm()
        return render(request, 'register.html', {'form': form, 'navbar': navbar})
    
    elif request.method == 'POST':
        form = UserCreationForm(request.POST)
        if not form.is_valid():
            formErrors = form.errors
            print(formErrors)

            return render(request, 'register.html', {'form': form, 'navbar': navbar, 'erorrs': formErrors})

        else:       

            user = form.save()
            login(request, user)
            return redirect('Timer')
        
def first_page_view(request):
    if not request.user.is_authenticated:
        return redirect("login")
    else:
        return redirect("Timer")

def login_view(request):  

    return render(request, 'login.html', {'navbar': navbar})

@login_required
def profile_view(request):

    sessionObjects = SessionTimer.objects.filter(user = request.user)
    cycle_amount = 0
    all_minute = 0
    all_session = 0
    counter = 0
    for x in list(sessionObjects):

        cycle_amount += sessionObjects[counter].pomodoro_cycles
        all_minute += sessionObjects[counter].minute_amount

        if x.end_time != (None):
            print(x.end_time)
            all_session += 1
        counter += 1
    return render(request, 'profile.html', {'navbar': navbar, 'cycle_amount': cycle_amount, 'all_minute': all_minute, 'all_session': all_session})