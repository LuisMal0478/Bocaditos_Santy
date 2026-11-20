"""Pruebas para autenticación y usuarios."""
from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status

class PruebasAutenticacion(TestCase):
    def setUp(self):
        self.cliente = APIClient()
        self.usuario_admin = User.objects.create_user(
            username='admin_test',
            password='Password123!',
            email='admin@test.com',
            is_staff=True
        )

    def test_inicio_sesion_exitoso(self):
        respuesta = self.cliente.post(
            '/api/usuarios/iniciar-sesion/',
            {
                'username': 'admin_test',
                'password': 'Password123!'
            },
            format='json'
        )
        self.assertEqual(respuesta.status_code, status.HTTP_200_OK)
        self.assertIn('access', respuesta.data)
        self.assertIn('refresh', respuesta.data)
        self.assertIn('usuario', respuesta.data)
        self.assertEqual(respuesta.data['usuario']['username'], 'admin_test')

    def test_inicio_sesion_credenciales_invalidas(self):
        respuesta = self.cliente.post(
            '/api/usuarios/iniciar-sesion/',
            {
                'username': 'admin_test',
                'password': 'ClaveErronea'
            },
            format='json'
        )
        self.assertEqual(respuesta.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(respuesta.data['estado'], 'error')
        self.assertEqual(respuesta.data['codigo_error'], 'NO_AUTORIZADO')

