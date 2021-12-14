from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from segment import views

router = routers.DefaultRouter()
router.register(r'documents', views.DocumentViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/segment/', views.segment_img_view),
    path('api/windowing/', views.windowing_view),
    path('api/classify/', views.classificationWithGradcam_view),
    path('api/', include(router.urls)),
]

if settings.DEBUG:
        urlpatterns += static(settings.MEDIA_URL,
                              document_root=settings.MEDIA_ROOT)

