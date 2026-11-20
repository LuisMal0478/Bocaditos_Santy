"""Serializadores para cotizaciones y líneas de detalle histórico."""
from decimal import Decimal
from django.db import transaction
from django.utils import timezone
from rest_framework import serializers
from aplicaciones.productos.models import Producto, PresentacionProducto, OpcionVariante, GrupoVariante
from .models import Cotizacion, DetalleCotizacion
from .utilidades_whatsapp import generar_mensaje_whatsapp

class SerializadorDetalleCotizacionLectura(serializers.ModelSerializer):
    """Serializador de lectura para las líneas de una cotización."""
    class Meta:
        model = DetalleCotizacion
        fields = [
            'id',
            'producto_id',
            'nombre_producto_historico',
            'presentacion_id',
            'nombre_presentacion_historico',
            'opcion_variante_id',
            'nombre_variante_historico',
            'precio_presentacion_historico',
            'precio_adicional_variante_historico',
            'cantidad_presentaciones',
            'unidades_por_presentacion',
            'total_unidades_calculadas',
            'tipo_precio_historico',
            'estado_verificacion_historico',
            'subtotal_estimado_historico',
            'observaciones_detalle',
        ]


class SerializadorItemCotizacionEntrada(serializers.Serializer):
    """Valida cada producto seleccionado en la solicitud de cotización del cliente."""
    producto_id = serializers.IntegerField(required=True)
    presentacion_id = serializers.IntegerField(required=True)
    opcion_variante_id = serializers.IntegerField(required=False, allow_null=True)
    cantidad = serializers.IntegerField(min_value=1, default=1)
    observaciones = serializers.CharField(required=False, allow_blank=True, max_length=255)

    def validate(self, attrs):
        producto_id = attrs.get('producto_id')
        presentacion_id = attrs.get('presentacion_id')
        opcion_variante_id = attrs.get('opcion_variante_id')

        try:
            producto = Producto.activos.get(id=producto_id)
        except Producto.DoesNotExist:
            raise serializers.ValidationError({"producto_id": "El producto seleccionado no existe o no está activo."})

        try:
            presentacion = PresentacionProducto.objects.get(id=presentacion_id, producto=producto, esta_activa=True)
        except PresentacionProducto.DoesNotExist:
            raise serializers.ValidationError({"presentacion_id": "La presentación no es válida para este producto."})

        opcion = None
        if opcion_variante_id:
            try:
                opcion = OpcionVariante.objects.get(id=opcion_variante_id, grupo_variante__producto=producto, esta_activa=True)
            except OpcionVariante.DoesNotExist:
                raise serializers.ValidationError({"opcion_variante_id": "La variante especificada no es válida para este producto."})

        # Validar si el producto tiene grupos de variantes obligatorios no seleccionados
        grupos_obligatorios = producto.grupos_variantes.filter(esta_activo=True, es_obligatorio=True)
        if grupos_obligatorios.exists() and not opcion:
            nombre_grupo = grupos_obligatorios.first().nombre
            raise serializers.ValidationError({"opcion_variante_id": f"Debe seleccionar una opción obligatoria para '{nombre_grupo}'."})

        attrs['instancia_producto'] = producto
        attrs['instancia_presentacion'] = presentacion
        attrs['instancia_opcion'] = opcion
        return attrs


