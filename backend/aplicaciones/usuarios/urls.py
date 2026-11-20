"""Rutas de la aplicación usuarios."""
from django.urls import path
from .views import VistaIniciarSesion, VistaRefrescarToken, VistaPerfilUsuario, VistaCambiarCredenciales

app_name = 'usuarios'

urlpatterns = [
    path('iniciar-sesion/', VistaIniciarSesion.as_view(), name='iniciar_sesion'),
    path('refrescar-token/', VistaRefrescarToken.as_view(), name='refrescar_token'),
    path('perfil/', VistaPerfilUsuario.as_view(), name='perfil'),
    path('cambiar-credenciales/', VistaCambiarCredenciales.as_view(), name='cambiar_credenciales'),
]

