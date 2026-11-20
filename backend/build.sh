#!/usr/bin/env bash
# Script de compilación y preparación para despliegue en la nube
set -o errexit

pip install --upgrade pip
pip install -r backend/requirements.txt
python backend/manage.py collectstatic --no-input
python backend/manage.py migrate

# Cargar catálogo y configuración de negocio inicial
python backend/manage.py loaddata backend/datos_iniciales.json || true

# Crear superusuario automáticamente si se configuran variables en Render/Railway
if [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ]; then
    python backend/manage.py createsuperuser --no-input || true
fi
