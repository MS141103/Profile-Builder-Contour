from django.urls import path
from .views import CandidateView, ExportResumeView

urlpatterns = [
    path('api/candidates/', CandidateView.as_view()),                # List or Create
    path('api/candidates/<int:pk>/', CandidateView.as_view()),       # Retrieve, Update, Delete
    path('api/summary/<int:summary_id>/export/', ExportResumeView.as_view()),  # Export PDF
]
