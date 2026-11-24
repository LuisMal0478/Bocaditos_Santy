import React from 'react';

/**
 * Resuelve de forma inteligente la URL de una imagen:
 * - Si es absoluta (Cloudinary, URL externa), la mantiene.
 * - Si es una imagen estática local empaquetada en Vercel (/media/productos/...), la sirve desde Vercel.
 * - Si es una imagen subida dinámicamente al backend (/media/bocaditos_santy_...), la resuelve contra el backend de Render.
 */
export const obtenerUrlImagen = (url?: string | null): string => {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return '/placeholder.jpg';
  }

  const limpia = url.trim();

  // Si ya es absoluta (https://... o http://...)
  if (limpia.startsWith('http://') || limpia.startsWith('https://')) {
    return limpia;
  }

  // Si es un recurso estático empaquetado en el frontend de Vercel
  if (limpia.startsWith('/media/productos/') || limpia.startsWith('/logo-') || limpia.startsWith('/placeholder.')) {
    return limpia;
  }

  // Para archivos subidos dinámicamente al backend (como /media/bocaditos_santy_...)
  const urlApi = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/+$/, '');
  const hostBackend = urlApi.replace(/\/api\/?$/, '');

  if (hostBackend) {
    const rutaNormalizada = limpia.startsWith('/') ? limpia : `/${limpia}`;
    return `${hostBackend}${rutaNormalizada}`;
  }

  return limpia;
};

/**
 * Manejador inteligente de fallo en carga de imágenes:
 * Si una imagen con ruta relativa (/media/...) falla en el dominio de Vercel,
 * reintenta inmediatamente pedirla al servidor de backend de Render antes de caer al placeholder.
 */
export const manejarErrorImagen = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.currentTarget;
  const srcActual = target.src;
  const urlApi = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/+$/, '');
  const hostBackend = urlApi.replace(/\/api\/?$/, '');

  // Si falló en Vercel y contiene /media/, intentar en el backend de Render
  if (hostBackend && !srcActual.startsWith(hostBackend) && srcActual.includes('/media/')) {
    const rutaMedia = srcActual.substring(srcActual.indexOf('/media/'));
    target.src = `${hostBackend}${rutaMedia}`;
    return;
  }

  // Si ya falló en el backend o no es /media/, usar el placeholder oficial
  target.src = '/placeholder.jpg';
};
