"""Pruebas unitarias para la aplicación negocio."""
from django.test import TestCase
from aplicaciones.negocio.models import ConfiguracionNegocio

class PruebasConfiguracionNegocio(TestCase):
    def test_obtener_configuracion_singleton(self):
        config1 = ConfiguracionNegocio.obtener_configuracion()
        self.assertEqual(config1.nombre_negocio, "Bocaditos Santy")
        self.assertEqual(config1.eslogan, "Momentos felices")
        
        # Debe retornar la misma instancia
        config2 = ConfiguracionNegocio.obtener_configuracion()
        self.assertEqual(config1.pk, config2.pk)

