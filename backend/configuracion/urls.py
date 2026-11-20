"""Rutas principales del backend Bocaditos Santy."""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/usuarios/', include('aplicaciones.usuarios.urls')),
    path('api/categorias/', include('aplicaciones.categorias.urls')),
    path('api/productos/', include('aplicaciones.productos.urls')),
    path('api/cotizaciones/', include('aplicaciones.cotizaciones.urls')),
    path('api/negocio/', include('aplicaciones.negocio.urls')),
]

# Servir archivos estáticos y subidos
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
else:
    urlpatterns += [
        re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
    ]

