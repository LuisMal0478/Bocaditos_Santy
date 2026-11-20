"""Pruebas unitarias y de integración para productos y catálogo."""
from decimal import Decimal
from django.test import TestCase
from django.core.exceptions import ValidationError
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

class PruebasProductoYPresentaciones(TestCase):
    def setUp(self):
        self.cliente = APIClient()
        self.categoria = Categoria.objects.create(nombre="Bocaditos Salados", slug="bocaditos-salados")
        self.usuario_admin = User.objects.create_user(
            username='admin_prod',
            password='Password123!',
            is_staff=True
        )

    def test_creacion_producto_y_borrado_logico(self):
        producto = Producto.objects.create(
            categoria=self.categoria,
            nombre="Mini Hamburguesas",
            descripcion="Carne artesanal y pan brioche"
        )
        self.assertEqual(producto.slug, "mini-hamburguesas")
        self.assertTrue(producto.esta_activo)
        self.assertIn(producto, Producto.activos.all())

        # Desactivación lógica
        producto.desactivar()
        self.assertFalse(producto.esta_activo)
        self.assertIsNotNone(producto.fecha_eliminacion)
        self.assertNotIn(producto, Producto.activos.all())
        self.assertIn(producto, Producto.objects.all())

    def test_integridad_precio_presentacion_confirmado(self):
        producto = Producto.objects.create(
            categoria=self.categoria,
            nombre="Mini Sándwich"
        )
        presentacion_invalida = PresentacionProducto(
            producto=producto,
            nombre="Por unidad",
            cantidad_unidades=1,
            precio=Decimal('0.00'),
            tipo_precio='FIJO',
            estado_verificacion_precio='CONFIRMADO'
        )
        with self.assertRaises(ValidationError):
            presentacion_invalida.full_clean()

    def test_api_listado_y_detalle_producto(self):
        producto = Producto.objects.create(
            categoria=self.categoria,
            nombre="Croissant de Pollo",
            slug="croissant-de-pollo"
        )
        PresentacionProducto.objects.create(
            producto=producto,
            nombre="Por unidad",
            cantidad_unidades=1,
            precio=Decimal('2400.00'),
            tipo_precio='FIJO',
            estado_verificacion_precio='PENDIENTE',
            es_predeterminada=True
        )

        # GET /api/productos/
        respuesta_lista = self.cliente.get('/api/productos/')
        self.assertEqual(respuesta_lista.status_code, status.HTTP_200_OK)
        # DRF paginated response
        resultados = respuesta_lista.data.get('results', respuesta_lista.data)
        self.assertTrue(len(resultados) >= 1)

        # GET /api/productos/croissant-de-pollo/
        respuesta_detalle = self.cliente.get('/api/productos/croissant-de-pollo/')
        self.assertEqual(respuesta_detalle.status_code, status.HTTP_200_OK)
        self.assertEqual(respuesta_detalle.data['nombre'], "Croissant de Pollo")
        self.assertEqual(len(respuesta_detalle.data['presentaciones']), 1)

    def test_creacion_producto_requiere_admin(self):
        datos = {
            "categoria": self.categoria.id,
            "nombre": "Nuevo Bocadito",
            "descripcion": "Descripción de prueba"
        }
        # Petición anónima rechazada
        respuesta_anon = self.cliente.post('/api/productos/', datos)
        self.assertEqual(respuesta_anon.status_code, status.HTTP_401_UNAUTHORIZED)

        # Petición autenticada como staff aceptada
        self.cliente.force_authenticate(user=self.usuario_admin)
        respuesta_admin = self.cliente.post('/api/productos/', datos)
        self.assertEqual(respuesta_admin.status_code, status.HTTP_201_CREATED)
