"""Vistas para recepción y gestión de solicitudes de cotización."""
from rest_framework import generics, viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.throttling import AnonRateThrottle
from aplicaciones.usuarios.permissions import EsAdministrador
from .models import Cotizacion
from .serializers import (
    SerializadorCreacionCotizacion,
    SerializadorCotizacionResumenAdmin,
    SerializadorCotizacionDetalleAdmin,
)

class LimitadorTasaCotizaciones(AnonRateThrottle):
    scope = 'cotizaciones'

class VistaCrearCotizacion(generics.GenericAPIView):
    """
    Endpoint público para recibir y persistir solicitudes de cotización.
    - Valida los datos y la trampa anti-spam.
    - Guarda la cotización y líneas en PostgreSQL.
    - Retorna el código de seguimiento, el mensaje estructurado y la URL oficial de WhatsApp.
    """
    serializer_class = SerializadorCreacionCotizacion
    throttle_classes = [LimitadorTasaCotizaciones]

    def post(self, request, *args, **kwargs):
        serializador = self.get_serializer(data=request.data, context={'request': request})
        serializador.is_valid(raise_exception=True)
        resultado = serializador.save()

        cotizacion = resultado['cotizacion']

        return Response(
            {
                "estado": "exito",
                "mensaje": "Su solicitud de cotización ha sido registrada exitosamente en nuestro sistema.",
                "datos": {
                    "id": cotizacion.id,
                    "codigo_seguimiento": cotizacion.codigo_seguimiento,
                    "nombre_cliente": cotizacion.nombre_cliente,
                    "tipo_evento": cotizacion.tipo_evento,
                    "fecha_evento": cotizacion.fecha_evento,
                    "url_whatsapp": resultado['url_whatsapp'],
                    "mensaje_whatsapp": resultado['mensaje_whatsapp'],
                    "total_items": len(resultado['detalles']),
                    "fecha_creacion": cotizacion.fecha_creacion,
                }
            },
            status=status.HTTP_201_CREATED
        )


class ConjuntoVistasCotizacionesAdmin(viewsets.ReadOnlyModelViewSet):
    """
    Bandeja de solicitudes de cotización para el panel administrativo.
    Permite filtrar por estado, consultar detalle histórico y actualizar estados.
    """
    permission_classes = [EsAdministrador]
    pagination_class = None

    def get_queryset(self):
        queryset = Cotizacion.objects.all().prefetch_related('detalles')
        estado_filtro = self.request.query_params.get('estado')
        if estado_filtro:
            queryset = queryset.filter(estado=estado_filtro)
        return queryset.order_by('-fecha_creacion')

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return SerializadorCotizacionDetalleAdmin
        return SerializadorCotizacionResumenAdmin

    @action(detail=True, methods=['patch'], url_path='cambiar-estado')
    def cambiar_estado(self, request, pk=None):
        cotizacion = self.get_object()
        nuevo_estado = request.data.get('estado')

        estados_validos = [e[0] for e in Cotizacion.ESTADOS_COTIZACION]
        if nuevo_estado not in estados_validos:
            return Response(
                {
                    "estado": "error",
                    "codigo_error": "ESTADO_INVALIDO",
                    "mensaje": f"El estado '{nuevo_estado}' no es válido. Estados disponibles: {', '.join(estados_validos)}"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        cotizacion.estado = nuevo_estado
        cotizacion.save()

        return Response({
            "estado": "exito",
            "mensaje": f"El estado de la cotización {cotizacion.codigo_seguimiento} fue actualizado a '{cotizacion.get_estado_display()}'.",
            "datos": {
                "id": cotizacion.id,
                "codigo_seguimiento": cotizacion.codigo_seguimiento,
                "nuevo_estado": cotizacion.estado,
                "estado_texto": cotizacion.get_estado_display()
            }
        })
