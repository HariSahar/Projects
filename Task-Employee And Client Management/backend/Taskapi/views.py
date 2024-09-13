from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Task,Task_Details
from .TaskSerializer import TaskSerializers,TaskDetailsSerializer
import json
from api.models import CustomUserModel
from CustomerApi.models import Customers
from django.http import JsonResponse


@api_view(['GET'])
def get_EmployeeTasks(request, task_id, username_id):
    try:
       
        emp_tasks = Task_Details.objects.filter(task_id=task_id, username_id=username_id)
        
        if emp_tasks.exists():
            serializer = TaskDetailsSerializer(emp_tasks, many=True)
            return Response(serializer.data)
        else:
            return Response({"error": "No tasks found for this user and task combination"}, status=status.HTTP_404_NOT_FOUND)
    
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT', 'DELETE'])
def update_EmployeeTask(request, task_id, username_id):
    try:
        data = json.loads(request.body)

       
        if request.method == 'DELETE':
            try:
              
                task_detail = Task_Details.objects.get(task_id=task_id, username_id=username_id)
                task_detail.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            except Task_Details.DoesNotExist:
                return Response({"error": "Task detail not found"}, status=status.HTTP_404_NOT_FOUND)

       
        elif request.method == 'PUT':
            try:
                print(task_id, username_id);
                task_detail = Task_Details.objects.get(task_id=task_id, username_id=username_id)
              
               
                task_detail.TimeIn = data.get('TimeIn', task_detail.TimeIn)
                task_detail.TimeOut = data.get('TimeOut', task_detail.TimeOut)
                task_detail.FreightCharges = data.get('FreightCharges', task_detail.FreightCharges)
                task_detail.UsedItems = data.get('UsedItems', task_detail.UsedItems)
                task_detail.ReturnedItems = data.get('ReturnedItems', task_detail.ReturnedItems)
                task_detail.NatureOfWork = data.get('NatureOfWork', task_detail.NatureOfWork)
                task_detail.AdditionalTask = data.get('AdditionalTask', task_detail.AdditionalTask)
                task_detail.REMARKS = data.get('REMARKS', task_detail.REMARKS)

               
                task_detail.save()

                serializer = TaskDetailsSerializer(task_detail)
                return Response(serializer.data)
            except Task_Details.DoesNotExist:
                return Response({"error": "Task detail not found"}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    
@api_view(['POST'])
def add_EmployeeTask(request,task_id, username_id):
    if request.method == 'POST':
        try:
            data = request.data
          
            task = Task.objects.get(id=task_id)
            username = CustomUserModel.objects.get(id=username_id)

           
            task_detail = Task_Details.objects.create(
                task=task,
                username=username,
                TimeIn=data.get('TimeIn'),
                FreightCharges=data.get('FreightCharges'),
                TimeOut=data.get('TimeOut'),
                UsedItems=data.get('UsedItems'),
                ReturnedItems=data.get('ReturnedItems'),
                NatureOfWork=data.get('NatureOfWork'),
                AdditionalTask=data.get('AdditionalTask', Task_Details.NO), 
                REMARKS=data.get('REMARKS', Task_Details.PENDING)  
            )

          
            task_detail.save()

           
            serializer = TaskDetailsSerializer(task_detail)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Task.DoesNotExist:
            return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)
        except CustomUserModel.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_tasks(request):
    tasks = Task.objects.all()  
    serializer = TaskSerializers(tasks, many=True)  
    return Response(serializer.data)  



@api_view(['POST'])
def add_tasks(request):
    data = request.data
    print("JSON DATA: ", data)

   
    emp_ids = data.get('user_ids', [])
    org_id = data.get('OrganisationName')
    taskdet = data.get('TaskDetails')
    duedate = data.get('DueDate')
    SetPriority = data.get('SetPriority')

  
    if not emp_ids or org_id is None:
        return Response({"error": "user_ids and OrganisationName are required."}, status=status.HTTP_400_BAD_REQUEST)

   
    try:
        emp_ids = [int(emp_id) for emp_id in emp_ids]
        org_id = int(org_id)
    except ValueError:
        return Response({"error": "Invalid ID format."}, status=status.HTTP_400_BAD_REQUEST)

  
    valid_users = CustomUserModel.objects.filter(id__in=emp_ids)
    if len(valid_users) != len(emp_ids):
        return Response({"error": "Some user IDs are invalid."}, status=status.HTTP_404_NOT_FOUND)

   
    try:
        OrgName = Customers.objects.get(id=org_id)
    except Customers.DoesNotExist:
        return Response({"error": "Organisation not found."}, status=status.HTTP_404_NOT_FOUND)

   
    postTask = Task.objects.create(
        OrganisationName=OrgName,
        TaskDetails=taskdet,
        DueDate=duedate,
        SetPriority=SetPriority

    )
    postTask.username.set(valid_users)
    serializer = TaskSerializers(postTask)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['PUT'])
def update_task(request, pk):
    try:
        task = Task.objects.get(id=pk)
    except Task.DoesNotExist:
        return Response({"error": "Task not found."}, status=status.HTTP_404_NOT_FOUND)

    data = request.data
    serializer = TaskSerializers(task, data=data, partial=True)

    if serializer.is_valid():
        user_ids = data.get('user_ids')
        organisation_id = data.get('OrganisationName')

        # Update organisation if provided
        if organisation_id is not None:
            try:
                organisation = Customers.objects.get(id=organisation_id)
                task.OrganisationName = organisation  # Update the organisation
            except Customers.DoesNotExist:
                return Response({"error": "Organisation not found."}, status=status.HTTP_404_NOT_FOUND)

        # Update user_ids and clear existing usernames
        if user_ids:
            try:
                valid_users = CustomUserModel.objects.filter(id__in=user_ids)
                task.username.clear()  # Clear existing usernames
                for user in valid_users:
                    task.username.add(user)  # Add new users
            except CustomUserModel.DoesNotExist:
                return Response({"error": "Some users not found."}, status=status.HTTP_404_NOT_FOUND)

        # Save updated task instance
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_task(request, pk):
    try:
        task = Task.objects.get(id=pk)  
        task.delete()  
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Task.DoesNotExist:
        return Response({"error": "Task not found."}, status=status.HTTP_404_NOT_FOUND)


