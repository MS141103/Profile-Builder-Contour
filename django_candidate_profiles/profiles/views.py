from django.http import HttpResponse
from django.template.loader import get_template
from xhtml2pdf import pisa #download dependecies
from .models import CandidateProfile
from rest_framework import viewsets
from .models import CandidateProfile
from rest_framework .serializers import CandidateProfileSerializer
from reversion.models import Version

class CandidateProfileViewSet(viewsets.ModelViewSet):
    queryset = CandidateProfile.objects.all()
    serializer_class = CandidateProfileSerializer

def render_to_pdf(template_src, context_dict={}):
    template = get_template(template_src)
    html = template.render(context_dict)
    response = HttpResponse(content_type='application/pdf')
    pisa_status = pisa.CreatePDF(html, dest=response)
    if pisa_status.err:
        return HttpResponse('Error generating PDF', status=500)
    return response

def candidate_pdf_view(request, pk):
    candidate = CandidateProfile.objects.get(pk=pk)
    context = {'candidate': candidate}
    return render_to_pdf('profiles/candidate_pdf_template.html', context)

def export_pdf(request, candidate_id):
    candidate = CandidateProfile.objects.get(id = candidate_id)
    template = get_template("pdf/profile_template.html")
    html = template.render({"candidate": candidate})
    
    response = HttpResponse(content_type="application/pdf")
    pisa_status = pisa.CreatePDF(html, dest = response)
    
    return response