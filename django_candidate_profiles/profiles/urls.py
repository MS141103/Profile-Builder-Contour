from django.urls import path
from .views import candidate_pdf_view

urlpatterns = [
    path('candidate/<int:pk>/pdf/', candidate_pdf_view, name='candidate_pdf'),
]
