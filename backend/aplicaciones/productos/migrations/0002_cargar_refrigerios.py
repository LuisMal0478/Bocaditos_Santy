# Generated data migration to load Refrigerios products
from decimal import Decimal
from django.db import migrations

def cargar_refrigerios(apps, schema_editor):
    Categoria = apps.get_model('categorias', 'Categoria')
    Producto = apps.get_model('productos', 'Producto')
    PresentacionProducto = apps.get_model('productos', 'PresentacionProducto')

    # Categoría Refrigerios
    cat, _ = Categoria.objects.get_or_create(
        slug='refrigerios',
        defaults={
            'nombre': 'Refrigerios',
            'descripcion': 'Exquisitos refrigerios empresariales, combos con jugo y fruta, sándwiches artesanales, hamburguesas, wraps y opciones especiales para todo tipo de eventos.',
            'imagen_url': '/media/productos/refrigerio_cajita_sandwich_frutas.jpg',
            'orden': 6,
            'esta_activa': True
        }
    )

    PRODUCTOS = [
        {
            "nombre": "Sándwich de Pollo Artesanal",
            "slug": "sandwich-de-pollo-artesanal",
            "descripcion": "Pan artesanal suave con dip de pollo especial de la casa, fresco y delicioso.",
            "imagen_url": "/media/productos/refrigerio_sandwich_pollo.jpg",
            "esta_destacado": True,
            "presentaciones": [
                {"nombre": "Unidad individual", "cantidad": 1, "precio": Decimal("7500.00"), "predeterminada": True},
                {"nombre": "Combo (+ Jugo de caja y fruta)", "cantidad": 1, "precio": Decimal("9000.00"), "predeterminada": False}
            ]
        },
        {
            "nombre": "Sándwich de Jamón y Queso",
            "slug": "sandwich-de-jamon-y-queso-refrigerio",
            "descripcion": "Pan de mantequilla, jamón de alta calidad, queso fundido y lechuga fresca seleccionada.",
            "imagen_url": "/media/productos/refrigerio_sandwich_jamon_queso.jpg",
            "esta_destacado": False,
            "presentaciones": [
                {"nombre": "Unidad individual", "cantidad": 1, "precio": Decimal("7500.00"), "predeterminada": True},
                {"nombre": "Combo (+ Jugo de caja y fruta)", "cantidad": 1, "precio": Decimal("9000.00"), "predeterminada": False},
                {"nombre": "Combo Gourmet (+ Brocheta de frutas y jugo natural)", "cantidad": 1, "precio": Decimal("11000.00"), "predeterminada": False}
            ]
        },
        {
            "nombre": "Sándwich de Lomo de Cerdo",
            "slug": "sandwich-de-lomo-de-cerdo",
            "descripcion": "Pan ciabatta rústico, lomo de cerdo tierno y jugoso con vegetales frescos.",
            "imagen_url": "/media/productos/refrigerio_sandwich_lomo_cerdo.jpg",
            "esta_destacado": False,
            "presentaciones": [
                {"nombre": "Unidad individual", "cantidad": 1, "precio": Decimal("10500.00"), "predeterminada": True},
                {"nombre": "Combo (+ Jugo de caja y chips de papas)", "cantidad": 1, "precio": Decimal("16000.00"), "predeterminada": False}
            ]
        },
        {
            "nombre": "Wrap de Pollo",
            "slug": "wrap-de-pollo-refrigerio",
            "descripcion": "Tortilla suave rellena de dip de pollo cremoso y vegetales frescos de temporada.",
            "imagen_url": "/media/productos/refrigerio_wrap_pollo.jpg",
            "esta_destacado": False,
            "presentaciones": [
                {"nombre": "Tortilla Mediana (M)", "cantidad": 1, "precio": Decimal("6500.00"), "predeterminada": True},
                {"nombre": "Unidad Tortilla XXL", "cantidad": 1, "precio": Decimal("10500.00"), "predeterminada": False},
                {"nombre": "Combo XXL (+ Nachos y jugo de caja)", "cantidad": 1, "precio": Decimal("16000.00"), "predeterminada": False}
            ]
        },
        {
            "nombre": "Combo Mini Hamburguesas con Brocheta y Jugo",
            "slug": "combo-mini-hamburguesas-brocheta-jugo",
            "descripcion": "Mini hamburguesas con pan artesanal, carne, queso, lechuga, tomate y cebolla caramelizada, acompañadas de brocheta de frutas frescas y jugo natural mini.",
            "imagen_url": "/media/productos/refrigerio_combo_mini_hamburguesa.jpg",
            "esta_destacado": True,
            "presentaciones": [
                {"nombre": "Combo completo", "cantidad": 1, "precio": Decimal("10000.00"), "predeterminada": True}
            ]
        },
        {
            "nombre": "Combo Hamburguesa Mediana Fiesta",
            "slug": "combo-hamburguesa-mediana-fiesta",
            "descripcion": "Hamburguesa mediana en pan de mantequilla, carne seleccionada, queso, lechuga, tomate y cebolla caramelizada, acompañada de papas a la francesa, masmelos con chocolate, chispas de colores y jugo natural mini.",
            "imagen_url": "/media/productos/refrigerio_combo_hamburguesa_mediana.jpg",
            "esta_destacado": True,
            "presentaciones": [
                {"nombre": "Combo completo fiesta", "cantidad": 1, "precio": Decimal("12500.00"), "predeterminada": True}
            ]
        },
        {
            "nombre": "Hamburguesas Artesanales",
            "slug": "hamburguesas-artesanales-refrigerios",
            "descripcion": "Pan suave, carne sazonada con receta de la casa, queso, lechuga, tomate y cebolla caramelizada.",
            "imagen_url": "/media/productos/refrigerio_hamburguesas_artesanales.jpg",
            "esta_destacado": False,
            "presentaciones": [
                {"nombre": "Mini Hamburguesa (Unidad)", "cantidad": 1, "precio": Decimal("3000.00"), "predeterminada": True},
                {"nombre": "Hamburguesa Mediana Sencilla (Unidad)", "cantidad": 1, "precio": Decimal("6800.00"), "predeterminada": False},
                {"nombre": "Hamburguesa Mediana Especial (Unidad)", "cantidad": 1, "precio": Decimal("7500.00"), "predeterminada": False}
            ]
        },
        {
            "nombre": "Combo Mini Hamburguesa y Mini Pizza",
            "slug": "combo-mini-hamburguesa-y-mini-pizza",
            "descripcion": "Mini hamburguesa en pan de mantequilla con carne y cebolla caramelizada, más mini pizza artesanal de jamón y queso, acompañada de masmelos con chocolates y chispas de colores.",
            "imagen_url": "/media/productos/refrigerio_combo_hamburguesa_pizza.jpg",
            "esta_destacado": False,
            "presentaciones": [
                {"nombre": "Combo completo", "cantidad": 1, "precio": Decimal("9800.00"), "predeterminada": True}
            ]
        },
        {
            "nombre": "Burritos de Pollo Broaster",
            "slug": "burritos-de-pollo-broaster",
            "descripcion": "Tortilla suave rellena de crujiente pollo broaster, queso fundido y lechuga fresca con aderezo especial.",
            "imagen_url": "/media/productos/refrigerio_burritos_pollo_broaster.jpg",
            "esta_destacado": False,
            "presentaciones": [
                {"nombre": "Unidad individual", "cantidad": 1, "precio": Decimal("9000.00"), "predeterminada": True}
            ]
        },
        {
            "nombre": "Croissant Relleno",
            "slug": "croissant-relleno-refrigerios",
            "descripcion": "Croissant hojaldrado suave relleno de jamón de pavo seleccionado, queso y lechuga fresca.",
            "imagen_url": "/media/productos/refrigerio_croissant_relleno.jpg",
            "esta_destacado": False,
            "presentaciones": [
                {"nombre": "Unidad individual", "cantidad": 1, "precio": Decimal("9500.00"), "predeterminada": True},
                {"nombre": "Combo (+ Jugo de caja)", "cantidad": 1, "precio": Decimal("12500.00"), "predeterminada": False}
            ]
        },
        {
            "nombre": "Deditos de Queso con Jugo (Refrigerio)",
            "slug": "deditos-de-queso-con-jugo-refrigerio",
            "descripcion": "Dedito de queso crocante de 13 cm de longitud, relleno generoso de queso costeño fundente, acompañado de jugo en caja.",
            "imagen_url": "/media/productos/refrigerio_dedito_queso_combo.jpg",
            "esta_destacado": False,
            "presentaciones": [
                {"nombre": "Combo refrigerio (Dedito 13cm + Jugo)", "cantidad": 1, "precio": Decimal("7000.00"), "predeterminada": True}
            ]
        },
        {
            "nombre": "Pastelitos Horneados de Pollo y Maíz",
            "slug": "pastelitos-horneados-de-pollo-y-maiz",
            "descripcion": "Pastelitos horneados crocantes rellenos de pollo tierno, queso y maíz dulce. Entregados en bolsa de papel parafinado higiénica y ecológica.",
            "imagen_url": "/media/productos/refrigerio_pastelitos_horneados.jpg",
            "esta_destacado": False,
            "presentaciones": [
                {"nombre": "Unidad individual", "cantidad": 1, "precio": Decimal("4000.00"), "predeterminada": True}
            ]
        },
        {
            "nombre": "Perros Calientes Tradicionales",
            "slug": "perros-calientes-tradicionales",
            "descripcion": "Perro caliente con pan suave, salchicha premium, papitas ripio crocantes y salsas de la casa.",
            "imagen_url": "/media/productos/refrigerio_perros_calientes.jpg",
            "esta_destacado": False,
            "presentaciones": [
                {"nombre": "Unidad individual", "cantidad": 1, "precio": Decimal("5000.00"), "predeterminada": True}
            ]
        },
        {
            "nombre": "Lasaña Trifásica Artesanal",
            "slug": "lasana-trifasica-artesanal",
            "descripcion": "Lasaña horneada con capas de pollo, carne y jamón con queso gratinado dorado, acompañada de tostada de ajo crujiente.",
            "imagen_url": "/media/productos/refrigerio_lasana_trifasica.jpg",
            "esta_destacado": False,
            "presentaciones": [
                {"nombre": "Tamaño Mediana", "cantidad": 1, "precio": Decimal("9800.00"), "predeterminada": True},
                {"nombre": "Tamaño Personal", "cantidad": 1, "precio": Decimal("11500.00"), "predeterminada": False}
            ]
        },
        {
            "nombre": "Plato de Nochebuena Tradicional",
            "slug": "plato-de-nochebuena-tradicional",
            "descripcion": "Plato navideño tradicional payanés con rosquilla, arequipe cremoso, brevas caladas, natilla casera, queso y limón calado.",
            "imagen_url": "/media/productos/refrigerio_plato_nochebuena.jpg",
            "esta_destacado": False,
            "presentaciones": [
                {"nombre": "Unidad individual", "cantidad": 1, "precio": Decimal("6000.00"), "predeterminada": True}
            ]
        },
        {
            "nombre": "Tamales de Pipián Tradicionales",
            "slug": "tamales-de-pipian-tradicionales",
            "descripcion": "Auténticos tamales de pipián de tradición payanesa con masa suave y hogao criollo (pedidos con mínimo 2 días de anticipación).",
            "imagen_url": "/media/productos/refrigerio_tamales_pipian.jpg",
            "esta_destacado": False,
            "presentaciones": [
                {"nombre": "Unidad individual", "cantidad": 1, "precio": Decimal("3500.00"), "predeterminada": True}
            ]
        },
        {
            "nombre": "Wrap Gratinado Especial",
            "slug": "wrap-gratinado-especial",
            "descripcion": "Deliciosa tortilla rellena de pollo tierno, jamón y vegetales frescos, cubierta con generoso queso gratinado.",
            "imagen_url": "/media/productos/refrigerio_wrap_gratinado.jpg",
            "esta_destacado": False,
            "presentaciones": [
                {"nombre": "Unidad individual", "cantidad": 1, "precio": Decimal("11800.00"), "predeterminada": True}
            ]
        },
        {
            "nombre": "Plato Navideño de Pasabocas",
            "slug": "plato-navideno-de-pasabocas",
            "descripcion": "Deliciosa selección de pasabocas y sabores tradicionales para compartir y disfrutar en reuniones y celebraciones.",
            "imagen_url": "/media/productos/refrigerio_plato_navideno.jpg",
            "esta_destacado": False,
            "presentaciones": [
                {"nombre": "Unidad individual", "cantidad": 1, "precio": Decimal("4000.00"), "predeterminada": True}
            ]
        },
        {
            "nombre": "Combo de Cajita Sándwich y Frutas",
            "slug": "combo-de-cajita-sandwich-y-frutas",
            "descripcion": "Deliciosa cajita para refrigerio con sándwich fresco, jugo en cajita y brocheta de frutas de temporada para compartir y disfrutar.",
            "imagen_url": "/media/productos/refrigerio_cajita_sandwich_frutas.jpg",
            "esta_destacado": True,
            "presentaciones": [
                {"nombre": "Unidad (Cajita completa)", "cantidad": 1, "precio": Decimal("10000.00"), "predeterminada": True}
            ]
        },
        {
            "nombre": "Combo de Cajita Sándwich Tostadito",
            "slug": "combo-de-cajita-sandwich-tostadito",
            "descripcion": "Deliciosa cajita con sándwich de jamón y queso tostadito al momento, jugo en cajita y brocheta de frutas frescas.",
            "imagen_url": "/media/productos/refrigerio_cajita_sandwich_tostado.jpg",
            "esta_destacado": True,
            "presentaciones": [
                {"nombre": "Unidad (Cajita completa)", "cantidad": 1, "precio": Decimal("10500.00"), "predeterminada": True}
            ]
        },
        {
            "nombre": "Sándwich de Pollo Gratinado con Ensalada Parmesano",
            "slug": "sandwich-de-pollo-gratinado-con-ensalada-parmesano",
            "descripcion": "Sándwich de pollo gourmet con champiñones salteados gratinados y ensalada fresca con queso parmesano.",
            "imagen_url": "/media/productos/refrigerio_sandwich_pollo_champinones.jpg",
            "esta_destacado": False,
            "presentaciones": [
                {"nombre": "Unidad individual", "cantidad": 1, "precio": Decimal("13500.00"), "predeterminada": True}
            ]
        },
        {
            "nombre": "Combo Nuggets con Papas y Jugo",
            "slug": "combo-nuggets-con-papas-y-jugo",
            "descripcion": "Deliciosa cajita infantil con nuggets de pollo crujientes, papas fritas doradas y jugo en cajita.",
            "imagen_url": "/media/productos/refrigerio_combo_nuggets_papas.jpg",
            "esta_destacado": False,
            "presentaciones": [
                {"nombre": "Unidad (Combo completo)", "cantidad": 1, "precio": Decimal("12000.00"), "predeterminada": True}
            ]
        }
    ]

    for p_data in PRODUCTOS:
        prod, _ = Producto.objects.get_or_create(
            slug=p_data["slug"],
            defaults={
                "categoria": cat,
                "nombre": p_data["nombre"],
                "descripcion": p_data["descripcion"],
                "imagen_url": p_data["imagen_url"],
                "esta_disponible": True,
                "esta_destacado": p_data["esta_destacado"],
                "esta_activo": True
            }
        )

        orden = 1
        for pres_data in p_data["presentaciones"]:
            PresentacionProducto.objects.get_or_create(
                producto=prod,
                nombre=pres_data["nombre"],
                defaults={
                    "cantidad_unidades": pres_data["cantidad"],
                    "precio": pres_data["precio"],
                    "tipo_precio": "FIJO",
                    "estado_verificacion_precio": "CONFIRMADO",
                    "es_predeterminada": pres_data["predeterminada"],
                    "esta_activa": True,
                    "orden": orden
                }
            )
            orden += 1


class Migration(migrations.Migration):

    dependencies = [
        ('categorias', '0001_initial'),
        ('productos', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(cargar_refrigerios, migrations.RunPython.noop),
    ]
