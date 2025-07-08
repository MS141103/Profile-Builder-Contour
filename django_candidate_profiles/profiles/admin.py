
from django.contrib import admin
import reversion
from .models import CandidateProfile, ProfileSummary, Employee, PdfExport
from django.utils.html import format_html
from django.urls import reverse

@admin.register(CandidateProfile)
class CandidateProfileAdmin(reversion.admin.VersionAdmin):
    list_display = ['name', 'title', 'email', 'location', 'employee_id', 'pdf_link']
    search_fields = ['name', 'email', 'title']
    
    def pdf_link(self, obj):
        url = reverse('candidate_pdf', args=[obj.pk])
        return format_html('<a class="button" href="{}" target="_blank">Export PDF</a>', url)
    pdf_link.short_description = 'PDF Export'
    

@admin.register(ProfileSummary)
class ProfileSummaryAdmin(reversion.admin.VersionAdmin):
    list_display = ['candidate', 'updated_at']
    search_fields = ['candidate__name']

class CandidateProfileAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'pdf_link']
    
#admin.site.register(CandidateProfile, CandidateProfileAdmin)    
admin.site.register(Employee)
admin.site.register(PdfExport)
