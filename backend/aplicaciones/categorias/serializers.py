"""Serializadores para la aplicación categorías."""
from rest_framework import serializers
from .models import Categoria

class SerializadorCategoria(serializers.ModelSerializer):
    """Serializador para consulta y administración de categorías."""
    total_productos = serializers.SerializerMethodField()

    class Meta:
        model = Categoria
        fields = [
            'id',
            'nombre',
            'slug',
            'descripcion',
            'imagen_url',
            'imagen_id_publico',
            'orden',
            'esta_activa',
            'total_productos',
            'fecha_creacion',
            'fecha_actualizacion',
        ]
        read_only_fields = ['id', 'slug', 'fecha_creacion', 'fecha_actualizacion']

    def get_total_productos(self, objeto):
        return objeto.productos.filter(esta_activo=True).count()

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        url = data.get('imagen_url')
        if url and request and not url.startswith(('http://', 'https://', 'data:image/')):
            if not url.startswith('/media/productos/'):
                data['imagen_url'] = request.build_absolute_uri(url)
        return data

