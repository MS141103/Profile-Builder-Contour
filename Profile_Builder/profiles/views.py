from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Candidate
from .serializers import CandidateSerializer
from django.http import FileResponse
import os

class CandidateView(APIView):
    
    def get(self, request, pk=None):
        if pk:
            try:
                candidate = Candidate.objects.get(pk=pk)
                serializer = CandidateSerializer(candidate)
                return Response(serializer.data)
            except Candidate.DoesNotExist:
                return Response({'error': 'Candidate not found'}, status=404)
        else:
            candidates = Candidate.objects.all()
            serializer = CandidateSerializer(candidates, many=True)
            return Response(serializer.data)

    def post(self, request):
        serializer = CandidateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def put(self, request, pk):
        try:
            candidate = Candidate.objects.get(pk=pk)
        except Candidate.DoesNotExist:
            return Response({'error': 'Candidate not found'}, status=404)

        serializer = CandidateSerializer(candidate, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        try:
            candidate = Candidate.objects.get(pk=pk)
            candidate.delete()
            return Response({'message': 'Candidate deleted successfully'}, status=204)
        except Candidate.DoesNotExist:
            return Response({'error': 'Candidate not found'}, status=404)

class ExportResumeView(APIView):
    def post(self, request, summary_id):
        try:
            candidate = Candidate.objects.get(id=summary_id)
            # Dummy PDF content
            pdf_path = f"/tmp/resume_{candidate.id}.pdf"
            with open(pdf_path, 'wb') as f:
                f.write(b'%PDF-1.4\n% Fake PDF content for candidate')
            return FileResponse(open(pdf_path, 'rb'), content_type='application/pdf')
        except Candidate.DoesNotExist:
            return Response({"error": "Candidate not found"}, status=404)
