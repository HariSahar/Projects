from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
# class Employees(models.Model):
#     Name = models.CharField(max_length=100) 
#     Designation	= models.CharField(max_length=100)
#     Mobile_No = models.IntegerField()

#     def __str__(self):
#         return f"{self.Name} - {self.Designation} ({self.Mobile_No})"

class CustomUserModel(AbstractUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    Mobile_No = models.IntegerField()
    

    ADMIN = 'Admin'
    MANAGER = 'Manager'
    CAMERA_TECHNICIAN = 'Camera Technician'
    COMPUTER_TECHNICIAN = 'Computer Technician'
    FRONT_DESK_REPRESENTATIVE = 'Front Desk Representative'

    ROLE_CHOICES = [
        (ADMIN, 'Admin'),
        (MANAGER, 'Manager'),
        (CAMERA_TECHNICIAN, 'Camera Technician'),
        (COMPUTER_TECHNICIAN, 'Computer Technician'),
        (FRONT_DESK_REPRESENTATIVE, 'Front Desk Representative'),
    ]

    ROLES = models.CharField(
        max_length=50,
        choices=ROLE_CHOICES,
        default=COMPUTER_TECHNICIAN,
        null=False
    )

    USERNAME_FIELD = 'username'  
    REQUIRED_FIELDS = ['email','ROLES','Mobile_No']  
