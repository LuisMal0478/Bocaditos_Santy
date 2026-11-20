#!/usr/bin/env python
"""Utilidad de línea de comandos de Django para tareas administrativas."""
import os
import sys

def principal():
    """Ejecutar tareas administrativas."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'configuracion.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as excepcion:
        raise ImportError(
            "No se pudo importar Django. ¿Está instalado y disponible en la variable de entorno PYTHONPATH? "
            "¿Olvidó activar el entorno virtual?"
        ) from excepcion
    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    principal()

