"""
URL configuration for Django_timer_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from timer.views import *
from userManagement.views import *
from django.http import HttpResponse
from django.contrib.auth import views as auth_views

y = range(4)
navbar = ['Timer', 'Tasks', 'Calender', 'Long term goals', 'Signup']

urlpatterns = [
    path('admin/', admin.site.urls),
    path('timer/', timer_view, name='Timer'),
    path('signup/', signUp_view, name='Signup'),
    path('task/', task_view, name="Tasks"),
    path('calender/', calender_view, name="Calender"),
    path('long-term-goals/', goal_view, name="Long term goals"),
    path('login/', auth_views.LoginView.as_view(template_name = "login.html", extra_context = {'y': y, 'navbar': navbar}), name = 'login'),
    path('logout/', auth_views.LogoutView.as_view(next_page = 'Timer' ), name= "logout"),
    path('', first_page_view, name='First page'),

    path('start-cycle/', start_cycle_view, name= 'start_cycle'),
    path('save-cycle/', save_cycles_view, name= 'save_cycle'),
    path('start-session/', start_session_view, name='start_session'),
    path('end-session/', save_session_view, name='save_session'),
    path('save-time-prefrences/', save_time_prefrences, name='save_time_prefrences'),

]
