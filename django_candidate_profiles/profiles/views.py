from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status,viewsets
from django.http import FileResponse
from django.shortcuts import get_object_or_404,render
from .models import CandidateProfile, PdfExport,ProfileSummary,Employee
from .serializers import CandidateProfileSerializer,ProfileSummarySerializer,EmployeeSerializer
import os
from django.conf import settings
from django.utils import timezone
import reversion  
from reversion.models import Version
from reportlab.pdfgen import canvas
from io import BytesIO
    
class CandidateProfileView(APIView):

    def get(self, request, pk=None):
        if pk:
            candidate = get_object_or_404(CandidateProfile, pk=pk)
            serializer = CandidateProfileSerializer(candidate)
            return Response(serializer.data)
        else:
            candidates = CandidateProfile.objects.all()
            serializer = CandidateProfileSerializer(candidates, many=True)
            return Response(serializer.data)
def post(self, request):
        serializer = CandidateProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

def delete(self, request, pk):
        candidate = get_object_or_404(CandidateProfile, pk=pk)
        candidate.delete()
        return Response({'message': 'Candidate deleted successfully'}, status=204)

def put(self, request, pk):
        candidate = get_object_or_404(CandidateProfile, pk=pk)
        serializer = CandidateProfileSerializer(candidate, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

class ExportResumeView(APIView):
    def get(self, request, summary_id):
        try:
            candidate = get_object_or_404(CandidateProfile, id=summary_id)
            
            # Create a byte buffer for the PDF
            buffer = BytesIO()

            # Create the PDF object, using the buffer as its "file"
            p = canvas.Canvas(buffer)

            # Write content to the PDF
            p.setFont("Helvetica", 14)
            p.drawString(100, 800, f"Candidate Resume: {candidate.name}")
            p.setFont("Helvetica", 12)
            p.drawString(100, 770, f"Title: {candidate.title}")
            p.drawString(100, 750, f"Location: {candidate.location}")
            p.drawString(100, 730, f"Email: {candidate.email}")
            p.drawString(100, 710, f"Employee ID: {candidate.employee_id or 'N/A'}")

                # Finish up
            p.showPage()
            p.save()

                # Move buffer to the beginning
            buffer.seek(0)

            # Return as a FileResponse
            return FileResponse(buffer, as_attachment=True, filename=f"{candidate.name}_resume.pdf")

        except CandidateProfile.DoesNotExist:
            return Response({"error": "Candidate not found"}, status=status.HTTP_404_NOT_FOUND)
'''
        # Generate dummy PDF path
        pdf_filename = f"resume_{candidate.id}.pdf"
        pdf_path = os.path.join(settings.MEDIA_ROOT, pdf_filename)

        # Create dummy PDF file (replace with real rendering in production)
        with open(pdf_path, 'wb') as f:
            f.write(b'%PDF-1.4\n% Dummy PDF content for candidate')

        # Save export record
        if request.user.is_authenticated and hasattr(request.user, 'employee'):
            PdfExport.objects.create(
                candidate=candidate,
                generated_by=request.user.employee,
                file_path=pdf_path,
                generated_at=timezone.now()
            )

        return FileResponse(open(pdf_path, 'rb'), content_type='application/pdf')
'''    
def get(self, request, summary_id):
        if not request.user.is_staff:
            return Response({"error": "Unauthorized"}, status=403)
        return self.post(request, summary_id)

def display_images(request):
    images = CandidateProfile.objects.get(name = "profile_image")
    return render(request, 'myapp/image_list.html', {'images':images})

class ProfileSummaryViewSet(viewsets.ModelViewSet):
    serializer_class = ProfileSummarySerializer

    def get_queryset(self):
        queryset = ProfileSummary.objects.all()
        candidate_id = self.request.query_params.get('candidate_id')
        if candidate_id:
            queryset = queryset.filter(candidate__id=candidate_id)
        return queryset

    def perform_create(self, serializer):
        with reversion.create_revision():
            instance = serializer.save()
            reversion.set_comment("Created via API")

    def perform_update(self, serializer):
        with reversion.create_revision():
            instance = serializer.save()
            reversion.set_comment("Updated via API")

                     
class ProfileSummaryVersionsView(APIView):
    def get(self,request,pk):
        summary=ProfileSummary.objects.get(pk=pk)
        versions=Version.objects.get_for_object(summary)
        data=[
            {
                "revision":v.revision.id,
                "date_created":v.revision.date_created,
                "summary_text": v.field_dict.get("summary_text"),
            }
            for v in versions
        ]
        return Response(data)
        
class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer        
