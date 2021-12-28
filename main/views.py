from django.shortcuts import render
from django.http import JsonResponse

from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import TaskSerializer

from .models import Task


def list(request):
    return render(request, 'main/index.html')


@api_view(['GET'])
def api_overview(request):
    api_urls = {
        'List': '/task-list/',
        'Create': '/task-create/',
        'Delete': '/task-delete/<str:pk>/',
        'Update': 'task_update/<str:pk>/'
    }
    return Response(api_urls)


@api_view(['GET'])
def task_list(request):
    tasks = Task.objects.all()
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def task_create(request):
    serializer = TaskSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)


@api_view(['DELETE'])
def task_delete(request, pk):
    task = Task.objects.get(id=pk)
    task.delete()

    return Response('Item successfully deleted!')


@api_view(['POST'])
def task_update(request, pk):
    task = Task.objects.get(id=pk)
    serializer = TaskSerializer(instance=task, data=request.data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)
