from rest_framework import serializers
from .models import ProfileSummary
from profiles.serializers import CandidateSerializer
from profiles.models import CandidateProfile

class ProfileSummarySerializer(serializers.ModelSerializer):
    candidate=CandidateSerializer()
    class Meta:
        model=ProfileSummary
        fields=['id','candidate','summary_text','created_at','updated_at']
        
    def create(self, validated_data):
        candidate_data = validated_data.pop('candidate')
        email = candidate_data.get('email')

        try:
            candidate = CandidateProfile.objects.get(email=email)
            changed = False
            for attr, value in candidate_data.items():
                if getattr(candidate, attr) != value:
                    setattr(candidate, attr, value)
                    changed = True
            if changed:
                candidate.save()
        except CandidateProfile.DoesNotExist:
            candidate = CandidateProfile.objects.create(**candidate_data)

        return ProfileSummary.objects.create(candidate=candidate, **validated_data)
        
    def update(self, instance, validated_data):
         candidate_data = validated_data.pop('candidate', None)

         if candidate_data:
            for attr, value in candidate_data.items():
                setattr(instance.candidate, attr, value)
            instance.candidate.save()

         instance.summary_text = validated_data.get('summary_text', instance.summary_text)
         instance.save()
         return instance