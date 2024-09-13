from django.db import models
from CustomerApi.models import Customers
# from api.models import Employees
# Create your models here.
from api.models import CustomUserModel

class Task(models.Model):
    username = models.ManyToManyField(CustomUserModel,related_name='tasks')
    OrganisationName = models.ForeignKey(Customers, on_delete=models.CASCADE, related_name='tasks',null=True)
    TaskDetails = models.CharField(max_length=200,null=True)
    DueDate = models.DateField(null=True)
    HIGH = 'High'
    LOW = 'Low'
    MEDIUM = 'Medium'
    SetPriority_CHOICES = [(HIGH, 'High'), (LOW, 'Low'), (MEDIUM, 'Medium')]
    SetPriority = models.CharField(
        max_length=10,
        choices=SetPriority_CHOICES,
        default=MEDIUM,
    )

class Task_Details(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='task_details', null=True)
    username = models.ForeignKey(CustomUserModel, on_delete=models.CASCADE, related_name='task_details', null=True)
    TimeIn = models.TimeField(null=True)
    FreightCharges = models.IntegerField(null=True)
    TimeOut = models.TimeField(null=True)
    UsedItems = models.CharField(max_length=200, null=True)
    ReturnedItems = models.CharField(max_length=200, null=True)
    NatureOfWork = models.CharField(max_length=200, null=True)
    YES = 'Yes'
    NO = 'No'
    AdditionalTask_CHOICES = [(YES, 'Yes'), (NO, 'No')]
    AdditionalTask = models.CharField(
        max_length=5,
        choices=AdditionalTask_CHOICES,
        default=NO,
    )
    PENDING = 'Pending'
    ONPROGRESS = 'On-Progress'
    PARTIALLY_COMPLETED = 'Partially Completed'
    COMPLETED = 'Completed'
    CANCELLED = 'Cancelled'
    ON_HOLD = 'On Hold'
    CLOSED = 'Closed'
    REOPENED = 'ReOpened'

    REMARKS_CHOICES = [
        (PENDING, 'Pending'),
        (ONPROGRESS, 'On-Progress'),
        (PARTIALLY_COMPLETED, 'Partially Completed'),
        (COMPLETED, 'Completed'),
        (CANCELLED, 'Cancelled'),
        (ON_HOLD, 'On Hold'),
        (CLOSED, 'Closed'),
        (REOPENED, 'ReOpened'),
    ]

    REMARKS = models.CharField(
        max_length=20,
        choices=REMARKS_CHOICES,
        default=PENDING,
        null=True
    )
