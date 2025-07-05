
from django.db import models

class CandidateProfile(models.Model):
    name = models.CharField(max_length=100)
    title = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    employee_id = models.CharField(max_length=50, blank=True, null=True)
    email = models.EmailField(unique=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.title}"

class ProfileSummary(models.Model):
    candidate = models.OneToOneField(CandidateProfile, on_delete=models.CASCADE)
    summary_text = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Summary for {self.candidate.name}"
