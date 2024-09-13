from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Customers
from .customerserializers import CustomerSerializer, OrganizationSerializer
from rest_framework import generics

# Create your views here.

@api_view(['GET'])

def getCustomers(request):
    customer = Customers.objects.all()
    serializedData = CustomerSerializer(customer, many=True).data
    return Response(serializedData)

@api_view(['POST'])

def addCustomer(request):
    data = request.data
    serializers = CustomerSerializer(data=data)
    if serializers.is_valid():
        serializers.save()
        return Response(serializers.data, status=status.HTTP_201_CREATED)
    return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'DELETE'])
def updatecustomer(request, pk):
    try:
        customer = Customers.objects.get(pk=pk)
    except Customers.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        customer.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    elif request.method == 'PUT':
        serializer = CustomerSerializer(customer, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])

def getOrganisationName(request):
    getOrganisationName = Customers.objects.all()
    serializedData = OrganizationSerializer(getOrganisationName, many=True).data
    return Response(serializedData)