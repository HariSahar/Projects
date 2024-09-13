from django.urls import path
from .views import getCustomers,addCustomer,updatecustomer, getOrganisationName

urlpatterns = [
    path('customer/',getCustomers,name="customer"),
    path('customer/addcustomer/',addCustomer,name="addcustomer"),
    path('customer/<int:pk>/',updatecustomer,name="updatecustomer"),
    path('customerlist/', getOrganisationName,name="customerlist"),
]