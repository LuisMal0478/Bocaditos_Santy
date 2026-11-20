"""Rutas de la aplicación categorías."""
from rest_framework.routers import DefaultRouter
from .views import ConjuntoVistasCategoria

app_name = 'categorias'

enrutador = DefaultRouter()
enrutador.register(r'', ConjuntoVistasCategoria, basename='categoria')

urlpatterns = enrutador.urls
