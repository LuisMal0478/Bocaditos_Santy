"""Serializadores para productos, presentaciones y grupos de variantes."""
from rest_framework import serializers
from aplicaciones.categorias.serializers import SerializadorCategoria
from .models import Producto, PresentacionProducto, GrupoVariante, OpcionVariante
from .servicios_cloudinary import subir_imagen_producto, programar_eliminacion_post_commit

class SerializadorOpcionVariante(serializers.ModelSerializer):
    """Serializador para opciones individuales dentro de un grupo de variantes."""
    class Meta:
        model = OpcionVariante
        fields = [
            'id',
            'nombre',
            'precio_adicional',
            'esta_disponible',
            'esta_activa',
            'orden',
        ]


class SerializadorGrupoVariante(serializers.ModelSerializer):
    """Serializador para grupos de variantes con sus opciones anidadas."""
    opciones = serializers.SerializerMethodField()

    class Meta:
        model = GrupoVariante
        fields = [
            'id',
            'nombre',
            'es_obligatorio',
            'permite_multiple',
            'orden',
            'esta_activo',
            'opciones',
        ]

    def get_opciones(self, objeto):
        opciones_activas = objeto.opciones.filter(esta_activa=True).order_by('orden', 'id')
        return SerializadorOpcionVariante(opciones_activas, many=True).data


class SerializadorPresentacionProducto(serializers.ModelSerializer):
    """Serializador de presentaciones del producto (fuente de verdad económica)."""
    texto_estado_verificacion = serializers.CharField(source='get_estado_verificacion_precio_display', read_only=True)
    texto_tipo_precio = serializers.CharField(source='get_tipo_precio_display', read_only=True)

    class Meta:
        model = PresentacionProducto
        fields = [
            'id',
            'nombre',
            'cantidad_unidades',
            'precio',
            'tipo_precio',
            'texto_tipo_precio',
            'estado_verificacion_precio',
            'texto_estado_verificacion',
            'es_predeterminada',
            'esta_activa',
            'orden',
        ]


class SerializadorProductoLista(serializers.ModelSerializer):
    """
    Serializador optimizado para el catálogo público y listados.
    Incluye la presentación predeterminada y conteo de opciones.
    """
    categoria_id = serializers.IntegerField(source='categoria.id', read_only=True)
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)
    categoria_slug = serializers.CharField(source='categoria.slug', read_only=True)
    presentacion_predeterminada = serializers.SerializerMethodField()
    total_presentaciones = serializers.SerializerMethodField()
    tiene_variantes = serializers.SerializerMethodField()

    class Meta:
        model = Producto
        fields = [
            'id',
            'categoria_id',
            'categoria_nombre',
            'categoria_slug',
            'nombre',
            'slug',
            'descripcion',
            'imagen_url',
            'esta_disponible',
            'esta_destacado',
            'esta_activo',
            'presentacion_predeterminada',
            'total_presentaciones',
            'tiene_variantes',
        ]

    def get_presentacion_predeterminada(self, objeto):
        presentacion = objeto.presentaciones.filter(esta_activa=True, es_predeterminada=True).first()
        if not presentacion:
            presentacion = objeto.presentaciones.filter(esta_activa=True).first()
        if presentacion:
            return SerializadorPresentacionProducto(presentacion).data
        return None

    def get_total_presentaciones(self, objeto):
        return objeto.presentaciones.filter(esta_activa=True).count()

    def get_tiene_variantes(self, objeto):
        return objeto.grupos_variantes.filter(esta_activo=True).exists()


class SerializadorProductoDetalle(serializers.ModelSerializer):
    """
    Serializador completo con todas las presentaciones y grupos de variantes
    para la vista de detalle y el selector de cotizaciones.
    """
    categoria = SerializadorCategoria(read_only=True)
    presentaciones = serializers.SerializerMethodField()
    grupos_variantes = serializers.SerializerMethodField()

    class Meta:
        model = Producto
        fields = [
            'id',
            'categoria',
            'nombre',
            'slug',
            'descripcion',
            'imagen_url',
            'imagen_id_publico',
            'esta_disponible',
            'esta_destacado',
            'esta_activo',
            'presentaciones',
            'grupos_variantes',
            'fecha_creacion',
            'fecha_actualizacion',
        ]

    def get_presentaciones(self, objeto):
        presentaciones_activas = objeto.presentaciones.filter(esta_activa=True).order_by('orden', 'id')
        return SerializadorPresentacionProducto(presentaciones_activas, many=True).data

    def get_grupos_variantes(self, objeto):
        grupos_activos = objeto.grupos_variantes.filter(esta_activo=True).order_by('orden', 'id')
        return SerializadorGrupoVariante(grupos_activos, many=True).data


