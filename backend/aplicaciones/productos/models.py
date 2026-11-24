"""Modelos de la aplicación productos, presentaciones y variantes."""
from decimal import Decimal
from django.db import models
from django.utils.text import slugify
from django.utils import timezone
from django.core.exceptions import ValidationError
from aplicaciones.categorias.models import Categoria

class AdministradorProductosActivos(models.Manager):
    """Filtra únicamente los productos activos (borrado lógico no aplicado)."""
    def get_queryset(self):
        return super().get_queryset().filter(esta_activo=True)

class Producto(models.Model):
    """
    Modelo representativo del producto base.
    No almacena precios directamente; la fuente de verdad económica
    es su relación con PresentacionProducto.
    """
    categoria = models.ForeignKey(
        Categoria,
        on_delete=models.PROTECT,
        related_name='productos',
        verbose_name="Categoría"
    )
    nombre = models.CharField(max_length=150, verbose_name="Nombre del producto")
    slug = models.SlugField(max_length=180, unique=True, blank=True, verbose_name="Slug amigable")
    descripcion = models.TextField(blank=True, verbose_name="Descripción detallada")
    imagen_url = models.TextField(blank=True, verbose_name="URL o Data URI de la imagen")
    imagen_id_publico = models.CharField(max_length=255, blank=True, verbose_name="ID público en Cloudinary")
    esta_disponible = models.BooleanField(default=True, verbose_name="¿Disponible para pedidos?")
    esta_destacado = models.BooleanField(default=False, verbose_name="¿Producto destacado?")
    
    # Soporte para borrado lógico (Soft delete) para proteger histórico de cotizaciones
    esta_activo = models.BooleanField(default=True, verbose_name="¿Está activo?")
    fecha_eliminacion = models.DateTimeField(null=True, blank=True, verbose_name="Fecha de desactivación")
    
    fecha_creacion = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de creación")
    fecha_actualizacion = models.DateTimeField(auto_now=True, verbose_name="Fecha de actualización")

    # Administradores de consultas
    objects = models.Manager()  # Todos los registros (incluyendo inactivos)
    activos = AdministradorProductosActivos()  # Solo activos

    class Meta:
        verbose_name = "Producto"
        verbose_name_plural = "Productos"
        ordering = ['categoria__orden', 'nombre']

    def __str__(self):
        return f"{self.nombre} ({self.categoria.nombre})"

    def save(self, *args, **kwargs):
        if not self.slug:
            slug_base = slugify(self.nombre)
            slug_propuesto = slug_base
            contador = 1
            while Producto.objects.filter(slug=slug_propuesto).exclude(pk=self.pk).exists():
                slug_propuesto = f"{slug_base}-{contador}"
                contador += 1
            self.slug = slug_propuesto
        super().save(*args, **kwargs)

    def desactivar(self):
        """Aplica borrado lógico sin destruir el registro ni romper relaciones de cotizaciones."""
        self.esta_activo = False
        self.fecha_eliminacion = timezone.now()
        self.save()


