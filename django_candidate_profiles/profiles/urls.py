from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import CandidateProfileView, ExportResumeView,ProfileSummaryViewSet,ProfileSummaryVersionsView,EmployeeViewSet
from django.conf.urls import include

router = DefaultRouter()
router.register(r'summaries', ProfileSummaryViewSet, basename='summaries')
router.register(r'employees', EmployeeViewSet)
#router.register(r"profiles", CandidateProfileView) #check if still needed


urlpatterns = [
    path('candidates/', CandidateProfileView.as_view()),
    path('candidates/<int:pk>/', CandidateProfileView.as_view()),
    path('candidates/<int:summary_id>/export/', ExportResumeView.as_view()),
    path('export_pdf/<int:summary_id>/', ExportResumeView.as_view(), name='candidate_pdf'),
    path('api/', include(router.urls)), #check if we should remove this or not
    path('', include(router.urls)),
    path('summaries/<int:pk>/versions/', ProfileSummaryVersionsView.as_view(), name='profile-summary-versions'),


]
