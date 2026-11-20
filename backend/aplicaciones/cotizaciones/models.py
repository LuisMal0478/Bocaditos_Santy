"""Modelos de la aplicación cotizaciones y detalle histórico."""
from decimal import Decimal
from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError
from aplicaciones.productos.models import Producto, PresentacionProducto, OpcionVariante

class Cotizacion(models.Model):
    """
    Representa la solicitud formal de cotización registrada por un cliente.
    Se persiste en PostgreSQL ANTES de abrir la API de WhatsApp.
    """
    ESTADOS_COTIZACION = (
        ('PENDIENTE', 'Pendiente de Revisión'),
        ('EN_REVISION', 'En Revisión'),
        ('COTIZACION_ENVIADA', 'Cotización Enviada al Cliente'),
        ('CONFIRMADA', 'Evento Confirmado'),
        ('CANCELADA', 'Cancelada'),
    )

    codigo_seguimiento = models.CharField(
        max_length=30,
        unique=True,
        db_index=True,
        blank=True,
        verbose_name="Código de seguimiento (ej. COT-202611-0001)"
    )
    nombre_cliente = models.CharField(max_length=120, verbose_name="Nombre del cliente")
    telefono_whatsapp = models.CharField(max_length=25, verbose_name="Número de WhatsApp")
    correo_electronico = models.EmailField(blank=True, verbose_name="Correo electrónico")
    tipo_evento = models.CharField(max_length=80, verbose_name="Tipo de evento")
    fecha_evento = models.DateField(verbose_name="Fecha estimada del evento")
    lugar_evento = models.CharField(max_length=200, blank=True, verbose_name="Lugar o municipio del evento")
    cantidad_invitados = models.PositiveIntegerField(null=True, blank=True, verbose_name="Número aproximado de invitados")
    observaciones = models.TextField(blank=True, verbose_name="Observaciones o requerimientos especiales")
    estado = models.CharField(
        max_length=25,
        choices=ESTADOS_COTIZACION,
        default='PENDIENTE',
        verbose_name="Estado de la solicitud"
    )
    acepta_politica_privacidad = models.BooleanField(
        default=True,
        verbose_name="Acepta política de tratamiento de datos de contacto"
    )
    ip_origen = models.GenericIPAddressField(
        null=True,
        blank=True,
        verbose_name="Dirección IP de origen (auditoría anti-spam)"
    )
    fecha_creacion = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de recepción")
    fecha_actualizacion = models.DateTimeField(auto_now=True, verbose_name="Fecha de última actualización")

    class Meta:
        verbose_name = "Cotización"
        verbose_name_plural = "Cotizaciones"
        ordering = ['-fecha_creacion']

    def __str__(self):
        return f"{self.codigo_seguimiento or 'Borrador'} - {self.nombre_cliente} ({self.tipo_evento})"

    def clean(self):
        super().clean()
        if self.fecha_evento and self.fecha_evento < timezone.now().date():
            raise ValidationError({
                'fecha_evento': 'La fecha del evento no puede ser anterior a la fecha actual.'
            })

    def save(self, *args, **kwargs):
        if not self.codigo_seguimiento:
            ahora = timezone.now()
            prefijo = ahora.strftime("COT-%Y%m-")
            ultimo = Cotizacion.objects.filter(codigo_seguimiento__startswith=prefijo).order_by('-id').first()
            consecutivo = 1
            if ultimo and ultimo.codigo_seguimiento:
                try:
                    consecutivo = int(ultimo.codigo_seguimiento.split('-')[-1]) + 1
                except (ValueError, IndexError):
                    consecutivo = 1
            self.codigo_seguimiento = f"{prefijo}{consecutivo:04d}"
        super().save(*args, **kwargs)


class DetalleCotizacion(models.Model):
    """
    Línea de cotización histórica inmutable.
    Almacena una copia exacta de los nombres, presentaciones, variantes y precios
    al momento de generar la cotización, protegiéndola contra cambios futuros en el catálogo.
    """
    cotizacion = models.ForeignKey(
        Cotizacion,
        on_delete=models.CASCADE,
        related_name='detalles',
        verbose_name="Cotización asociada"
    )
    producto = models.ForeignKey(
        Producto,
        on_delete=models.PROTECT,
        related_name='detalles_cotizaciones',
        verbose_name="Producto de referencia"
    )
    nombre_producto_historico = models.CharField(
        max_length=150,
        verbose_name="Nombre histórico del producto"
    )
    presentacion = models.ForeignKey(
        PresentacionProducto,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name="Presentación de referencia"
    )
    nombre_presentacion_historico = models.CharField(
        max_length=100,
        verbose_name="Nombre histórico de presentación (ej. Paquete x 20 unid)"
    )
    opcion_variante = models.ForeignKey(
        OpcionVariante,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name="Variante de referencia"
    )
    nombre_variante_historico = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="Nombre histórico de variante (ej. Sabor: Pollo)"
    )
    precio_presentacion_historico = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name="Precio histórico de la presentación"
    )
    precio_adicional_variante_historico = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00'),
        verbose_name="Recargo histórico de la variante"
    )
    cantidad_presentaciones = models.PositiveIntegerField(
        default=1,
        verbose_name="Cantidad de paquetes / presentaciones solicitadas"
    )
    unidades_por_presentacion = models.PositiveIntegerField(
        default=1,
        verbose_name="Unidades contenidas en cada paquete"
    )
    total_unidades_calculadas = models.PositiveIntegerField(
        default=1,
        verbose_name="Total neto de unidades (paquetes * unidades)"
    )
    tipo_precio_historico = models.CharField(
        max_length=20,
        default='FIJO',
        verbose_name="Tipo de precio histórico (FIJO o A_COTIZAR)"
    )
    estado_verificacion_historico = models.CharField(
        max_length=20,
        default='PENDIENTE',
        verbose_name="Estado de verificación al cotizar"
    )
    subtotal_estimado_historico = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name="Subtotal estimado (null si es a cotizar o pendiente)"
    )
    observaciones_detalle = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Observaciones particulares del producto"
    )

    class Meta:
        verbose_name = "Detalle de cotización"
        verbose_name_plural = "Detalles de cotizaciones"

    def __str__(self):
        return f"{self.cantidad_presentaciones}x {self.nombre_producto_historico} ({self.nombre_presentacion_historico})"

    def save(self, *args, **kwargs):
        # Calcular el total de unidades explícito
        self.total_unidades_calculadas = self.cantidad_presentaciones * self.unidades_por_presentacion
        
        # Calcular subtotal estimado solo si el precio es fijo y confirmado
        if (
            self.tipo_precio_historico == 'FIJO'
            and self.estado_verificacion_historico == 'CONFIRMADO'
            and self.precio_presentacion_historico is not None
        ):
            precio_base = self.precio_presentacion_historico + (self.precio_adicional_variante_historico or Decimal('0.00'))
            self.subtotal_estimado_historico = precio_base * self.cantidad_presentaciones
        else:
            self.subtotal_estimado_historico = None

        super().save(*args, **kwargs)

