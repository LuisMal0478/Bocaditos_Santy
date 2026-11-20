"""Rutas de la aplicación cotizaciones."""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VistaCrearCotizacion, ConjuntoVistasCotizacionesAdmin

app_name = 'cotizaciones'

enrutador_admin = DefaultRouter()
enrutador_admin.register(r'solicitudes', ConjuntoVistasCotizacionesAdmin, basename='solicitud_admin')

urlpatterns = [
    # Endpoint público para persistir y solicitar cotización por WhatsApp
    path('', VistaCrearCotizacion.as_view(), name='crear_cotizacion'),
    
    # Endpoints privados para gestión administrativa de solicitudes
    path('gestion/', include(enrutador_admin.urls)),
]
