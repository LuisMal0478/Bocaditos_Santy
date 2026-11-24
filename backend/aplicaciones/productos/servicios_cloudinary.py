"""Servicio de gestión de imágenes y almacenamiento en Cloudinary con respaldo local."""
import os
import uuid
import logging
from django.conf import settings
from django.db import transaction
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

registro = logging.getLogger('bocaditos_santy')

def subir_imagen_producto(archivo_imagen, carpeta='bocaditos_santy/productos'):
    """
    Sube una imagen a Cloudinary (o almacenamiento local de respaldo en desarrollo)
    y retorna una tupla (url_segura, id_publico).
    """
    # Si Cloudinary está configurado
    if getattr(settings, 'CLOUDINARY_CLOUD_NAME', None):
        import cloudinary
        import cloudinary.uploader
        try:
            nombre_unico = f"img_{uuid.uuid4().hex[:12]}"
            resultado = cloudinary.uploader.upload(
                archivo_imagen,
                folder=carpeta,
                public_id=nombre_unico,
                resource_type='image',
                transformation=[
                    {'quality': 'auto:good'},
                    {'fetch_format': 'auto'}
                ]
            )
            return resultado.get('secure_url'), resultado.get('public_id')
        except Exception as error:
            registro.error(f"Error al subir imagen a Cloudinary: {error}", exc_info=True)
            raise RuntimeError(f"No fue posible subir la imagen a Cloudinary: {error}")

    # Modo de respaldo persistente sin Cloudinary:
    # Optimiza y comprime la imagen con Pillow y la almacena como Data URI (Base64)
    # directamente en PostgreSQL para que NUNCA se pierda en contenedores efímeros (como Render/Railway).
    try:
        from PIL import Image
        import io
        import base64

        archivo_imagen.seek(0)
        im = Image.open(archivo_imagen)
        if im.mode in ('RGBA', 'P'):
            im = im.convert('RGB')
        im.thumbnail((800, 800), Image.Resampling.LANCZOS)

        buffer = io.BytesIO()
        im.save(buffer, format='JPEG', quality=80, optimize=True)
        img_bytes = buffer.getvalue()
        b64_str = base64.b64encode(img_bytes).decode('utf-8')
        data_uri = f"data:image/jpeg;base64,{b64_str}"

        # Guardar también archivo local si el almacenamiento lo permite
        extension = os.path.splitext(archivo_imagen.name)[1].lower() or '.jpg'
        nombre_archivo = f"{carpeta.replace('/', '_')}_{uuid.uuid4().hex[:10]}{extension}"
        try:
            default_storage.save(nombre_archivo, ContentFile(img_bytes))
        except Exception:
            pass

        return data_uri, f"b64_{uuid.uuid4().hex[:12]}"
    except Exception as error_pillow:
        registro.warning(f"No se pudo generar Data URI con Pillow, usando almacenamiento local estándar: {error_pillow}")
        archivo_imagen.seek(0)
        extension = os.path.splitext(archivo_imagen.name)[1].lower() or '.jpg'
        nombre_archivo = f"{carpeta.replace('/', '_')}_{uuid.uuid4().hex[:10]}{extension}"
        ruta_guardada = default_storage.save(nombre_archivo, ContentFile(archivo_imagen.read()))
        url_local = default_storage.url(ruta_guardada)
        return url_local, f"local_{nombre_archivo}"


def eliminar_imagen_segura(id_publico):
    """
    Elimina una imagen de Cloudinary o del almacenamiento local a partir de su ID público.
    """
    if not id_publico or id_publico.startswith('b64_'):
        return

    if id_publico.startswith('local_'):
        nombre_archivo = id_publico.replace('local_', '', 1)
        if default_storage.exists(nombre_archivo):
            try:
                default_storage.delete(nombre_archivo)
            except Exception as error:
                registro.warning(f"No se pudo eliminar archivo local {nombre_archivo}: {error}")
        return

    if getattr(settings, 'CLOUDINARY_CLOUD_NAME', None):
        import cloudinary
        import cloudinary.uploader
        try:
            cloudinary.uploader.destroy(id_publico, invalidate=True)
            registro.info(f"Imagen Cloudinary destruida con éxito: {id_publico}")
        except Exception as error:
            registro.warning(f"No se pudo eliminar imagen en Cloudinary ({id_publico}): {error}")


def programar_eliminacion_post_commit(id_publico_antiguo):
    """
    Programa la eliminación de una imagen anterior para que se ejecute
    ESTRICTAMENTE después de que la transacción de PostgreSQL haya hecho commit.
    """
    if id_publico_antiguo:
        transaction.on_commit(lambda: eliminar_imagen_segura(id_publico_antiguo))

