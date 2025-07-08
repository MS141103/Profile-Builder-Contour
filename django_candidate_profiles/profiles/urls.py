from django.urls import path
from .views import candidate_pdf_view
from rest_framework.routers import DefaultRouter
from .views import CandidateProfileViewSet

router = DefaultRouter()
router.register


urlpatterns = [
    path('candidate/<int:pk>/pdf/', candidate_pdf_view, name='candidate_pdf')

]
