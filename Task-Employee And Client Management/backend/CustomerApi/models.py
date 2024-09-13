from django.db import models

# Create your models here.
class Customers(models.Model):
    CustomerName = models.CharField(max_length=100)
    OrganisationName = models.CharField(max_length=100)
    Address = models.CharField(max_length=200)
    MobileNo = models.IntegerField()

    def __str__(self):
        return f"{self.CustomerName} - {self.OrganisationName} ({self.MobileNo})"
