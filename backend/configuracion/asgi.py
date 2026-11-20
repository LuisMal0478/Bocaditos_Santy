"""Configuración ASGI para el proyecto Bocaditos Santy."""
import os
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'configuracion.settings')
application = get_asgi_application()

