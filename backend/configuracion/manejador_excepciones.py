"""Manejador centralizado de excepciones en español para Django REST Framework."""
import logging
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

registro = logging.getLogger('bocaditos_santy')

def manejador_excepciones_personalizado(excepcion, contexto):
    """
    Transforma todas las respuestas de error de la API en un formato
    estandarizado en español con código, mensaje amigable y detalles.
    """
    respuesta = exception_handler(excepcion, contexto)

    if respuesta is not None:
        codigo_estado = respuesta.status_code
        codigo_error = "ERROR_PETICION"
        mensaje = "Ocurrió un error al procesar la solicitud."

        if codigo_estado == status.HTTP_400_BAD_REQUEST:
            codigo_error = "DATOS_INVALIDOS"
            mensaje = "Los datos enviados no son válidos o están incompletos."
        elif codigo_estado == status.HTTP_401_UNAUTHORIZED:
            codigo_error = "NO_AUTORIZADO"
            mensaje = "No tiene autorización para acceder a este recurso. Inicie sesión nuevamente."
        elif codigo_estado == status.HTTP_403_FORBIDDEN:
            codigo_error = "ACCESO_DENEGADO"
            mensaje = "No cuenta con los permisos necesarios para realizar esta acción."
        elif codigo_estado == status.HTTP_404_NOT_FOUND:
            codigo_error = "NO_ENCONTRADO"
            mensaje = "El recurso solicitado no fue encontrado."
        elif codigo_estado == status.HTTP_429_TOO_MANY_REQUESTS:
            codigo_error = "LIMITE_EXCEDIDO"
            mensaje = "Ha realizado demasiadas solicitudes en poco tiempo. Por favor espere unos momentos."

        respuesta.data = {
            "estado": "error",
            "codigo_error": codigo_error,
            "mensaje": mensaje,
            "detalles": respuesta.data
        }
    else:
        # Errores 500 no capturados por DRF
        registro.error(f"Error no controlado en el servidor: {str(excepcion)}", exc_info=True)
        respuesta = Response(
            {
                "estado": "error",
                "codigo_error": "ERROR_SERVIDOR",
                "mensaje": "Ocurrió un error interno en el servidor. Por favor intente más tarde.",
                "detalles": str(excepcion) if getattr(contexto.get('request', None), 'user', None) and contexto['request'].user.is_superuser else None
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    return respuesta

