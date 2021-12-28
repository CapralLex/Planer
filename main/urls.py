from django.urls import path

from . import views
from .views import *

urlpatterns = [
    path('', views.list, name="list"),
    path('api/', views.api_overview, name="api-overview"),
    path('task-list/', views.task_list, name="task-list"),
    path('task-create/', views.task_create, name="task-create"),
    path('task-delete/<str:pk>/', views.task_delete, name="task-delete"),
    path('task-update/<str:pk>/', views.task_update, name="task_update")
]
