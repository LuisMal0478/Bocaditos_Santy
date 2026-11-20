"""Modelos de la aplicación categorías."""
from django.db import models
from django.utils.text import slugify

class Categoria(models.Model):
    """Modelo relacional para clasificar los productos del catálogo."""
    nombre = models.CharField(max_length=100, unique=True, verbose_name="Nombre de la categoría")
    slug = models.SlugField(max_length=120, unique=True, blank=True, verbose_name="Slug amigable")
    descripcion = models.TextField(blank=True, verbose_name="Descripción")
    imagen_url = models.URLField(max_length=500, blank=True, verbose_name="URL de imagen")
    imagen_id_publico = models.CharField(max_length=255, blank=True, verbose_name="ID público en Cloudinary")
    orden = models.PositiveIntegerField(default=0, verbose_name="Orden de visualización")
    esta_activa = models.BooleanField(default=True, verbose_name="¿Está activa?")
    fecha_creacion = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de creación")
    fecha_actualizacion = models.DateTimeField(auto_now=True, verbose_name="Fecha de actualización")

    class Meta:
        verbose_name = "Categoría"
        verbose_name_plural = "Categorías"
        ordering = ['orden', 'nombre']

    def __str__(self):
        return self.nombre

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.nombre)
        super().save(*args, **kwargs)

