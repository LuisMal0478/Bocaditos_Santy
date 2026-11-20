"""Rutas de la aplicación negocio."""
from django.urls import path
from .views import VistaConfiguracionNegocio

app_name = 'negocio'

urlpatterns = [
    path('', VistaConfiguracionNegocio.as_view(), name='configuracion_negocio'),
]
