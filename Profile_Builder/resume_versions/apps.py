from django.apps import AppConfig
import reversion

class ResumeVersionsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'resume_versions'

    def ready(self):
        from django.apps import apps
        try:
            ProfileSummary = apps.get_model('resume_versions', 'ProfileSummary')
            reversion.register(ProfileSummary)
        except LookupError:
            pass
