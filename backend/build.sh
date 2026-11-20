#!/usr/bin/env bash
# Script de compilación y preparación para despliegue en la nube
set -o errexit

pip install --upgrade pip
pip install -r backend/requirements.txt
python backend/manage.py collectstatic --no-input
python backend/manage.py migrate

# Cargar catálogo y configuración de negocio inicial SOLO si la base de datos está vacía
python backend/manage.py shell -c "from aplicaciones.categorias.models import Categoria; from django.core.management import call_command; Categoria.objects.exists() or call_command('loaddata', 'backend/datos_iniciales.json')" || true

# Crear superusuario automáticamente si se configuran variables en Render/Railway
if [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ]; then
    python backend/manage.py createsuperuser --no-input || true
fi
