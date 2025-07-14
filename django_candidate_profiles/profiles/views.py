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
    def post(self, request, summary_id):
        candidate = get_object_or_404(CandidateProfile, id=summary_id)

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

def display_images(request):
    images = CandidateProfile.objects.get(name = "profile_image")
    return render(request, 'myapp/image_list.html', {'images':images})

class ProfileSummaryViewSet(viewsets.ModelViewSet):
    queryset = ProfileSummary.objects.all()
    serializer_class = ProfileSummarySerializer

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