"""Configuración WSGI para el proyecto Bocaditos Santy."""
import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'configuracion.settings')
application = get_wsgi_application()

