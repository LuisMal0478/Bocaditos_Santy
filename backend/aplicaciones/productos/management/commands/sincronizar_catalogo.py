"""
Comando de gestión seguro para sincronizar el catálogo desde datos_iniciales.json
sin sobreescribir las personalizaciones del usuario en ConfiguracionNegocio ni
borrar productos modificados en producción.
"""
import os
import json
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.conf import settings
from aplicaciones.categorias.models import Categoria
from aplicaciones.productos.models import Producto, PresentacionProducto, GrupoVariante, OpcionVariante
from aplicaciones.negocio.models import ConfiguracionNegocio


class Command(BaseCommand):
    help = "Sincroniza categorías y productos nuevos desde datos_iniciales.json de forma segura."

    def handle(self, *args, **options):
        fixture_path = os.path.join(settings.BASE_DIR, 'backend', 'datos_iniciales.json')
        if not os.path.exists(fixture_path):
            fixture_path = os.path.join(settings.BASE_DIR, 'datos_iniciales.json')

        if not os.path.exists(fixture_path):
            self.stderr.write(self.style.ERROR(f"No se encontró el archivo de fixture en {fixture_path}"))
            return

        self.stdout.write(self.style.NOTICE(f"Leyendo catálogo desde {fixture_path}..."))
        with open(fixture_path, 'r', encoding='utf-8') as f:
            items = json.load(f)

        # 1. Separar por modelo
        categorias_fixture = [i for i in items if i['model'] == 'categorias.categoria']
        productos_fixture = [i for i in items if i['model'] == 'productos.producto']
        presentaciones_fixture = [i for i in items if i['model'] == 'productos.presentacionproducto']
        grupos_fixture = [i for i in items if i['model'] == 'productos.grupovariante']
        opciones_fixture = [i for i in items if i['model'] == 'productos.opcionvariante']
        negocio_fixture = [i for i in items if i['model'] == 'negocio.configuracionnegocio']

        # 2. Sincronizar Categorías
        cats_nuevas = 0
        for item in categorias_fixture:
            fields = item['fields']
            cat, created = Categoria.objects.get_or_create(
                slug=fields['slug'],
                defaults={
                    'nombre': fields['nombre'],
                    'descripcion': fields.get('descripcion', ''),
                    'imagen_url': fields.get('imagen_url', ''),
                    'imagen_id_publico': fields.get('imagen_id_publico', ''),
                    'orden': fields.get('orden', 0),
                    'esta_activa': fields.get('esta_activa', True)
                }
            )
            if created:
                cats_nuevas += 1
                self.stdout.write(f"  + Categoría creada: {cat.nombre} ({cat.slug})")

        self.stdout.write(self.style.SUCCESS(f"Categorías sincronizadas ({cats_nuevas} nuevas)."))

        # 3. Sincronizar Productos
        prods_nuevos = 0
        for item in productos_fixture:
            fields = item['fields']
            cat_id = fields['categoria']
            try:
                categoria = Categoria.objects.get(pk=cat_id)
            except Categoria.DoesNotExist:
                # Intentar por slug si se conocen
                categoria = Categoria.objects.first()

            prod, created = Producto.objects.get_or_create(
                slug=fields['slug'],
                defaults={
                    'categoria': categoria,
                    'nombre': fields['nombre'],
                    'descripcion': fields.get('descripcion', ''),
                    'imagen_url': fields.get('imagen_url', ''),
                    'imagen_id_publico': fields.get('imagen_id_publico', ''),
                    'esta_disponible': fields.get('esta_disponible', True),
                    'esta_destacado': fields.get('esta_destacado', False),
                    'esta_activo': fields.get('esta_activo', True)
                }
            )
            if created:
                prods_nuevos += 1
                self.stdout.write(f"  + Producto creado: {prod.nombre} (ID {prod.id})")

        self.stdout.write(self.style.SUCCESS(f"Productos sincronizados ({prods_nuevos} nuevos)."))

        # 4. Sincronizar Presentaciones
        pres_nuevas = 0
        for item in presentaciones_fixture:
            fields = item['fields']
            prod_id = fields['producto']
            try:
                producto = Producto.objects.get(pk=prod_id)
            except Producto.DoesNotExist:
                continue

            precio_val = Decimal(str(fields['precio'])) if fields.get('precio') is not None else None
            pres, created = PresentacionProducto.objects.get_or_create(
                producto=producto,
                nombre=fields['nombre'],
                defaults={
                    'cantidad_unidades': fields.get('cantidad_unidades', 1),
                    'precio': precio_val,
                    'tipo_precio': fields.get('tipo_precio', 'FIJO'),
                    'estado_verificacion_precio': fields.get('estado_verificacion_precio', 'CONFIRMADO'),
                    'es_predeterminada': fields.get('es_predeterminada', False),
                    'esta_activa': fields.get('esta_activa', True),
                    'orden': fields.get('orden', 0)
                }
            )
            if created:
                pres_nuevas += 1

        self.stdout.write(self.style.SUCCESS(f"Presentaciones sincronizadas ({pres_nuevas} nuevas)."))

        # 5. Sincronizar Grupos y Opciones de Variante
        for item in grupos_fixture:
            fields = item['fields']
            try:
                prod = Producto.objects.get(pk=fields['producto'])
                GrupoVariante.objects.get_or_create(
                    pk=item['pk'],
                    defaults={
                        'producto': prod,
                        'nombre': fields['nombre'],
                        'es_obligatorio': fields.get('es_obligatorio', False),
                        'permite_multiple': fields.get('permite_multiple', False),
                        'orden': fields.get('orden', 0),
                        'esta_activo': fields.get('esta_activo', True)
                    }
                )
            except Producto.DoesNotExist:
                pass

        for item in opciones_fixture:
            fields = item['fields']
            try:
                grupo_id = fields.get('grupo_variante') or fields.get('grupo')
                grupo = GrupoVariante.objects.get(pk=grupo_id)
                precio_adicional = Decimal(str(fields['precio_adicional'])) if fields.get('precio_adicional') else Decimal('0.00')
                OpcionVariante.objects.get_or_create(
                    pk=item['pk'],
                    defaults={
                        'grupo_variante': grupo,
                        'nombre': fields['nombre'],
                        'precio_adicional': precio_adicional,
                        'esta_disponible': fields.get('esta_disponible', True),
                        'esta_activa': fields.get('esta_activa', True),
                        'orden': fields.get('orden', 0)
                    }
                )
            except (GrupoVariante.DoesNotExist, KeyError):
                pass

        # 6. Configuración de Negocio (PRESERVAR datos del usuario)
        if ConfiguracionNegocio.objects.exists():
            self.stdout.write(self.style.NOTICE("Configuración de Negocio ya existe: preservando ajustes del usuario."))
        else:
            if negocio_fixture:
                fields = negocio_fixture[0]['fields']
                ConfiguracionNegocio.objects.create(
                    nombre_negocio=fields.get('nombre_negocio', 'Bocaditos Santy'),
                    slogan=fields.get('slogan', ''),
                    descripcion=fields.get('descripcion', ''),
                    telefono_principal=fields.get('telefono_principal', ''),
                    telefono_secundario=fields.get('telefono_secundario', ''),
                    whatsapp_pedidos=fields.get('whatsapp_pedidos', ''),
                    email_contacto=fields.get('email_contacto', ''),
                    direccion_fisica=fields.get('direccion_fisica', ''),
                    ciudad=fields.get('ciudad', 'Popayán'),
                    departamento=fields.get('departamento', 'Cauca'),
                    moneda=fields.get('moneda', 'COP'),
                    simbolo_moneda=fields.get('simbolo_moneda', '$'),
                    costo_envio_base=Decimal(str(fields.get('costo_envio_base', '0.00'))),
                    dias_anticipacion_minima=fields.get('dias_anticipacion_minima', 2),
                    horario_atencion=fields.get('horario_atencion', ''),
                    facebook_url=fields.get('facebook_url', ''),
                    instagram_url=fields.get('instagram_url', ''),
                    color_primario=fields.get('color_primario', '#7C2D12'),
                    color_secundario=fields.get('color_secundario', '#D97706'),
                    color_acento=fields.get('color_acento', '#B45309'),
                    imagen_hero_url=fields.get('imagen_hero_url', '')
                )
                self.stdout.write(self.style.SUCCESS("Configuración de Negocio inicial creada."))

        self.stdout.write(self.style.SUCCESS("=== SINCRONIZACIÓN DE CATÁLOGO COMPLETADA CON ÉXITO ==="))
