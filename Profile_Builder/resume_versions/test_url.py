import os
import django
from django.urls import get_resolver

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Profile_Builder.settings')
django.setup()

# Print registered URLs
resolver = get_resolver()

print("Registered URLs:")
for k in resolver.reverse_dict.keys():
    print(k)
