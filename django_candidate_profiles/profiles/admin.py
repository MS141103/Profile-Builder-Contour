
from django.contrib import admin
import reversion
from .models import CandidateProfile, ProfileSummary

@admin.register(CandidateProfile)
class CandidateProfileAdmin(reversion.admin.VersionAdmin):
    list_display = ['name', 'title', 'email', 'location', 'employee_id']
    search_fields = ['name', 'email', 'title']

@admin.register(ProfileSummary)
class ProfileSummaryAdmin(reversion.admin.VersionAdmin):
    list_display = ['candidate', 'updated_at']
    search_fields = ['candidate__name']
