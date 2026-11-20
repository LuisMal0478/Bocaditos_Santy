"""Permisos personalizados en español para la API."""
from rest_framework import permissions

class EsAdministrador(permissions.BasePermission):
    """Permite el acceso únicamente a usuarios administradores autenticados."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)

class EsSoloLecturaOAdmin(permissions.BasePermission):
    """
    Permite lectura (GET, HEAD, OPTIONS) a cualquier usuario (público),
    pero requiere permisos de administrador para operaciones de escritura (POST, PUT, PATCH, DELETE).
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)

