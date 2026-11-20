"""
Script de inicialización de datos para el catálogo de Bocaditos Santy.
Carga las 5 categorías oficiales, productos con fotografías reales extraídas del PDF,
presentaciones con estado de verificación 'PENDIENTE', grupos de variantes y usuario administrador.
"""
import os
import sys
from decimal import Decimal
from pathlib import Path

# Configurar entorno de Django
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'configuracion.settings')

import django
django.setup()

from django.contrib.auth.models import User
from aplicaciones.negocio.models import ConfiguracionNegocio
from aplicaciones.categorias.models import Categoria
from aplicaciones.productos.models import (
    Producto,
    PresentacionProducto,
    GrupoVariante,
    OpcionVariante
)

def ejecutar_semilla():
    print("==================================================")
    print(" CARGANDO DATOS INICIALES DEL CATÁLOGO")
    print("==================================================")

    # 1. Crear usuario administrador por defecto si no existe
    usuario_admin, creado = User.objects.get_or_create(
        username='admin',
        defaults={
            'email': 'admin@bocaditossanty.com',
            'first_name': 'Administradora',
            'last_name': 'Bocaditos Santy',
            'is_staff': True,
            'is_superuser': True
        }
    )
    if creado:
        usuario_admin.set_password('BocaditosSanty2026!')
        usuario_admin.save()
        print("[OK] Usuario administrador creado: admin / BocaditosSanty2026!")
    else:
        print("[INFO] Usuario administrador ya existía.")

    # 2. Configuración institucional del negocio
    configuracion = ConfiguracionNegocio.obtener_configuracion()
    configuracion.nombre_negocio = "Bocaditos Santy"
    configuracion.eslogan = "Momentos felices"
    configuracion.numero_whatsapp = "+573000000000"
    configuracion.instagram = "@bocaditossanty"
    configuracion.descripcion_negocio = (
        "En Bocaditos Santy hacemos de cada celebración un momento especial con "
        "deliciosos pasabocas preparados con amor y dedicación para todo tipo de eventos."
    )
    configuracion.zona_cobertura = "Servicio y entregas en la ciudad y zona metropolitana bajo confirmación previa."
    configuracion.save()
    print(f"[OK] Configuración del negocio establecida: {configuracion}")

    # 3. Categorías oficiales
    datos_categorias = [
        {
            'nombre': "Bocaditos",
            'slug': "bocaditos",
            'descripcion': "Nuestra selección clásica de pasabocas tradicionales preparados para compartir.",
            'orden': 1,
            'imagen_url': "/media/productos/pag_1_img_2_X11.jpg"
        },
        {
            'nombre': "Bocaditos salados",
            'slug': "bocaditos-salados",
            'descripcion': "Variedad de pasabocas salados, empanadas, burritos, mini pechuguitas y combinaciones especiales.",
            'orden': 2,
            'imagen_url': "/media/productos/pag_2_img_6_X10.jpg"
        },
        {
            'nombre': "Bocaditos dulces",
            'slug': "bocaditos-dulces",
            'descripcion': "Mini tortas, cupcakes, trufas, alfajores, cheesecakes y vasitos de postre para endulzar tus momentos felices.",
            'orden': 3,
            'imagen_url': "/media/productos/pag_3_img_1_X4.jpg"
        },
        {
            'nombre': "Bebidas",
            'slug': "bebidas",
            'descripcion': "Sodas italianas refrescantes, jugos naturales y cócteles para acompañar tus celebraciones.",
            'orden': 4,
            'imagen_url': "/media/productos/pag_6_img_3_X7.png"
        },
        {
            'nombre': "Servicios para eventos",
            'slug': "servicios-para-eventos",
            'descripcion': "Montaje de mesas de pasabocas sencillas y con accesorios de lujo, y estaciones de café.",
            'orden': 5,
            'imagen_url': "/media/productos/pag_7_img_2_X6.png"
        },
    ]

    mapa_categorias = {}
    for cat_dict in datos_categorias:
        categoria, _ = Categoria.objects.update_or_create(
            slug=cat_dict['slug'],
            defaults=cat_dict
        )
        mapa_categorias[cat_dict['slug']] = categoria
        print(f"[OK] Categoría guardada: {categoria.nombre}")

    # 4. Catálogo de productos detallado
    catalogo = [
        # --- PÁGINA 1: BOCADITOS ---
        {
            'categoria': 'bocaditos',
            'nombre': 'Brochetas de pollo',
            'descripcion': 'Deliciosas brochetas de pollo sazonadas, ideales para pasabocas de eventos.',
            'imagen_url': '/media/productos/pag_1_img_4_X21.jpg',
            'destacado': True,
            'presentaciones': [
                {'nombre': 'Paquete x 20 unidades', 'unidades': 20, 'precio': Decimal('44000.00'), 'predeterminada': True}
            ]
        },
        {
            'categoria': 'bocaditos',
            'nombre': 'Brochetas de camarones',
            'descripcion': 'Brochetas de camarón fresco preparadas al punto para celebraciones especiales.',
            'imagen_url': '/media/productos/pag_1_img_3_X19.jpg',
            'destacado': False,
            'presentaciones': [
                {'nombre': 'Paquete x 20 unidades', 'unidades': 20, 'precio': Decimal('76000.00'), 'predeterminada': True}
            ]
        },
        {
            'categoria': 'bocaditos',
            'nombre': 'Brochetas de frutas',
            'descripcion': 'Colorida y fresca combinación de frutas de temporada en brocheta.',
            'imagen_url': '/media/productos/pag_1_img_2_X11.jpg',
            'destacado': False,
            'presentaciones': [
                {'nombre': 'Paquete x 20 unidades', 'unidades': 20, 'precio': Decimal('56000.00'), 'predeterminada': True}
            ]
        },
        {
            'categoria': 'bocaditos',
            'nombre': 'Brochetas de camarones hawaianos',
            'descripcion': 'Camarones con piña dorada en brocheta agridulce.',
            'imagen_url': '/media/productos/pag_1_img_5_X23.jpg',
            'destacado': False,
            'presentaciones': [
                {'nombre': 'Paquete x 20 unidades', 'unidades': 20, 'precio': Decimal('50000.00'), 'predeterminada': True}
            ]
        },
        {
            'categoria': 'bocaditos',
            'nombre': 'Brochetas de queso con tomate cherry',
            'descripcion': 'Clásica brocheta fresca de dados de queso y tomates cherry maduros.',
            'imagen_url': '/media/productos/pag_1_img_6_X25.jpg',
            'destacado': False,
            'presentaciones': [
                {'nombre': 'Paquete x 20 unidades', 'unidades': 20, 'precio': Decimal('40000.00'), 'predeterminada': True}
            ]
        },
        {
            'categoria': 'bocaditos',
            'nombre': 'Bolitas de carne',
            'descripcion': 'Albondiguitas de carne sazonadas, crujientes por fuera y jugosas por dentro.',
            'imagen_url': '/media/productos/pag_1_img_7_X27.jpg',
            'destacado': False,
            'presentaciones': [
                {'nombre': 'Paquete x 20 unidades', 'unidades': 20, 'precio': Decimal('37000.00'), 'predeterminada': True}
            ]
        },
        {
            'categoria': 'bocaditos',
            'nombre': 'Bolitas de pollo',
            'descripcion': 'Suaves y crocantes bolitas preparadas a base de pollo sazonado.',
            'imagen_url': '/media/productos/pag_1_img_8_X29.jpg',
            'destacado': False,
            'presentaciones': [
                {'nombre': 'Paquete x 20 unidades', 'unidades': 20, 'precio': Decimal('34000.00'), 'predeterminada': True}
            ]
        },
        {
            'categoria': 'bocaditos',
            'nombre': 'Mini sándwich',
            'descripcion': 'Sándwiches en tamaño pasaboca con jamón, queso y aderezos especiales.',
            'imagen_url': '/media/productos/pag_1_img_9_X32.jpg',
            'destacado': False,
            'presentaciones': [
                {'nombre': 'Paquete x 20 unidades', 'unidades': 20, 'precio': Decimal('42000.00'), 'predeterminada': True}
            ]
        },
        {
            'categoria': 'bocaditos',
            'nombre': 'Mini croissant relleno de pollo',
            'descripcion': 'Croissants hojaldrados rellenos de pechuga de pollo desmechada con salsa de la casa.',
            'imagen_url': '/media/productos/pag_1_img_10_X34.jpg',
            'destacado': True,
            'presentaciones': [
                {'nombre': 'Por unidad', 'unidades': 1, 'precio': Decimal('2400.00'), 'predeterminada': True},
                {'nombre': 'Bandeja x 20 unidades', 'unidades': 20, 'precio': Decimal('48000.00'), 'predeterminada': False}
            ]
        },
        {
            'categoria': 'bocaditos',
            'nombre': 'Mini hamburguesas',
            'descripcion': 'Mini hamburguesas gourmet con carne sazonada, queso y vegetales frescos.',
            'imagen_url': '/media/productos/pag_1_img_11_X36.jpg',
            'destacado': True,
            'presentaciones': [
                {'nombre': 'Por unidad', 'unidades': 1, 'precio': Decimal('2800.00'), 'predeterminada': True},
                {'nombre': 'Bandeja x 20 unidades', 'unidades': 20, 'precio': Decimal('56000.00'), 'predeterminada': False}
            ]
        },
        {
            'categoria': 'bocaditos',
            'nombre': 'Canastas de carne hechas de tortillas',
            'descripcion': 'Canastitas crujientes de tortilla rellenas de carne desmechada sazonada.',
            'imagen_url': '/media/productos/pag_1_img_12_X38.jpg',
            'destacado': False,
            'presentaciones': [
                {'nombre': 'Paquete x 20 unidades', 'unidades': 20, 'precio': Decimal('49000.00'), 'predeterminada': True}
            ]
        },
        {
            'categoria': 'bocaditos',
            'nombre': 'Mini perros calientes',
            'descripcion': 'Mini perros calientes con salchicha seleccionada y salsas.',
            'imagen_url': '/media/productos/pag_1_img_13_X40.jpg',
            'destacado': False,
            'presentaciones': [
                {'nombre': 'Paquete x 20 unidades', 'unidades': 20, 'precio': Decimal('40000.00'), 'predeterminada': True}
            ]
        },
        {
            'categoria': 'bocaditos',
            'nombre': 'Canastas de plátano con camarones y guacamole',
            'descripcion': 'Tostones en forma de canastilla con camarones y toque de guacamole fresco.',
            'imagen_url': '/media/productos/pag_1_img_14_X42.jpg',
            'destacado': True,
            'presentaciones': [
                {'nombre': 'Paquete x 20 unidades', 'unidades': 20, 'precio': Decimal('64000.00'), 'predeterminada': True}
            ]
        },
        {
            'categoria': 'bocaditos',
            'nombre': 'Canastas de plátano con pollo',
            'descripcion': 'Canastas crocantes de plátano verde rellenas de pollo desmechado.',
            'imagen_url': '/media/productos/pag_1_img_15_X44.jpg',
            'destacado': False,
            'presentaciones': [
                {'nombre': 'Paquete x 20 unidades', 'unidades': 20, 'precio': Decimal('44000.00'), 'predeterminada': True}
            ]
        },

        # --- PÁGINA 2: BOCADITOS SALADOS Y COMBOS ---
        {
            'categoria': 'bocaditos-salados',
            'nombre': 'Mini burritos',
            'descripcion': 'Tortillas de harina envueltas con relleno sazonado en presentación mini.',
            'imagen_url': '/media/productos/pag_2_img_1_X4.jpg',
            'destacado': False,
            'presentaciones': [
                {'nombre': 'Paquete x 20 unidades', 'unidades': 20, 'precio': Decimal('43000.00'), 'predeterminada': True}
            ]
        },
        {
            'categoria': 'bocaditos-salados',
            'nombre': 'Rollitos de jamón con queso',
            'descripcion': 'Rollitos finamente preparados con jamón seleccionado y queso fundente.',
            'imagen_url': '/media/productos/pag_2_img_2_X6.jpg',
            'destacado': False,
            'presentaciones': [
                {'nombre': 'Paquete x 20 unidades', 'unidades': 20, 'precio': Decimal('36000.00'), 'predeterminada': True}
            ]
        },
        {
            'categoria': 'bocaditos-salados',
            'nombre': 'Vasitos de charcutería',
            'descripcion': 'Elegantes vasitos individuales con quesos, carnes frías y frutos secos.',
            'imagen_url': '/media/productos/pag_2_img_3_X7.jpg',
            'destacado': True,
            'presentaciones': [
                {'nombre': 'Paquete x 20 unidades', 'unidades': 20, 'precio': Decimal('68000.00'), 'predeterminada': True}
            ]
        },
        {
            'categoria': 'bocaditos-salados',
            'nombre': 'Montaditos',
            'descripcion': 'Bocados sobre pan tostado con variedad de aderezos y jamones.',
            'imagen_url': '/media/productos/pag_2_img_4_X8.jpg',
            'destacado': False,
            'presentaciones': [
                {'nombre': 'Paquete x 20 unidades', 'unidades': 20, 'precio': Decimal('46000.00'), 'predeterminada': True}
            ]
        },
        {
            'categoria': 'bocaditos-salados',
            'nombre': 'Causa limeña',
            'descripcion': 'Bocaditos de puré de papa sazonado con ají amarillo y relleno de pollo.',
            'imagen_url': '/media/productos/pag_2_img_5_X9.jpg',
            'destacado': False,
            'presentaciones': [
                {'nombre': 'Paquete x 20 unidades', 'unidades': 20, 'precio': Decimal('74000.00'), 'predeterminada': True}
            ]
        },
        {
            'categoria': 'bocaditos-salados',
            'nombre': 'Empanaditas de cóctel',
            'descripcion': 'Empanadas tradicionales colombianas de maíz, crujientes y con diversos rellenos.',
            'imagen_url': '/media/productos/pag_2_img_6_X10.jpg',
            'destacado': True,
            'grupos_variantes': [
                {
                    'nombre': 'Sabor de relleno',
                    'es_obligatorio': True,
                    'opciones': ['Pollo', 'Carne', 'Queso y maíz', 'Hawaiana']
                }
            ],
            'presentaciones': [
                {'nombre': 'Paquete x 20 unidades', 'unidades': 20, 'precio': Decimal('19000.00'), 'predeterminada': True}
            ]
        },
        {
            'categoria': 'bocaditos-salados',
            'nombre': 'Dedos de queso y jamón horneados',
            'descripcion': 'Deditos de masa suave horneados con relleno de queso y jamón.',
            'imagen_url': '/media/productos/pag_2_img_7_X11.jpg',
            'destacado': False,
            'presentaciones': [
                {'nombre': 'Paquete x 20 unidades', 'unidades': 20, 'precio': Decimal('19000.00'), 'predeterminada': True}
            ]
        },
        {
            'categoria': 'bocaditos-salados',
            'nombre': 'Medallones de salchichas',
            'descripcion': 'Bocadillos en hojaldre o masa rellenos de salchicha especial.',
            'imagen_url': '/media/productos/pag_2_img_8_X12.jpg',
            'destacado': False,
            'presentaciones': [
                {'nombre': 'Paquete x 20 unidades', 'unidades': 20, 'precio': Decimal('18900.00'), 'predeterminada': True}
            ]
        },
        {
            'categoria': 'bocaditos-salados',
            'nombre': 'Combo surtido x 100 unidades',
            'descripcion': 'Gran combo para celebraciones: incluye empanadas hawaianas, bolitas de pollo, mini pinchos de pollo, medallones de salchichas y dedos de queso.',
            'imagen_url': '/media/productos/pag_2_img_9_X13.png',
            'destacado': True,
            'presentaciones': [
                {'nombre': 'Combo especial x 100 unidades', 'unidades': 100, 'precio': Decimal('88000.00'), 'predeterminada': True}
            ]
        },

        # --- PÁGINA 5: BOCADITOS SALADOS ESPECIALES ---
        {
            'categoria': 'bocaditos-salados',
            'nombre': 'Mini rollitos de carne en salsa de ciruelas',
            'descripcion': 'Rollitos de carne rellenos de jamón y queso bañados en una suave salsa dulce de ciruelas.',
            'imagen_url': '/media/productos/pag_5_img_1_X4.png',
            'destacado': True,
            'presentaciones': [
                {'nombre': 'Paquete x 20 unidades', 'unidades': 20, 'precio': Decimal('51000.00'), 'predeterminada': True}
            ]
        },
        {
            'categoria': 'bocaditos-salados',
            'nombre': 'Mini pechuguitas gratinadas',
            'descripcion': 'Bocaditos de pechuga de pollo cubiertos con queso fundido y gratinado al horno.',
            'imagen_url': '/media/productos/pag_5_img_2_X6.png',
            'destacado': False,
            'presentaciones': [
                {'nombre': 'Paquete x 20 unidades', 'unidades': 20, 'precio': Decimal('76000.00'), 'predeterminada': True}
            ]
        },
        {
            'categoria': 'bocaditos-salados',
            'nombre': 'Champiñones rellenos',
            'descripcion': 'Champiñones horneados rellenos de queso y finas hierbas.',
            'imagen_url': '/media/productos/pag_5_img_3_X7.png',
            'destacado': False,
            'presentaciones': [
                {'nombre': 'Paquete x 20 unidades', 'unidades': 20, 'precio': Decimal('70000.00'), 'predeterminada': True}
            ]
        },
        {
            'categoria': 'bocaditos-salados',
            'nombre': 'Canastas de pan tostado con dip de pollo y piña',
            'descripcion': 'Crujientes canastas tostadas rellenas de dip agridulce de pollo y piña.',
            'imagen_url': '/media/productos/pag_5_img_4_X8.png',
            'destacado': False,
            'presentaciones': [
                {'nombre': 'Paquete x 20 unidades', 'unidades': 20, 'precio': Decimal('58000.00'), 'predeterminada': True}
            ]
        },
        {
            'categoria': 'bocaditos-salados',
            'nombre': 'Bombones de pollo en salsa de yogur griego',
            'descripcion': 'Bocados de pollo dorado acompañados de cremosa salsa a base de yogur griego y especias.',
            'imagen_url': '/media/productos/pag_5_img_5_X9.png',
            'destacado': False,
            'presentaciones': [
                {'nombre': 'Por unidad', 'unidades': 1, 'precio': Decimal('4200.00'), 'predeterminada': True}
            ]
        },
        {
            'categoria': 'bocaditos-salados',
            'nombre': 'Brochetas de queso búfalo con tomate cherry',
            'descripcion': 'Elegante brocheta con queso de búfala, tomate cherry y reducción balsámica.',
            'imagen_url': '/media/productos/pag_5_img_6_X10.png',
            'destacado': False,
            'presentaciones': [
                {'nombre': 'Por unidad', 'unidades': 1, 'precio': Decimal('4800.00'), 'predeterminada': True}
            ]
        },
        {
            'categoria': 'bocaditos-salados',
            'nombre': 'Mini aborrajados en salsa de mora',
            'descripcion': 'Clásicos bocaditos de plátano maduro con queso costeño acompañados de salsa de mora.',
            'imagen_url': '/media/productos/pag_5_img_7_X11.png',
            'destacado': True,
            'presentaciones': [
                {'nombre': 'Paquete x 20 unidades', 'unidades': 20, 'precio': Decimal('62000.00'), 'predeterminada': True}
            ]
        },

        # --- PÁGINA 3 Y 4: BOCADITOS DULCES ---
        {
            'categoria': 'bocaditos-dulces',
            'nombre': 'Mini torta red velvet',
            'descripcion': 'Suave bizcocho aterciopelado de red velvet con crema frosting.',
            'imagen_url': '/media/productos/pag_3_img_1_X4.jpg',
            'destacado': True,
            'presentaciones': [
                {'nombre': 'Por unidad', 'unidades': 1, 'precio': Decimal('5100.00'), 'predeterminada': True}
            ]
        },
        {
            'categoria': 'bocaditos-dulces',
            'nombre': 'Mini torta de vainilla',
            'descripcion': 'Esponjosa torta individual con sabor a vainilla tradicional.',
            'imagen_url': '/media/productos/pag_3_img_2_X6.jpg',
            'destacado': False,
            'presentaciones': [
                {'nombre': 'Por unidad', 'unidades': 1, 'precio': Decimal('4200.00'), 'predeterminada': True}
            ]
        },
        {
            'categoria': 'bocaditos-dulces',
            'nombre': 'Cupcakes decorados',
            'descripcion': 'Cupcakes individuales decorados con betún suave para celebraciones.',
            'imagen_url': '/media/productos/pag_3_img_3_X7.jpg',
            'destacado': True,
            'presentaciones': [
                {'nombre': 'Por unidad', 'unidades': 1, 'precio': Decimal('2600.00'), 'predeterminada': True}
            ]
        },
        {
            'categoria': 'bocaditos-dulces',
            'nombre': 'Mini torta de chocolate',
            'descripcion': 'Torta húmeda de chocolate con cobertura cremosa.',
            'imagen_url': '/media/productos/pag_3_img_4_X8.jpg',
            'destacado': False,
            'presentaciones': [
                {'nombre': 'Por unidad', 'unidades': 1, 'precio': Decimal('2800.00'), 'predeterminada': True}
            ]
        },
        {
            'categoria': 'bocaditos-dulces',
            'nombre': 'Shots de frutas',
            'descripcion': 'Refrescantes vasitos con selección picada de frutas.',
            'imagen_url': '/media/productos/pag_3_img_5_X9.jpg',
            'destacado': False,
            'presentaciones': [
                {'nombre': 'Por unidad', 'unidades': 1, 'precio': Decimal('2800.00'), 'predeterminada': True}
            ]
        },
        {
            'categoria': 'bocaditos-dulces',
            'nombre': 'Trufas de chocolate',
            'descripcion': 'Exquisitas trufas artesanales de cacao con diversas coberturas.',
            'imagen_url': '/media/productos/pag_3_img_6_X10.jpg',
            'destacado': True,
            'presentaciones': [
                {'nombre': 'Paquete x 20 unidades', 'unidades': 20, 'precio': Decimal('39000.00'), 'predeterminada': True}
            ]
        },
        {
            'categoria': 'bocaditos-dulces',
            'nombre': 'Cake pops',
            'descripcion': 'Bolitas de bizcocho cubiertas de chocolate en paleta.',
            'imagen_url': '/media/productos/pag_3_img_7_X11.jpg',
            'destacado': False,
            'presentaciones': [
                {'nombre': 'Paquete x 20 unidades', 'unidades': 20, 'precio': Decimal('46000.00'), 'predeterminada': True}
            ]
        },
        {
            'categoria': 'bocaditos-dulces',
            'nombre': 'Oreo pops',
            'descripcion': 'Galletas Oreo cubiertas con chocolate y detalles decorativos.',
            'imagen_url': '/media/productos/pag_3_img_8_X12.jpg',
            'destacado': False,
            'presentaciones': [
                {'nombre': 'Paquete x 20 unidades', 'unidades': 20, 'precio': Decimal('46000.00'), 'predeterminada': True}
            ]
        },
        {
            'categoria': 'bocaditos-dulces',
            'nombre': 'Mini pancakes',
            'descripcion': 'Torrecitas de mini panquecas servidas para mesas dulces.',
            'imagen_url': '/media/productos/pag_3_img_9_X13.jpg',
            'destacado': False,
            'presentaciones': [
                {'nombre': 'Paquete x 20 unidades', 'unidades': 20, 'precio': Decimal('46000.00'), 'predeterminada': True}
            ]
        },
        {
            'categoria': 'bocaditos-dulces',
            'nombre': 'Mendigos de chocolates',
            'descripcion': 'Discos de chocolate coronados con frutos secos variados.',
            'imagen_url': '/media/productos/pag_3_img_10_X14.jpg',
            'destacado': False,
            'presentaciones': [
                {'nombre': 'Paquete x 20 unidades', 'unidades': 20, 'precio': Decimal('48500.00'), 'predeterminada': True}
            ]
        },
        {
            'categoria': 'bocaditos-dulces',
            'nombre': 'Tartaletas de frutas',
            'descripcion': 'Base crujiente de masa rellena de crema pastelera y fruta fresca.',
            'imagen_url': '/media/productos/pag_4_img_1_X4.jpg',
            'destacado': True,
            'presentaciones': [
                {'nombre': 'Paquete x 20 unidades', 'unidades': 20, 'precio': Decimal('42000.00'), 'predeterminada': True}
            ]
        },
        {
            'categoria': 'bocaditos-dulces',
            'nombre': 'Volovanes con crema dulce y arándanos',
            'descripcion': 'Hojaldre volován relleno de crema dulce y arándanos frescos.',
            'imagen_url': '/media/productos/pag_4_img_2_X6.jpg',
            'destacado': False,
            'presentaciones': [
                {'nombre': 'Paquete x 20 unidades', 'unidades': 20, 'precio': Decimal('48000.00'), 'predeterminada': True}
            ]
        },
        {
            'categoria': 'bocaditos-dulces',
            'nombre': 'Cheesecake individual',
            'descripcion': 'Cremoso pastel de queso sobre base crocante con mermelada de fruta.',
            'imagen_url': '/media/productos/pag_4_img_3_X7.jpg',
            'destacado': True,
            'grupos_variantes': [
                {
                    'nombre': 'Sabor de cobertura',
                    'es_obligatorio': True,
                    'opciones': ['Mora', 'Fresa', 'Chocolate']
                }
            ],
            'presentaciones': [
                {'nombre': 'Por unidad', 'unidades': 1, 'precio': Decimal('4800.00'), 'predeterminada': True}
            ]
        },
        {
            'categoria': 'bocaditos-dulces',
            'nombre': 'Bombones de masmelos con chispas de colores',
            'descripcion': 'Masmelos esponjosos decorados con chispas de colores vivos.',
            'imagen_url': '/media/productos/pag_4_img_4_X8.jpg',
            'destacado': False,
            'presentaciones': [
                {'nombre': 'Paquete x 20 unidades', 'unidades': 20, 'precio': Decimal('31000.00'), 'predeterminada': True}
            ]
        },
        {
            'categoria': 'bocaditos-dulces',
            'nombre': 'Masmelos cubiertos de chocolate blanco y arequipe',
            'descripcion': 'Masmelos glaseados con arequipe y chocolate blanco.',
            'imagen_url': '/media/productos/pag_4_img_6_X10.jpg',
            'destacado': False,
            'presentaciones': [
                {'nombre': 'Paquete x 20 unidades', 'unidades': 20, 'precio': Decimal('42000.00'), 'predeterminada': True}
            ]
        },
        {
            'categoria': 'bocaditos-dulces',
            'nombre': 'Alfajores artesanales',
            'descripcion': 'Galletas suaves de maicena rellenas con arequipe y coco rallado.',
            'imagen_url': '/media/productos/pag_4_img_8_X12.jpg',
            'destacado': True,
            'presentaciones': [
                {'nombre': 'Paquete x 20 unidades', 'unidades': 20, 'precio': Decimal('38000.00'), 'predeterminada': True}
            ]
        },
        {
            'categoria': 'bocaditos-dulces',
            'nombre': 'Conos de crispetas',
            'descripcion': 'Conos individuales con crispetas dulces o saladas.',
            'imagen_url': '/media/productos/pag_4_img_9_X13.jpg',
            'destacado': False,
            'presentaciones': [
                {'nombre': 'Por unidad', 'unidades': 1, 'precio': Decimal('2300.00'), 'predeterminada': True}
            ]
        },
        {
            'categoria': 'bocaditos-dulces',
            'nombre': 'Postres en vasito 1.5 oz',
            'descripcion': 'Variedad de vasitos de postre para mesas de dulces en diversas recetas clásicas.',
            'imagen_url': '/media/productos/pag_4_img_10_X14.jpg',
            'destacado': True,
            'grupos_variantes': [
                {
                    'nombre': 'Sabor de postre',
                    'es_obligatorio': True,
                    'opciones': ['Mora', 'Fresa', 'Maracuyá', 'Limón', 'Tres Leches', 'Napoleón']
                }
            ],
            'presentaciones': [
                {'nombre': 'Por vasito individual (1.5 oz)', 'unidades': 1, 'precio': Decimal('2300.00'), 'predeterminada': True}
            ]
        },

        # --- PÁGINA 6: BEBIDAS ---
        {
            'categoria': 'bebidas',
            'nombre': 'Jugos de naranja en envase de vidrio',
            'descripcion': 'Jugo de naranja natural servido en elegante botella de vidrio.',
            'imagen_url': '/media/productos/pag_6_img_1_X4.png',
            'destacado': False,
            'presentaciones': [
                {'nombre': 'Por envase de vidrio', 'unidades': 1, 'precio': Decimal('6000.00'), 'predeterminada': True}
            ]
        },
        {
            'categoria': 'bebidas',
            'nombre': 'Jugos naturales en envase plástico',
            'descripcion': 'Refrescantes jugos de fruta natural en botella individual.',
            'imagen_url': '/media/productos/pag_6_img_2_X6.png',
            'destacado': False,
            'presentaciones': [
                {'nombre': 'Por envase plástico', 'unidades': 1, 'precio': Decimal('2500.00'), 'predeterminada': True}
            ]
        },
        {
            'categoria': 'bebidas',
            'nombre': 'Sodas italianas',
            'descripcion': 'Bebida gasificada artesanal con jarabes frutales refrescantes.',
            'imagen_url': '/media/productos/pag_6_img_3_X7.png',
            'destacado': True,
            'grupos_variantes': [
                {
                    'nombre': 'Sabor de soda',
                    'es_obligatorio': True,
                    'opciones': ['Frutos rojos', 'Limón', 'Frutos amarillos']
                }
            ],
            'presentaciones': [
                {'nombre': 'Por copa / vaso', 'unidades': 1, 'precio': Decimal('7800.00'), 'predeterminada': True}
            ]
        },
        {
            'categoria': 'bebidas',
            'nombre': 'Mimosas',
            'descripcion': 'Cóctel clásico de vino espumoso y jugo de naranja.',
            'imagen_url': '/media/productos/pag_6_img_4_X8.png',
            'destacado': False,
            'presentaciones': [
                {'nombre': 'Por copa', 'unidades': 1, 'precio': Decimal('13000.00'), 'predeterminada': True}
            ]
        },
        {
            'categoria': 'bebidas',
            'nombre': 'Trago de whisky a las rocas',
            'descripcion': 'Servicio de whisky con hielo para eventos.',
            'imagen_url': '/media/productos/pag_6_img_5_X9.png',
            'destacado': False,
            'presentaciones': [
                {'nombre': 'Por trago', 'unidades': 1, 'precio': Decimal('14000.00'), 'predeterminada': True}
            ]
        },
        {
            'categoria': 'bebidas',
            'nombre': 'Mojitos',
            'descripcion': 'Cóctel tradicional con hierbabuena, limón, azúcar y ron.',
            'imagen_url': '/media/productos/pag_6_img_6_X10.png',
            'destacado': False,
            'presentaciones': [
                {'nombre': 'Por vaso', 'unidades': 1, 'precio': Decimal('13000.00'), 'predeterminada': True}
            ]
        },
        {
            'categoria': 'bebidas',
            'nombre': 'Piña colada',
            'descripcion': 'Cóctel cremoso con piña, crema de coco y toque de ron.',
            'imagen_url': '/media/productos/pag_6_img_7_X11.png',
            'destacado': False,
            'presentaciones': [
                {'nombre': 'Por copa', 'unidades': 1, 'precio': Decimal('13800.00'), 'predeterminada': True}
            ]
        },

        # --- PÁGINA 7: SERVICIOS PARA EVENTOS ---
        {
            'categoria': 'servicios-para-eventos',
            'nombre': 'Mesas de pasabocas',
            'descripcion': 'Montaje completo de mesa decorada con variedad de pasabocas dulces y salados para tu evento.',
            'imagen_url': '/media/productos/pag_7_img_2_X6.png',
            'destacado': True,
            'presentaciones': [
                {'nombre': 'Servicio personalizado según evento', 'unidades': 1, 'precio': None, 'tipo_precio': 'A_COTIZAR', 'estado': 'NO_APLICA', 'predeterminada': True}
            ]
        },
        {
            'categoria': 'servicios-para-eventos',
            'nombre': 'Estación de café',
            'descripcion': 'Estación equipada con café caliente, termos, tazas y acompañamientos para reuniones.',
            'imagen_url': '/media/productos/pag_7_img_1_X4.png',
            'destacado': False,
            'presentaciones': [
                {'nombre': 'Estación de café para eventos', 'unidades': 1, 'precio': None, 'tipo_precio': 'A_COTIZAR', 'estado': 'NO_APLICA', 'predeterminada': True}
            ]
        },
        {
            'categoria': 'servicios-para-eventos',
            'nombre': 'Mesa de pasabocas tipo sencilla',
            'descripcion': 'Presentación limpia y atractiva de pasabocas en bandejas para reuniones pequeñas o medianas.',
            'imagen_url': '/media/productos/pag_7_img_3_X7.png',
            'destacado': False,
            'presentaciones': [
                {'nombre': 'Montaje sencillo de pasabocas', 'unidades': 1, 'precio': None, 'tipo_precio': 'A_COTIZAR', 'estado': 'NO_APLICA', 'predeterminada': True}
            ]
        },
        {
            'categoria': 'servicios-para-eventos',
            'nombre': 'Mesas de pasabocas con accesorios de lujo',
            'descripcion': 'Montaje premium con elevadores, vajilla fina, accesorios dorados/plateados y decoración floral.',
            'imagen_url': '/media/productos/pag_7_img_2_X6.png',
            'destacado': True,
            'presentaciones': [
                {'nombre': 'Montaje con accesorios de lujo', 'unidades': 1, 'precio': None, 'tipo_precio': 'A_COTIZAR', 'estado': 'NO_APLICA', 'predeterminada': True}
            ]
        },
    ]

    total_creados = 0
    for prod_dict in catalogo:
        categoria_inst = mapa_categorias[prod_dict['categoria']]
        producto, _ = Producto.objects.update_or_create(
            categoria=categoria_inst,
            nombre=prod_dict['nombre'],
            defaults={
                'descripcion': prod_dict['descripcion'],
                'imagen_url': prod_dict['imagen_url'],
                'esta_destacado': prod_dict.get('destacado', False),
                'esta_disponible': True,
                'esta_activo': True,
            }
        )

        # Crear o actualizar presentaciones
        for pres_dict in prod_dict.get('presentaciones', []):
            tipo_precio = pres_dict.get('tipo_precio', 'FIJO')
            estado_verificacion = pres_dict.get('estado', 'PENDIENTE')
            
            PresentacionProducto.objects.update_or_create(
                producto=producto,
                nombre=pres_dict['nombre'],
                defaults={
                    'cantidad_unidades': pres_dict['unidades'],
                    'precio': pres_dict['precio'],
                    'tipo_precio': tipo_precio,
                    'estado_verificacion_precio': estado_verificacion,
                    'es_predeterminada': pres_dict.get('predeterminada', False),
                    'esta_activa': True,
                }
            )

        # Crear o actualizar grupos de variantes
        for grupo_dict in prod_dict.get('grupos_variantes', []):
            grupo, _ = GrupoVariante.objects.update_or_create(
                producto=producto,
                nombre=grupo_dict['nombre'],
                defaults={
                    'es_obligatorio': grupo_dict.get('es_obligatorio', True),
                    'permite_multiple': False,
                    'esta_activo': True,
                }
            )
            for indice, nombre_opcion in enumerate(grupo_dict.get('opciones', [])):
                OpcionVariante.objects.update_or_create(
                    grupo_variante=grupo,
                    nombre=nombre_opcion,
                    defaults={
                        'precio_adicional': Decimal('0.00'),
                        'esta_disponible': True,
                        'esta_activa': True,
                        'orden': indice,
                    }
                )

        total_creados += 1

    print("==================================================")
    print(f" ¡CARGA EXITOSA! {total_creados} PRODUCTOS REGISTRADOS")
    print(f" Categorías: {Categoria.objects.count()}")
    print(f" Productos activos: {Producto.activos.count()}")
    print(f" Presentaciones de productos: {PresentacionProducto.objects.count()}")
    print(f" Grupos de variantes: {GrupoVariante.objects.count()}")
    print(f" Opciones de variantes: {OpcionVariante.objects.count()}")
    print("==================================================")

if __name__ == '__main__':
    ejecutar_semilla()

