
from django.contrib import admin
from django.urls import path
from django.conf.urls import include
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.regist

urlpatterns = [
    path('admin/', admin.site.urls),

    path('profiles/', include('profiles.urls'))

]
