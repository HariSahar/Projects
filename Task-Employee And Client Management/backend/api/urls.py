from django.urls import path
from . import views

urlpatterns = [
    path('employees/', views.getEmployees),
    # path('employees/addemployee/', views.addEmployee),
    path('employees/<int:pk>/', views.update_employee),
    path('employees/EmpName/', views.getEmpName),
    path('employees/Emp_Name/', views.getEmp_Name),
]