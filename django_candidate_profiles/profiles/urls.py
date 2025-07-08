from django.urls import path
from .views import candidate_pdf_view
from rest_framework.routers import DefaultRouter
from .views import CandidateProfileViewSet
from django.conf.urls import include

router = DefaultRouter()
router.register(r"profiles", CandidateProfileViewSet)


urlpatterns = [
    path('candidate/<int:pk>/pdf/', candidate_pdf_view, name='candidate_pdf'),
    
     path('api/', include(router.urls))

]
