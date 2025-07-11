from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Employee
from employees.utils.user_utils import create_user_account

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

class EmployeeSerializer(serializers.ModelSerializer):
    user = UserSerializer() 

    class Meta:
        model = Employee
        fields = ['id', 'user', 'employee_id', 'Department']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = create_user_account(user_data)
        employee = Employee.objects.create(user=user, **validated_data)
        return employee
