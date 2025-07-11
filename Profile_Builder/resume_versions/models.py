from django.db import models
from profiles.models import CandidateProfile  #Importing related model from profiles app

class ProfileSummary(models.Model):
    candidate = models.ForeignKey(CandidateProfile, on_delete=models.CASCADE, related_name="summaries")
    summary_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Summary for {self.candidate.name}"
