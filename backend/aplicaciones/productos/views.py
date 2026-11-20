"""Vistas para el catálogo de productos, presentaciones y variantes."""
from django.db.models import Q
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from aplicaciones.usuarios.permissions import EsSoloLecturaOAdmin, EsAdministrador
from .models import Producto, PresentacionProducto, GrupoVariante, OpcionVariante
from .serializers import (
    SerializadorProductoLista,
    SerializadorProductoDetalle,
    SerializadorProductoEscritura,
    SerializadorPresentacionProducto,
    SerializadorGrupoVariante,
    SerializadorOpcionVariante,
)

class ConjuntoVistasProducto(viewsets.ModelViewSet):
    """
    Gestión del catálogo de productos.
    - Público: Lista de productos activos con filtros por categoría y búsqueda, y detalle por slug o ID.
    - Administrador: CRUD completo, gestión de estado y borrado lógico seguro.
    """
    permission_classes = [EsSoloLecturaOAdmin]
    lookup_field = 'slug'

    def get_object(self):
        """Permite recuperar el producto tanto por slug como por su ID numérico."""
        parametro = self.kwargs.get(self.lookup_field)
        queryset = self.get_queryset()
        if parametro and parametro.isdigit():
            from django.shortcuts import get_object_or_404
            return get_object_or_404(queryset, id=int(parametro))
        return super().get_object()

    @action(detail=True, methods=['patch'], url_path='alternar-activo')
    def alternar_activo(self, request, slug=None):
        from django.utils import timezone
        producto = self.get_object()
        producto.esta_activo = not producto.esta_activo
        if not producto.esta_activo:
            producto.fecha_eliminacion = timezone.now()
        else:
            producto.fecha_eliminacion = None
        producto.save()
        return Response({
            "estado": "exito",
            "mensaje": f"El producto '{producto.nombre}' ahora está {'activo' if producto.esta_activo else 'inactivo'}.",
            "esta_activo": producto.esta_activo
        })

    @action(detail=True, methods=['patch'], url_path='alternar-destacado')
    def alternar_destacado(self, request, slug=None):
        producto = self.get_object()
        producto.esta_destacado = not producto.esta_destacado
        producto.save()
        return Response({
            "estado": "exito",
            "mensaje": f"El producto '{producto.nombre}' {'ahora es destacado' if producto.esta_destacado else 'ya no es destacado'}.",
            "esta_destacado": producto.esta_destacado
        })

    @action(detail=True, methods=['patch'], url_path='alternar-disponible')
    def alternar_disponible(self, request, slug=None):
        producto = self.get_object()
        producto.esta_disponible = not producto.esta_disponible
        producto.save()
        return Response({
            "estado": "exito",
            "mensaje": f"El producto '{producto.nombre}' {'marcado como disponible' if producto.esta_disponible else 'marcado como no disponible'}.",
            "esta_disponible": producto.esta_disponible
        })

    def get_queryset(self):
        usuario = self.request.user
        es_admin = usuario and usuario.is_authenticated and usuario.is_staff
        es_vista_admin = self.request.query_params.get('admin') in ('true', '1') or self.request.query_params.get('todos') in ('true', '1')

        if es_admin and es_vista_admin:
            queryset = Producto.objects.all().select_related('categoria').prefetch_related(
                'presentaciones',
                'grupos_variantes__opciones'
            )
        else:
            # En producción y catálogo público: solo productos activos de categorías activas
            queryset = Producto.activos.filter(
                categoria__esta_activa=True
            ).select_related('categoria').prefetch_related(
                'presentaciones',
                'grupos_variantes__opciones'
            )

        # Filtro por categoría (por ID o por slug)
        categoria_param = self.request.query_params.get('categoria')
        if categoria_param:
            if categoria_param.isdigit():
                queryset = queryset.filter(categoria_id=int(categoria_param))
            else:
                queryset = queryset.filter(categoria__slug=categoria_param)

        # Filtro por productos destacados
        destacado_param = self.request.query_params.get('destacado')
        if destacado_param is not None:
            es_destacado = destacado_param.lower() in ('true', '1')
            queryset = queryset.filter(esta_destacado=es_destacado)

        # Búsqueda por texto (nombre o descripción)
        busqueda = self.request.query_params.get('q')
        if busqueda:
            queryset = queryset.filter(
                Q(nombre__icontains=busqueda) | Q(descripcion__icontains=busqueda)
            )

        return queryset.order_by('categoria__orden', 'nombre')

    def paginate_queryset(self, queryset):
        """
        Permite desactivar la paginación si se solicita explícitamente (sin_paginar=true)
        o si es un usuario administrador gestionando el catálogo completo.
        """
        sin_paginar = self.request.query_params.get('sin_paginar')
        if sin_paginar in ('true', '1', 'si') or self.request.query_params.get('page_size') in ('all', 'todos', '0'):
            return None
        if self.request.user and self.request.user.is_authenticated and self.request.user.is_staff and not self.request.query_params.get('page'):
            return None
        return super().paginate_queryset(queryset)

    def get_serializer_class(self):
        if self.action == 'list':
            return SerializadorProductoLista
        elif self.action == 'retrieve':
            return SerializadorProductoDetalle
        return SerializadorProductoEscritura

    def destroy(self, request, *args, **kwargs):
        """Aplica borrado lógico para proteger el histórico de cotizaciones."""
        producto = self.get_object()
        
        # Verificar si está asociado a cotizaciones históricas
        cotizaciones_asociadas = producto.detalles_cotizaciones.count()
        if cotizaciones_asociadas > 0:
            producto.desactivar()
            return Response(
                {
                    "estado": "exito",
                    "mensaje": f"El producto '{producto.nombre}' fue desactivado lógicamente para proteger {cotizaciones_asociadas} cotización(es) histórica(s)."
                },
                status=status.HTTP_200_OK
            )

        # Si no tiene cotizaciones asociadas, se puede eliminar físicamente o desactivar
        producto.desactivar()
        return Response(
            {
                "estado": "exito",
                "mensaje": f"El producto '{producto.nombre}' ha sido desactivado exitosamente."
            },
            status=status.HTTP_200_OK
        )


