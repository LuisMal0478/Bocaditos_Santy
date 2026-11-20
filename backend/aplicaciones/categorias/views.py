"""Vistas para la gestión de categorías."""
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from aplicaciones.usuarios.permissions import EsSoloLecturaOAdmin
from .models import Categoria
from .serializers import SerializadorCategoria

class ConjuntoVistasCategoria(viewsets.ModelViewSet):
    """
    CRUD completo para categorías.
    Lectura pública de categorías activas, modificaciones restringidas a administradores.
    """
    serializer_class = SerializadorCategoria
    permission_classes = [EsSoloLecturaOAdmin]
    pagination_class = None
    lookup_field = 'id'

    def get_queryset(self):
        usuario = self.request.user
        es_admin = usuario and usuario.is_authenticated and usuario.is_staff
        ver_todas = self.request.query_params.get('todas') in ('true', '1', 'si')

        if es_admin and ver_todas:
            return Categoria.objects.all().order_by('orden', 'nombre')
        # En producción y catálogo público, SIEMPRE solo las activas
        return Categoria.objects.filter(esta_activa=True).order_by('orden', 'nombre')

    @action(detail=True, methods=['patch'], url_path='alternar-activa')
    def alternar_activa(self, request, id=None):
        categoria = self.get_object()
        categoria.esta_activa = not categoria.esta_activa
        categoria.save()
        return Response({
            "estado": "exito",
            "mensaje": f"La categoría '{categoria.nombre}' ahora está {'activa' if categoria.esta_activa else 'inactiva'}.",
            "esta_activa": categoria.esta_activa
        })

    def destroy(self, request, *args, **kwargs):
        instancia = self.get_object()
        # Verificar dependencias antes de eliminar
        productos_asociados = instancia.productos.filter(esta_activo=True).count()
        if productos_asociados > 0:
            return Response(
                {
                    "estado": "error",
                    "codigo_error": "CATEGORIA_CON_PRODUCTOS",
                    "mensaje": f"No se puede eliminar la categoría '{instancia.nombre}' porque tiene {productos_asociados} producto(s) activo(s) asociado(s). Desactive o reasigne los productos primero."
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        # Si no tiene productos activos, se desactiva lógicamente o elimina
        instancia.esta_activa = False
        instancia.save()
        return Response(
            {
                "estado": "exito",
                "mensaje": f"La categoría '{instancia.nombre}' fue desactivada exitosamente."
            },
            status=status.HTTP_200_OK
        )
