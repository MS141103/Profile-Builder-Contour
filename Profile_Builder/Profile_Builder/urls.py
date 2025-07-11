from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # all your app’s APIs live under /api/
    path('', include('profiles.urls')),
]
