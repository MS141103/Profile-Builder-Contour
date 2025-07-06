
import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Profile_builder_DB.settings')

application = get_wsgi_application()
