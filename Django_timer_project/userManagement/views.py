#UserManagementApp
from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

from django.contrib.auth import login
from django.http import HttpResponse

def signUp_view(request):
    y = range(4)
    navbar = ['Timer', 'Tasks', 'Calender', 'Long term goals', 'Signup']
    if request.method == 'GET':
        form = UserCreationForm()
        return render(request, 'register.html', {'form': form, 'y': y, 'navbar': navbar})
    
    elif request.method == 'POST':
        form = UserCreationForm(request.POST)
        if not form.is_valid():
            formErrors = form.errors
            print(formErrors)

            return render(request, 'register.html', {'form': form, 'y': y, 'navbar': navbar, 'erorrs': formErrors})

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
    y = range(4)
    navbar = ['Timer', 'Tasks', 'Calender', 'Long term goals', 'Account']
    return render(request, 'login.html', {'y': y, 'navbar': navbar})
