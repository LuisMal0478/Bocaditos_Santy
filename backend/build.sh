#!/usr/bin/env bash
# Script de compilación y preparación para despliegue en la nube
set -o errexit

pip install --upgrade pip
pip install -r backend/requirements.txt
python backend/manage.py collectstatic --no-input
python backend/manage.py migrate
