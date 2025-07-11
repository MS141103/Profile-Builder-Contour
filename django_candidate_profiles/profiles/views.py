from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import FileResponse
from django.shortcuts import get_object_or_404
from .models import CandidateProfile, PdfExport
from .serializers import CandidateProfileSerializer
import os
from django.conf import settings
from django.utils import timezone
from django.shortcuts import render
    
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