class PresentacionProducto(models.Model):
    """
    Fuente única de verdad de precios y formas de comercialización del producto.
    Ejemplos: 'Por unidad' (1 unid), 'Paquete x 20 unidades' (20 unid), 'Combo x 100'.
    """
    OPCIONES_TIPO_PRECIO = (
        ('FIJO', 'Precio Fijo'),
        ('A_COTIZAR', 'Sujeto a Cotización'),
    )

    OPCIONES_ESTADO_VERIFICACION = (
        ('PENDIENTE', 'Pendiente de Confirmación'),
        ('CONFIRMADO', 'Confirmado'),
        ('NO_APLICA', 'No Aplica (Exclusivo a Cotizar)'),
    )

    producto = models.ForeignKey(
        Producto,
        on_delete=models.CASCADE,
        related_name='presentaciones',
        verbose_name="Producto asociado"
    )
    nombre = models.CharField(max_length=100, verbose_name="Nombre de presentación (ej. Paquete x 20 unid)")
    cantidad_unidades = models.PositiveIntegerField(default=1, verbose_name="Cantidad de unidades incluidas")
    precio = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name="Precio monetario"
    )
    tipo_precio = models.CharField(
        max_length=20,
        choices=OPCIONES_TIPO_PRECIO,
        default='FIJO',
        verbose_name="Tipo de precio"
    )
    estado_verificacion_precio = models.CharField(
        max_length=20,
        choices=OPCIONES_ESTADO_VERIFICACION,
        default='PENDIENTE',
        verbose_name="Estado de verificación de precio"
    )
    es_predeterminada = models.BooleanField(
        default=False,
        verbose_name="¿Es la presentación predeterminada?"
    )
    esta_activa = models.BooleanField(default=True, verbose_name="¿Está activa?")
    orden = models.PositiveIntegerField(default=0, verbose_name="Orden de visualización")

    class Meta:
        verbose_name = "Presentación de producto"
        verbose_name_plural = "Presentaciones de productos"
        ordering = ['orden', 'id']

    def __str__(self):
        precio_texto = f"${self.precio:,.0f}" if self.precio is not None else "Sin precio"
        return f"{self.producto.nombre} - {self.nombre} ({precio_texto} / {self.get_estado_verificacion_precio_display()})"

    def clean(self):
        """Reglas de integridad de precios."""
        super().clean()
        if self.tipo_precio == 'FIJO' and self.estado_verificacion_precio == 'CONFIRMADO':
            if self.precio is None or self.precio <= Decimal('0.00'):
                raise ValidationError({
                    'precio': 'Un precio confirmado y fijo debe ser un valor monetario positivo mayor a cero.'
                })
        if self.tipo_precio == 'A_COTIZAR' and self.estado_verificacion_precio == 'CONFIRMADO':
            raise ValidationError({
                'estado_verificacion_precio': 'Un producto sujeto a cotización no puede tener estado de verificación Confirmado. Use No Aplica o Pendiente.'
            })

    def save(self, *args, **kwargs):
        # Si esta presentación se marca como predeterminada, desmarcar las demás del mismo producto
        if self.es_predeterminada:
            PresentacionProducto.objects.filter(producto=self.producto).exclude(pk=self.pk).update(es_predeterminada=False)
        super().save(*args, **kwargs)


class GrupoVariante(models.Model):
    """
    Grupo de personalización para el producto (ej: 'Sabor', 'Relleno', 'Topping').
    Permite definir si la elección es obligatoria u opcional para el cliente.
    """
    producto = models.ForeignKey(
        Producto,
        on_delete=models.CASCADE,
        related_name='grupos_variantes',
        verbose_name="Producto asociado"
    )
    nombre = models.CharField(max_length=80, verbose_name="Nombre del grupo (ej. Sabor, Relleno)")
    es_obligatorio = models.BooleanField(
        default=True,
        verbose_name="¿Es selección obligatoria para cotizar?"
    )
    permite_multiple = models.BooleanField(
        default=False,
        verbose_name="¿Permite selección múltiple de opciones?"
    )
    orden = models.PositiveIntegerField(default=0, verbose_name="Orden de visualización")
    esta_activo = models.BooleanField(default=True, verbose_name="¿Está activo?")

    class Meta:
        verbose_name = "Grupo de variantes"
        verbose_name_plural = "Grupos de variantes"
        ordering = ['orden', 'id']

    def __str__(self):
        obligatorio = "Obligatorio" if self.es_obligatorio else "Opcional"
        return f"{self.producto.nombre} - Grupo: {self.nombre} ({obligatorio})"


class OpcionVariante(models.Model):
    """
    Opción puntual dentro de un grupo de variantes (ej: 'Pollo', 'Carne', 'Mora').
    Permite opcionalmente un precio adicional / recargo.
    """
    grupo_variante = models.ForeignKey(
        GrupoVariante,
        on_delete=models.CASCADE,
        related_name='opciones',
        verbose_name="Grupo de variantes"
    )
    nombre = models.CharField(max_length=100, verbose_name="Nombre de la opción (ej. Pollo, Mora)")
    precio_adicional = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00'),
        verbose_name="Precio adicional / recargo"
    )
    esta_disponible = models.BooleanField(default=True, verbose_name="¿Está disponible?")
    esta_activa = models.BooleanField(default=True, verbose_name="¿Está activa?")
    orden = models.PositiveIntegerField(default=0, verbose_name="Orden de visualización")

    class Meta:
        verbose_name = "Opción de variante"
        verbose_name_plural = "Opciones de variantes"
        ordering = ['orden', 'id']

    def __str__(self):
        recargo = f" (+${self.precio_adicional:,.0f})" if self.precio_adicional > 0 else ""
        return f"{self.grupo_variante.nombre}: {self.nombre}{recargo}"

