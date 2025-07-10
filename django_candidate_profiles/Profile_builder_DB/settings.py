from pathlib import Path
import corsheaders
import os
import dj_database_url # needed to run Postgres on Railway

# defines BASE_DIR as root of project (Django will know where db.sqlite 3 should be saved)
BASE_DIR = Path(__file__).resolve().parent.parent #needed if you are running SQLLITE3


INSTALLED_APPS = [
    'django_seed',
    'rest_framework',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'reversion',
    'profiles',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'reversion.middleware.RevisionMiddleware',
]
# lets django find it's built in admin templates
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],  # Add custom template folders here if needed
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

ROOT_URLCONF = 'Profile_builder_DB.urls'

DATABASES = {
    #'default': dj_database_url.config(default = os.environ.get("DATABASE_URL"))# default PostgreSQL port
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'candidate_profiles_db',
        'USER': 'postgres',#you will change these for your local host setup
        'PASSWORD': 'Jagdpanther8.8CMKWK',#you will change these for your local host setup
        'HOST': 'localhost',
        'PORT': '5432',  # default PostgreSQL port
    }
    }


SECRET_KEY = 'your-secret-key'
DEBUG = True
ALLOWED_HOSTS = []
# used to serve CSS, for now keep STATIC_URL = '/static/'
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')