class ConjuntoVistasPresentacion(viewsets.ModelViewSet):
    """CRUD de presentaciones de productos exclusivo para administradores."""
    serializer_class = SerializadorPresentacionProducto
    permission_classes = [EsSoloLecturaOAdmin]

    def get_queryset(self):
        queryset = PresentacionProducto.objects.all()
        producto_id = self.request.query_params.get('producto_id')
        if producto_id and producto_id.isdigit():
            queryset = queryset.filter(producto_id=int(producto_id))
        return queryset.order_by('orden', 'id')

    def perform_create(self, serializer):
        producto_id = self.request.data.get('producto_id')
        producto = Producto.objects.get(id=producto_id)
        serializer.save(producto=producto)


class ConjuntoVistasGrupoVariante(viewsets.ModelViewSet):
    """CRUD de grupos de variantes exclusivo para administradores."""
    serializer_class = SerializadorGrupoVariante
    permission_classes = [EsSoloLecturaOAdmin]

    def get_queryset(self):
        queryset = GrupoVariante.objects.all()
        producto_id = self.request.query_params.get('producto_id')
        if producto_id and producto_id.isdigit():
            queryset = queryset.filter(producto_id=int(producto_id))
        return queryset.order_by('orden', 'id')

    def perform_create(self, serializer):
        producto_id = self.request.data.get('producto_id')
        producto = Producto.objects.get(id=producto_id)
        serializer.save(producto=producto)


class ConjuntoVistasOpcionVariante(viewsets.ModelViewSet):
    """CRUD de opciones de variantes exclusivo para administradores."""
    serializer_class = SerializadorOpcionVariante
    permission_classes = [EsSoloLecturaOAdmin]

    def get_queryset(self):
        queryset = OpcionVariante.objects.all()
        grupo_id = self.request.query_params.get('grupo_id')
        if grupo_id and grupo_id.isdigit():
            queryset = queryset.filter(grupo_variante_id=int(grupo_id))
        return queryset.order_by('orden', 'id')

    def perform_create(self, serializer):
        grupo_id = self.request.data.get('grupo_id')
        grupo = GrupoVariante.objects.get(id=grupo_id)
        serializer.save(grupo_variante=grupo)
