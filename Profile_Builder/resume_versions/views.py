from django.shortcuts import render
from rest_framework import viewsets
import reversion  
from .models import ProfileSummary
from .serializers import ProfileSummarySerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from reversion.models import Version

# Create your views here.
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
        