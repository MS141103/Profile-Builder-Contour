from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Employee(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    employee_id  = models.CharField(max_length = 10)
    Department = models.CharField(max_length = 5)
    
    def __str__(self):
        return f"{self.user.username}({self.employee_id})"