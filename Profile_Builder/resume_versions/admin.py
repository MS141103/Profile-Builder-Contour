from django.contrib import admin
from reversion.admin import VersionAdmin
from .models import ProfileSummary
    
@admin.register(ProfileSummary)
class ProfileSummaryAdmin(VersionAdmin):
    list_display = ['candidate', 'summary_preview']

    def summary_preview(self, obj):
        return obj.summary_text[:50] + '...' if len(obj.summary_text) > 50 else obj.summary_text
    summary_preview.short_description = 'Summary Preview'    