class SerializadorCreacionCotizacion(serializers.Serializer):
    """
    Serializador principal para recibir y persistir solicitudes de cotización desde la web.
    Incluye protección anti-spam por campo trampa (honeypot) y validaciones de negocio.
    """
    nombre_cliente = serializers.CharField(max_length=120)
    telefono_whatsapp = serializers.CharField(max_length=25)
    correo_electronico = serializers.EmailField(required=False, allow_blank=True)
    tipo_evento = serializers.CharField(max_length=80)
    fecha_evento = serializers.DateField()
    lugar_evento = serializers.CharField(max_length=200, required=False, allow_blank=True)
    cantidad_invitados = serializers.IntegerField(required=False, allow_null=True, min_value=1)
    observaciones = serializers.CharField(required=False, allow_blank=True)
    acepta_politica_privacidad = serializers.BooleanField(default=True)
    
    # Campo trampa anti-spam (Honeypot): debe venir vacío en solicitudes legítimas de humanos
    campo_control_trampa = serializers.CharField(required=False, allow_blank=True, write_only=True)

    items = SerializadorItemCotizacionEntrada(many=True, allow_empty=False)

    def validate_campo_control_trampa(self, valor):
        if valor:
            raise serializers.ValidationError("Solicitud automatizada no permitida.")
        return valor

    def validate_fecha_evento(self, valor):
        if valor < timezone.now().date():
            raise serializers.ValidationError("La fecha del evento debe ser hoy o una fecha futura.")
        return valor

    def validate_telefono_whatsapp(self, valor):
        digitos = ''.join(c for c in valor if c.isdigit())
        if len(digitos) < 7:
            raise serializers.ValidationError("Por favor ingrese un número de teléfono o WhatsApp válido.")
        return valor

    def validate_acepta_politica_privacidad(self, valor):
        if not valor:
            raise serializers.ValidationError("Debe aceptar el tratamiento de datos de contacto para gestionar su cotización.")
        return valor

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        validated_data.pop('campo_control_trampa', None)

        request = self.context.get('request')
        ip_origen = None
        if request:
            x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
            if x_forwarded_for:
                ip_origen = x_forwarded_for.split(',')[0].strip()
            else:
                ip_origen = request.META.get('REMOTE_ADDR')

        # 1. Crear y persistir la Cotización en PostgreSQL
        cotizacion = Cotizacion.objects.create(
            nombre_cliente=validated_data['nombre_cliente'],
            telefono_whatsapp=validated_data['telefono_whatsapp'],
            correo_electronico=validated_data.get('correo_electronico', ''),
            tipo_evento=validated_data['tipo_evento'],
            fecha_evento=validated_data['fecha_evento'],
            lugar_evento=validated_data.get('lugar_evento', ''),
            cantidad_invitados=validated_data.get('cantidad_invitados'),
            observaciones=validated_data.get('observaciones', ''),
            acepta_politica_privacidad=validated_data.get('acepta_politica_privacidad', True),
            ip_origen=ip_origen
        )

        # 2. Guardar cada detalle histórico inmutable
        detalles_creados = []
        for item in items_data:
            producto = item['instancia_producto']
            presentacion = item['instancia_presentacion']
            opcion = item.get('instancia_opcion')
            cantidad = item.get('cantidad', 1)
            nota = item.get('observaciones', '')

            detalle = DetalleCotizacion.objects.create(
                cotizacion=cotizacion,
                producto=producto,
                nombre_producto_historico=producto.nombre,
                presentacion=presentacion,
                nombre_presentacion_historico=presentacion.nombre,
                opcion_variante=opcion,
                nombre_variante_historico=opcion.nombre if opcion else '',
                precio_presentacion_historico=presentacion.precio,
                precio_adicional_variante_historico=opcion.precio_adicional if opcion else Decimal('0.00'),
                cantidad_presentaciones=cantidad,
                unidades_por_presentacion=presentacion.cantidad_unidades,
                tipo_precio_historico=presentacion.tipo_precio,
                estado_verificacion_historico=presentacion.estado_verificacion_precio,
                observaciones_detalle=nota
            )
            detalles_creados.append(detalle)

        # 3. Generar mensaje estructurado y URL oficial de WhatsApp
        mensaje_texto, url_whatsapp = generar_mensaje_whatsapp(cotizacion, detalles_creados)

        return {
            "cotizacion": cotizacion,
            "detalles": detalles_creados,
            "mensaje_whatsapp": mensaje_texto,
            "url_whatsapp": url_whatsapp,
        }


class SerializadorCotizacionResumenAdmin(serializers.ModelSerializer):
    """Serializador para listados en el panel administrativo."""
    total_items = serializers.SerializerMethodField()
    estado_texto = serializers.CharField(source='get_estado_display', read_only=True)

    class Meta:
        model = Cotizacion
        fields = [
            'id',
            'codigo_seguimiento',
            'nombre_cliente',
            'telefono_whatsapp',
            'tipo_evento',
            'fecha_evento',
            'cantidad_invitados',
            'estado',
            'estado_texto',
            'total_items',
            'fecha_creacion',
        ]

    def get_total_items(self, objeto):
        return objeto.detalles.count()


class SerializadorCotizacionDetalleAdmin(serializers.ModelSerializer):
    """Serializador detallado con todas las líneas históricas para el panel administrativo."""
    detalles = SerializadorDetalleCotizacionLectura(many=True, read_only=True)
    estado_texto = serializers.CharField(source='get_estado_display', read_only=True)

    class Meta:
        model = Cotizacion
        fields = [
            'id',
            'codigo_seguimiento',
            'nombre_cliente',
            'telefono_whatsapp',
            'correo_electronico',
            'tipo_evento',
            'fecha_evento',
            'lugar_evento',
            'cantidad_invitados',
            'observaciones',
            'estado',
            'estado_texto',
            'ip_origen',
            'detalles',
            'fecha_creacion',
            'fecha_actualizacion',
        ]

