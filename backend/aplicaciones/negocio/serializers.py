"""Serializadores para la configuración del negocio."""
from rest_framework import serializers
from aplicaciones.productos.servicios_cloudinary import subir_imagen_producto, eliminar_imagen_segura
from .models import ConfiguracionNegocio

class SerializadorConfiguracionNegocio(serializers.ModelSerializer):
    """Serializador para consulta pública y actualización administrativa."""
    archivo_logo = serializers.ImageField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = ConfiguracionNegocio
        fields = [
            'id',
            'nombre_negocio',
            'eslogan',
            'logo_url',
            'logo_id_publico',
            'archivo_logo',
            'numero_whatsapp',
            'mensaje_bienvenida_whatsapp',
            'instagram',
            'facebook',
            'email_contacto',
            'descripcion_negocio',
            'informacion_contacto',
            'zona_cobertura',
            'color_principal',
            'color_secundario',
            'color_acento',
            'color_fondo',
            'color_texto',
            'fuente_titulos',
            'fuente_cuerpo',
            'titulo_hero',
            'subtitulo_hero',
            'texto_boton_hero',
            'mensaje_anuncio',
            'mostrar_anuncio',
            'fecha_actualizacion',
        ]
        read_only_fields = ['id', 'fecha_actualizacion']

    def update(self, instance, validated_data):
        archivo_logo = validated_data.pop('archivo_logo', None)
        if archivo_logo:
            if instance.logo_id_publico:
                try:
                    eliminar_imagen_segura(instance.logo_id_publico)
                except Exception:
                    pass
            url, public_id = subir_imagen_producto(archivo_logo, carpeta='bocaditos_santy/logo')
            instance.logo_url = url
            instance.logo_id_publico = public_id

        return super().update(instance, validated_data)

