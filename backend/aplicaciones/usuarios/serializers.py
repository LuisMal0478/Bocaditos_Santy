"""Serializadores en español para autenticación de usuarios."""
from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class SerializadorUsuario(serializers.ModelSerializer):
    """Serializador para datos de perfil de usuario."""
    nombre_completo = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'nombre_completo', 'is_staff']
        read_only_fields = ['id', 'is_staff']

    def get_nombre_completo(self, objeto):
        return f"{objeto.first_name} {objeto.last_name}".strip() or objeto.username

class SerializadorInicioSesionPersonalizado(TokenObtainPairSerializer):
    """
    Serializador JWT personalizado que incluye la información del usuario en la respuesta.
    """
    def validate(self, attrs):
        datos = super().validate(attrs)
        datos['usuario'] = SerializadorUsuario(self.user).data
        return datos


class SerializadorCambioCredenciales(serializers.Serializer):
    """
    Serializador para que el administrador pueda cambiar su nombre de usuario
    y/o su contraseña de forma segura.
    """
    username = serializers.CharField(max_length=150, required=False, allow_blank=True)
    first_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    clave_actual = serializers.CharField(write_only=True, required=True)
    clave_nueva = serializers.CharField(write_only=True, required=False, allow_blank=True)
    confirmar_clave_nueva = serializers.CharField(write_only=True, required=False, allow_blank=True)

    def validate(self, attrs):
        user = self.context['request'].user
        nuevo_username = attrs.get('username')
        clave_actual = attrs.get('clave_actual')
        clave_nueva = attrs.get('clave_nueva')
        confirmar_clave = attrs.get('confirmar_clave_nueva')

        # Siempre verificar la contraseña actual para autorizar cambios
        if not clave_actual:
            raise serializers.ValidationError({"clave_actual": "Debe ingresar su contraseña actual para autorizar los cambios."})
        if not user.check_password(clave_actual):
            raise serializers.ValidationError({"clave_actual": "La contraseña actual no es correcta."})

        # 1. Validación de cambio de nombre de usuario
        if nuevo_username and nuevo_username != user.username:
            if User.objects.filter(username=nuevo_username).exclude(id=user.id).exists():
                raise serializers.ValidationError({"username": "Este nombre de usuario ya está en uso. Elija otro."})

        # 2. Validación de cambio de contraseña
        if clave_nueva or confirmar_clave:
            if not clave_nueva or len(clave_nueva) < 6:
                raise serializers.ValidationError({"clave_nueva": "La nueva contraseña debe tener al menos 6 caracteres."})
            if clave_nueva != confirmar_clave:
                raise serializers.ValidationError({"confirmar_clave_nueva": "Las contraseñas nuevas no coinciden."})

        return attrs

