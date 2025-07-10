
from django.db import models
from django.contrib.auth.models import User
# ignore this, will remove and add a department attribute in CandidateProfiles
class Department(models.Model):
    name = models.CharField(max_length=20)
    team = models.CharField(max_length=30)
    manager = models.CharField(max_length=20)
    tenure = models.PositiveIntegerField(help_text="Tenure in months")

    def __str__(self):
        return f"{self.name} - {self.team}"

class CandidateProfile(models.Model):
    name = models.CharField(max_length=20)
    title = models.CharField(max_length=20)
    location = models.CharField(max_length=6)
    employee_id = models.CharField(max_length=10, blank=True, null=True)
    email = models.EmailField(unique=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

     # Optional ForeignKey to Department
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)

    # Flag for use
    is_active = models.BooleanField(default=True, help_text="Should this profile be considered for suggestions?")

    def __str__(self):
        return f"{self.name} - {self.title}"

class ProfileSummary(models.Model):
    candidate = models.OneToOneField(CandidateProfile, on_delete=models.CASCADE)
    summary_text = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Summary for {self.candidate.name}"
    

    
class Employee(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    employee_id  = models.CharField(max_length = 10)
    Department = models.CharField(max_length = 5)
    
    def __str__(self):
        return f"{self.user.username}({self.employee_id})"
    
class PdfExport(models.Model):
    candidate = models.ForeignKey(CandidateProfile, on_delete=models.CASCADE)
    generated_by = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, blank=True)
    file_path = models.CharField(max_length=255)
    generated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"PDF Export for {self.candidate.name} by {self.generated_by}"
