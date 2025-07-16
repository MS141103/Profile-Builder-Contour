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

            # Try to get profile summary
            try:
                summary = candidate.profilesummary.summary_text
            except ProfileSummary.DoesNotExist:
                summary = "No profile summary available."

            buffer = BytesIO()
            p = canvas.Canvas(buffer)

            # ==== Draw Profile Image ====
            if candidate.profile_image:
                try:
                    img_path = candidate.profile_image.path
                    p.drawImage(ImageReader(img_path), 100, 720, width=80, height=80)  # adjust position and size
                except Exception as e:
                    print("Image not loaded:", e)

            # ==== Write Candidate Info ====
            p.setFont("Helvetica-Bold", 14)
            p.drawString(200, 780, f"Candidate Resume: {candidate.name}")  # shifted right for image

            p.setFont("Helvetica", 12)
            p.drawString(200, 750, f"Title: {candidate.title}")
            p.drawString(200, 730, f"Location: {candidate.location}")
            p.drawString(200, 710, f"Email: {candidate.email}")
            p.drawString(200, 690, f"Employee ID: {candidate.employee_id or 'N/A'}")

            # ==== Profile Summary ====
            p.setFont("Helvetica-Bold", 12)
            p.drawString(100, 660, "Profile Summary:")

            p.setFont("Helvetica", 11)
            text = p.beginText(100, 640)
            for line in self.wrap_text(summary, 85):
                text.textLine(line)
            p.drawText(text)

            p.showPage()
            p.save()
            buffer.seek(0)

            return FileResponse(buffer, as_attachment=True, filename=f"{candidate.name}_resume.pdf")

        except CandidateProfile.DoesNotExist:
            return Response({"error": "Candidate not found"}, status=status.HTTP_404_NOT_FOUND)

    def wrap_text(self, text, max_width):
        import textwrap
        return textwrap.wrap(text, width=max_width)
        
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
