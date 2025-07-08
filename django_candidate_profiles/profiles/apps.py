
from django.apps import AppConfig
import reversion

class ProfilesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'profiles'


        
    '''def ready(self):
        from . import models
        reversion.register(models.CandidateProfile)
        reversion.register(models.ProfileSummary)'''
        # Already defined in admin, causes a conflict. 
        # But this allows us to version outside of admin
        # Need to find a resolution
        
