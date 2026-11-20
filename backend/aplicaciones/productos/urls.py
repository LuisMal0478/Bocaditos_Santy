"""Rutas de la aplicación productos."""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ConjuntoVistasProducto,
    ConjuntoVistasPresentacion,
    ConjuntoVistasGrupoVariante,
    ConjuntoVistasOpcionVariante,
)

app_name = 'productos'

enrutador = DefaultRouter()
enrutador.register(r'presentaciones', ConjuntoVistasPresentacion, basename='presentacion')
enrutador.register(r'grupos-variantes', ConjuntoVistasGrupoVariante, basename='grupo_variante')
enrutador.register(r'opciones-variantes', ConjuntoVistasOpcionVariante, basename='opcion_variante')
enrutador.register(r'', ConjuntoVistasProducto, basename='producto')

urlpatterns = [
    path('', include(enrutador.urls)),
]
