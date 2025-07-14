# resume_versions/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProfileSummaryViewSet, ProfileSummaryVersionsView

router = DefaultRouter()
router.register(r'summaries', ProfileSummaryViewSet, basename='summaries')

urlpatterns = [
    path('', include(router.urls)), 
   path('summaries/<int:pk>/versions/', ProfileSummaryVersionsView.as_view(), name='profile-summary-versions'),
]
