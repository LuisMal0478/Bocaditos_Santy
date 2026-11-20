"""Vistas para la configuración del negocio."""
from rest_framework import generics
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from aplicaciones.usuarios.permissions import EsSoloLecturaOAdmin
from .models import ConfiguracionNegocio
from .serializers import SerializadorConfiguracionNegocio

class VistaConfiguracionNegocio(generics.RetrieveUpdateAPIView):
    """
    Permite consultar públicamente los datos del negocio (WhatsApp, redes, horarios)
    y permite al administrador actualizar la información.
    """
    serializer_class = SerializadorConfiguracionNegocio
    permission_classes = [EsSoloLecturaOAdmin]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_object(self):
        return ConfiguracionNegocio.obtener_configuracion()
