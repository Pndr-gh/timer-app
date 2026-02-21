from django.shortcuts import render
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

from django.http import HttpResponse

def signUp_view(request):
    y = range(4)
    navbar = ['Timer', 'Tasks', 'Calender', 'Long term goals', 'Account']
    if request.method == 'GET':
        form = UserCreationForm()
        return render(request, 'register.html', {'form': form, 'y': y, 'navbar': navbar})
    
    elif request.method == 'POST':
        form = UserCreationForm(request.POST)
        if not form.is_valid():
            return render(request, 'register.html', {'form': form.errors})

        else:
            form.save()
            return HttpResponse(f"user {form.cleaned_data['username']} created")