"""Modelos para la configuración centralizada de Bocaditos Santy."""
from django.db import models

class ConfiguracionNegocio(models.Model):
    """
    Configuración única del negocio para que el número de WhatsApp oficial,
    redes sociales, logo y datos de contacto se administren desde un solo lugar.
    """
    nombre_negocio = models.CharField(
        max_length=100,
        default="Bocaditos Santy",
        verbose_name="Nombre comercial"
    )
    eslogan = models.CharField(
        max_length=150,
        default="Momentos felices",
        verbose_name="Eslogan oficial"
    )
    logo_url = models.URLField(max_length=500, blank=True, verbose_name="URL del logo")
    logo_id_publico = models.CharField(max_length=255, blank=True, verbose_name="ID público en Cloudinary")
    numero_whatsapp = models.CharField(
        max_length=25,
        default="+573000000000",
        verbose_name="Número oficial de WhatsApp (con código de país, ej. +573123456789)"
    )
    mensaje_bienvenida_whatsapp = models.TextField(
        blank=True,
        default="¡Hola Bocaditos Santy! Vengo desde su catálogo web y deseo solicitar la cotización para mi evento.",
        verbose_name="Mensaje de encabezado para WhatsApp"
    )
    instagram = models.CharField(
        max_length=100,
        default="@bocaditossanty",
        blank=True,
        verbose_name="Usuario o enlace de Instagram"
    )
    facebook = models.CharField(max_length=100, blank=True, verbose_name="Enlace de Facebook")
    email_contacto = models.EmailField(blank=True, verbose_name="Correo electrónico de contacto")
    descripcion_negocio = models.TextField(
        blank=True,
        default="Preparación y venta de pasabocas y mesas de bocaditos para todo tipo de celebraciones.",
        verbose_name="Descripción del negocio"
    )
    informacion_contacto = models.TextField(
        blank=True,
        verbose_name="Información adicional de contacto y horarios de atención"
    )
    zona_cobertura = models.TextField(
        blank=True,
        default="Cobertura en la ciudad y municipios aledaños bajo confirmación previa.",
        verbose_name="Zona de cobertura de entregas y eventos"
    )

    # =========================================================================
    # PERSONALIZACIÓN VISUAL Y DE MARCA (COLORES, TIPOGRAFÍAS Y CONTENIDOS WEB)
    # =========================================================================
    color_principal = models.CharField(
        max_length=25,
        default="#D63384",
        verbose_name="Color principal (botones y destacados)"
    )
    color_secundario = models.CharField(
        max_length=25,
        default="#FCE8F0",
        verbose_name="Color secundario (fondos suaves)"
    )
    color_acento = models.CharField(
        max_length=25,
        default="#F8D7E5",
        verbose_name="Color de acento (pasteles y detalles)"
    )
    color_fondo = models.CharField(
        max_length=25,
        default="#FFFFFF",
        verbose_name="Color de fondo principal"
    )
    color_texto = models.CharField(
        max_length=25,
        default="#29232A",
        verbose_name="Color del texto principal"
    )

    fuente_titulos = models.CharField(
        max_length=50,
        default="Playfair Display",
        verbose_name="Tipo de letra para títulos"
    )
    fuente_cuerpo = models.CharField(
        max_length=50,
        default="Plus Jakarta Sans",
        verbose_name="Tipo de letra para textos"
    )

    titulo_hero = models.CharField(
        max_length=150,
        default="Momentos especiales, sabores inolvidables",
        verbose_name="Título principal del Hero"
    )
    subtitulo_hero = models.TextField(
        default="En Bocaditos Santy hacemos de cada celebración un momento especial con deliciosos pasabocas preparados con dedicación.",
        verbose_name="Subtítulo descriptivo del Hero"
    )
    texto_boton_hero = models.CharField(
        max_length=60,
        default="Explorar catálogo",
        verbose_name="Texto del botón principal del Hero"
    )

    mensaje_anuncio = models.CharField(
        max_length=200,
        blank=True,
        default="¡Haz tu solicitud de cotización con anticipación para tus eventos y celebraciones!",
        verbose_name="Mensaje de anuncio superior"
    )
    mostrar_anuncio = models.BooleanField(
        default=True,
        verbose_name="¿Mostrar barra de anuncio superior?"
    )

    fecha_actualizacion = models.DateTimeField(auto_now=True, verbose_name="Última actualización")

    class Meta:
        verbose_name = "Configuración del negocio"
        verbose_name_plural = "Configuración del negocio"

    def __str__(self):
        return f"{self.nombre_negocio} - {self.eslogan}"

    @classmethod
    def obtener_configuracion(cls):
        """Retorna la configuración activa o crea una con valores por defecto si no existe."""
        configuracion, _ = cls.objects.get_or_create(id=1)
        return configuracion

