from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import CandidateProfileView, ExportResumeView
from django.conf.urls import include

router = DefaultRouter()
#router.register(r"profiles", CandidateProfileView) #check if still needed


urlpatterns = [
    path('candidates/', CandidateProfileView.as_view()),
    path('candidates/<int:pk>/', CandidateProfileView.as_view()),
    path('candidates/<int:summary_id>/export/', ExportResumeView.as_view()),
    
    path('api/', include(router.urls)) #check if we should remove this or not

]
