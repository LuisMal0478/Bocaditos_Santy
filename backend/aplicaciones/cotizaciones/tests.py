"""Pruebas unitarias y de integración para la aplicación cotizaciones."""
from decimal import Decimal
from django.test import TestCase
from django.utils import timezone
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from aplicaciones.categorias.models import Categoria
from aplicaciones.productos.models import (
    Producto,
    PresentacionProducto,
    GrupoVariante,
    OpcionVariante
)
from aplicaciones.cotizaciones.models import Cotizacion, DetalleCotizacion

class PruebasAPICotizaciones(TestCase):
    def setUp(self):
        self.cliente = APIClient()
        self.categoria = Categoria.objects.create(nombre="Bocaditos", slug="bocaditos")
        self.producto = Producto.objects.create(
            categoria=self.categoria,
            nombre="Brochetas de Pollo",
            slug="brochetas-de-pollo"
        )
        self.presentacion = PresentacionProducto.objects.create(
            producto=self.producto,
            nombre="Paquete x 20 unidades",
            cantidad_unidades=20,
            precio=Decimal('44000.00'),
            tipo_precio='FIJO',
            estado_verificacion_precio='CONFIRMADO',
            es_predeterminada=True
        )
        self.usuario_admin = User.objects.create_user(
            username='admin_cot',
            password='Password123!',
            is_staff=True
        )

    def test_creacion_cotizacion_exitosa_y_persistencia(self):
        fecha_evento = (timezone.now().date() + timezone.timedelta(days=7)).strftime('%Y-%m-%d')
        datos = {
            "nombre_cliente": "Mariana López",
            "telefono_whatsapp": "3123456789",
            "tipo_evento": "Cumpleaños",
            "fecha_evento": fecha_evento,
            "lugar_evento": "Bogotá",
            "cantidad_invitados": 30,
            "observaciones": "Sin picante por favor",
            "acepta_politica_privacidad": True,
            "campo_control_trampa": "",
            "items": [
                {
                    "producto_id": self.producto.id,
                    "presentacion_id": self.presentacion.id,
                    "cantidad": 2,
                    "observaciones": "Bien cocidas"
                }
            ]
        }

        respuesta = self.cliente.post('/api/cotizaciones/', datos, format='json')
        self.assertEqual(respuesta.status_code, status.HTTP_201_CREATED)
        self.assertEqual(respuesta.data['estado'], 'exito')
        
        datos_resp = respuesta.data['datos']
        self.assertIn('url_whatsapp', datos_resp)
        self.assertIn('mensaje_whatsapp', datos_resp)
        self.assertTrue(datos_resp['codigo_seguimiento'].startswith('COT-'))

        # Verificar que se persistió en la base de datos
        cotizacion_bd = Cotizacion.objects.get(id=datos_resp['id'])
        self.assertEqual(cotizacion_bd.nombre_cliente, "Mariana López")
        self.assertEqual(cotizacion_bd.detalles.count(), 1)

        detalle_bd = cotizacion_bd.detalles.first()
        self.assertEqual(detalle_bd.cantidad_presentaciones, 2)
        self.assertEqual(detalle_bd.unidades_por_presentacion, 20)
        self.assertEqual(detalle_bd.total_unidades_calculadas, 40)
        self.assertEqual(detalle_bd.subtotal_estimado_historico, Decimal('88000.00'))

    def test_rechazo_solicitud_trampa_honeypot(self):
        fecha_evento = (timezone.now().date() + timezone.timedelta(days=7)).strftime('%Y-%m-%d')
        datos_bot = {
            "nombre_cliente": "Spam Bot",
            "telefono_whatsapp": "3001234567",
            "tipo_evento": "Spam",
            "fecha_evento": fecha_evento,
            "campo_control_trampa": "Soy un bot automatizado",  # Honeypot lleno
            "items": [
                {
                    "producto_id": self.producto.id,
                    "presentacion_id": self.presentacion.id,
                    "cantidad": 1
                }
            ]
        }

        respuesta = self.cliente.post('/api/cotizaciones/', datos_bot, format='json')
        self.assertEqual(respuesta.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(respuesta.data['estado'], 'error')
        self.assertEqual(respuesta.data['codigo_error'], 'DATOS_INVALIDOS')

    def test_gestion_solicitudes_requiere_autenticacion(self):
        # Cliente anónimo no puede ver listado de cotizaciones
        respuesta_anon = self.cliente.get('/api/cotizaciones/gestion/solicitudes/')
        self.assertEqual(respuesta_anon.status_code, status.HTTP_401_UNAUTHORIZED)

        # Cliente admin sí puede
        self.cliente.force_authenticate(user=self.usuario_admin)
        respuesta_admin = self.cliente.get('/api/cotizaciones/gestion/solicitudes/')
        self.assertEqual(respuesta_admin.status_code, status.HTTP_200_OK)
