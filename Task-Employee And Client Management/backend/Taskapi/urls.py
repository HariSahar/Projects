from django.urls import path
from .views import get_EmployeeTasks,update_EmployeeTask,add_EmployeeTask
from .views import get_tasks,add_tasks,update_task

urlpatterns = [

    path('emptasks/<int:task_id>/<int:username_id>/', get_EmployeeTasks),
    path('emptask/<int:task_id>/<int:username_id>/',update_EmployeeTask),
    path('emptasks/addemptask/<int:task_id>/<int:username_id>/', add_EmployeeTask),
    path('tasks/', get_tasks),
    path('tasks/addtask/', add_tasks),
    path('tasks/updatetask/<int:pk>/', update_task)
]
