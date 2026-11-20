"""Vistas de autenticación y gestión de usuarios."""
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import (
    SerializadorInicioSesionPersonalizado,
    SerializadorUsuario,
    SerializadorCambioCredenciales,
)

class LimitadorInicioSesion(AnonRateThrottle):
    scope = 'iniciar_sesion'

class VistaIniciarSesion(TokenObtainPairView):
    """
    Endpoint para iniciar sesión con credenciales y recibir tokens JWT.
    Protegido contra fuerza bruta con limitador de tasa.
    """
    serializer_class = SerializadorInicioSesionPersonalizado
    throttle_classes = [LimitadorInicioSesion]

class VistaRefrescarToken(TokenRefreshView):
    """Endpoint para refrescar el token de acceso JWT."""
    pass

class VistaPerfilUsuario(generics.RetrieveUpdateAPIView):
    """Permite al usuario autenticado consultar y actualizar su perfil."""
    serializer_class = SerializadorUsuario
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class VistaCambiarCredenciales(APIView):
    """
    Permite al usuario autenticado cambiar su nombre de usuario, nombre, correo y contraseña.
    Protegido contra fuerza bruta con limitador de tasa.
    """
    permission_classes = [permissions.IsAuthenticated]
    throttle_classes = [LimitadorInicioSesion]

    def post(self, request):
        serializer = SerializadorCambioCredenciales(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)

        user = request.user
        datos = serializer.validated_data

        hubo_cambios = False
        cambio_clave = False

        if datos.get('username') and datos['username'] != user.username:
            user.username = datos['username']
            hubo_cambios = True

        if 'first_name' in datos and datos['first_name']:
            user.first_name = datos['first_name']
            hubo_cambios = True

        if 'email' in datos and datos['email']:
            user.email = datos['email']
            hubo_cambios = True

        if datos.get('clave_nueva'):
            user.set_password(datos['clave_nueva'])
            hubo_cambios = True
            cambio_clave = True

        if hubo_cambios:
            user.save()

        # Generar nuevos tokens JWT para mantener la sesión activa con la nueva contraseña
        refresh = RefreshToken.for_user(user)

        return Response({
            "estado": "exito",
            "mensaje": "¡Credenciales actualizadas exitosamente!",
            "cambio_clave": cambio_clave,
            "usuario": SerializadorUsuario(user).data,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }, status=status.HTTP_200_OK)

