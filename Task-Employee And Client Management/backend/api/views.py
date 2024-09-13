from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import CustomUserModel
from .serializers import EmployeeSerializer, EmpNameSerializer, getEmpNameSerializer
from rest_framework_simplejwt.tokens import RefreshToken

# Views for CRUD Operations
@api_view(['GET'])
def getEmployees(request):
    employees = CustomUserModel.objects.all()
    serializer = EmployeeSerializer(employees, many=True)
    return Response(serializer.data)

# @api_view(['POST'])
# def addEmployee(request):
#     data = request.data
#     serializers = EmployeeSerializer(data=data)
#     if serializers.is_valid():
#         serializers.save()
#         return Response(serializers.data, status=status.HTTP_201_CREATED)
#     return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['PUT', 'DELETE'])
def update_employee(request, pk):
    try:
        employee = CustomUserModel.objects.get(pk=pk)
    except CustomUserModel.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        employee.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    elif request.method == 'PUT':
        current_password = employee.password
        if 'password' not in request.data:
            request.data['password'] = current_password

        serializer = EmployeeSerializer(employee, data=request.data)
        if serializer.is_valid():
            employee = serializer.save()

            token = RefreshToken.for_user(employee)
            data = serializer.data
            data['tokens'] = {
                'refresh': str(token),
                'access': str(token.access_token),
            }
            
            return Response(data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Views for Employee Name
@api_view(['GET'])

def getEmpName(request):
    
    getEmpName = CustomUserModel.objects.all()
    serializedData = EmpNameSerializer(getEmpName, many=True).data
    return Response(serializedData)

@api_view(['GET'])

def getEmp_Name(request):

    getEmp_Name = CustomUserModel.objects.all()
    result=[]
    for ht in getEmp_Name:
        #print(f"res = {getEmpNameSerializer(ht)}")
        data = getEmpNameSerializer(ht)
        result.append(data)

    return Response(result);
