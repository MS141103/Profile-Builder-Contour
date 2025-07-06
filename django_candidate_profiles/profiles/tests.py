from django.test import TestCase
from django.contrib.auth.models import User
from .models import Employee, CandidateProfile

class EmployeeModelTest(TestCase):
    def test_create_employee(self):
        user = User.objects.create_user(username='john', password='pass123')
        employee = Employee.objects.create(user=user, employee_id='E001', department='HR')
        self.assertEqual(employee.user.username, 'john')

class CandidateProfileTest(TestCase):
    def test_candidate_email_unique(self):
        CandidateProfile.objects.create(name='Ali', email='ali@test.com', phone='+923001234567')
        with self.assertRaises(Exception):
            CandidateProfile.objects.create(name='Zain', email='ali@test.com', phone='+923004567890')
