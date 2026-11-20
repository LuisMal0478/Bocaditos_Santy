"""Pruebas unitarias para la aplicación categorías."""
from django.test import TestCase
from aplicaciones.categorias.models import Categoria

class PruebasCategoria(TestCase):
    def test_creacion_categoria_y_slug(self):
        categoria = Categoria.objects.create(nombre="Bocaditos Dulces", orden=2)
        self.assertEqual(categoria.nombre, "Bocaditos Dulces")
        self.assertEqual(categoria.slug, "bocaditos-dulces")
        self.assertTrue(categoria.esta_activa)

