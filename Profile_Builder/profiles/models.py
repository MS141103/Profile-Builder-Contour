from django.db import models

class Candidate(models.Model):
    name = models.CharField(max_length=100)
    title = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    summary = models.TextField()
    created_by = models.CharField(max_length=100)

    def __str__(self):
        return self.name