class SerializadorProductoEscritura(serializers.ModelSerializer):
    """
    Serializador para operaciones de creación y actualización en el panel de administración.
    Admite subida de fotografía multipart/form-data y reemplazo seguro.
    """
    archivo_imagen = serializers.ImageField(write_only=True, required=False)
    presentacion_nombre = serializers.CharField(write_only=True, required=False, default="Paquete x 20 unidades")
    presentacion_unidades = serializers.IntegerField(write_only=True, required=False, default=20)
    presentacion_precio = serializers.DecimalField(max_digits=10, decimal_places=2, write_only=True, required=False, allow_null=True)
    presentacion_tipo_precio = serializers.CharField(write_only=True, required=False, default="FIJO")
    presentacion_estado_verificacion = serializers.CharField(write_only=True, required=False, default="PENDIENTE")

    class Meta:
        model = Producto
        fields = [
            'id',
            'categoria',
            'nombre',
            'slug',
            'descripcion',
            'imagen_url',
            'imagen_id_publico',
            'esta_disponible',
            'esta_destacado',
            'esta_activo',
            'archivo_imagen',
            'presentacion_nombre',
            'presentacion_unidades',
            'presentacion_precio',
            'presentacion_tipo_precio',
            'presentacion_estado_verificacion',
        ]
        read_only_fields = ['id', 'slug', 'imagen_url', 'imagen_id_publico']

    def create(self, validated_data):
        archivo_imagen = validated_data.pop('archivo_imagen', None)
        pres_nombre = validated_data.pop('presentacion_nombre', 'Paquete x 20 unidades')
        pres_unidades = validated_data.pop('presentacion_unidades', 20)
        pres_precio = validated_data.pop('presentacion_precio', None)
        pres_tipo = validated_data.pop('presentacion_tipo_precio', 'FIJO')
        pres_estado = validated_data.pop('presentacion_estado_verificacion', 'PENDIENTE')

        if archivo_imagen:
            url, id_pub = subir_imagen_producto(archivo_imagen)
            validated_data['imagen_url'] = url
            validated_data['imagen_id_publico'] = id_pub

        producto = super().create(validated_data)

        # Crear presentación inicial por defecto
        PresentacionProducto.objects.create(
            producto=producto,
            nombre=pres_nombre or 'Paquete x 20 unidades',
            cantidad_unidades=pres_unidades or 20,
            precio=pres_precio,
            tipo_precio=pres_tipo or 'FIJO',
            estado_verificacion_precio=pres_estado or 'PENDIENTE',
            es_predeterminada=True,
            esta_activa=True
        )

        return producto

    def update(self, instance, validated_data):
        archivo_imagen = validated_data.pop('archivo_imagen', None)
        pres_nombre = validated_data.pop('presentacion_nombre', None)
        pres_unidades = validated_data.pop('presentacion_unidades', None)
        pres_precio = validated_data.pop('presentacion_precio', None)
        pres_tipo = validated_data.pop('presentacion_tipo_precio', None)
        pres_estado = validated_data.pop('presentacion_estado_verificacion', None)

        if archivo_imagen:
            id_publico_antiguo = instance.imagen_id_publico
            url, id_pub = subir_imagen_producto(archivo_imagen)
            validated_data['imagen_url'] = url
            validated_data['imagen_id_publico'] = id_pub
            if id_publico_antiguo:
                programar_eliminacion_post_commit(id_publico_antiguo)

        producto = super().update(instance, validated_data)

        # Si se enviaron datos de presentación y existe una predeterminada, actualizarla
        if any([pres_nombre, pres_unidades, pres_precio is not None, pres_tipo, pres_estado]):
            pres = producto.presentaciones.filter(es_predeterminada=True).first() or producto.presentaciones.first()
            if pres:
                if pres_nombre: pres.nombre = pres_nombre
                if pres_unidades is not None: pres.cantidad_unidades = pres_unidades
                if pres_precio is not None: pres.precio = pres_precio
                if pres_tipo: pres.tipo_precio = pres_tipo
                if pres_estado: pres.estado_verificacion_precio = pres_estado
                pres.save()

        return producto

