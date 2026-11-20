export interface ConfiguracionNegocio {
  id: number;
  nombre_negocio: string;
  eslogan: string;
  logo_url: string;
  logo_id_publico?: string;
  numero_whatsapp: string;
  mensaje_bienvenida_whatsapp: string;
  instagram: string;
  facebook: string;
  email_contacto: string;
  descripcion_negocio: string;
  informacion_contacto: string;
  zona_cobertura: string;

  // Personalización visual y contenidos
  color_principal: string;
  color_secundario: string;
  color_acento: string;
  color_fondo: string;
  color_texto: string;
  fuente_titulos: string;
  fuente_cuerpo: string;
  titulo_hero: string;
  subtitulo_hero: string;
  texto_boton_hero: string;
  imagen_hero_url?: string;
  imagen_hero_id_publico?: string;
  mensaje_anuncio: string;
  mostrar_anuncio: boolean;

  fecha_actualizacion: string;
}


