import { create } from 'zustand';
import { ConfiguracionNegocio } from '../tipos/negocio';
import { servicioNegocio } from '../servicios/servicio_negocio';

interface EstadoConfiguracionStore {
  configuracion: ConfiguracionNegocio | null;
  cargando: boolean;
  cargarConfiguracion: () => Promise<ConfiguracionNegocio | null>;
  actualizarConfiguracion: (datos: Partial<ConfiguracionNegocio> | FormData) => Promise<ConfiguracionNegocio>;
  aplicarTemaVisual: (config: Partial<ConfiguracionNegocio>) => void;
}

// Fuentes conocidas para carga dinámica vía Google Fonts
const FUENTES_GOOGLE = [
  'Playfair Display',
  'Cormorant Garamond',
  'Montserrat',
  'Great Vibes',
  'Lora',
  'Cinzel',
  'Plus Jakarta Sans',
  'Inter',
  'Poppins',
  'Roboto',
  'Nunito',
];

export const useConfiguracion = create<EstadoConfiguracionStore>((set, get) => ({
  configuracion: null,
  cargando: false,

  aplicarTemaVisual: (config) => {
    const raiz = document.documentElement;

    // 1. Colores
    if (config.color_principal) {
      raiz.style.setProperty('--color-principal', config.color_principal);
      // Generar tono oscuro para hover
      raiz.style.setProperty('--color-principal-oscuro', ajustarBrillo(config.color_principal, -20));
    }
    if (config.color_secundario) {
      raiz.style.setProperty('--color-secundario', config.color_secundario);
    }
    if (config.color_acento) {
      raiz.style.setProperty('--color-acento', config.color_acento);
    }
    if (config.color_fondo) {
      raiz.style.setProperty('--color-fondo', config.color_fondo);
    }
    if (config.color_texto) {
      raiz.style.setProperty('--color-texto', config.color_texto);
    }

    // 2. Tipografías
    if (config.fuente_titulos) {
      raiz.style.setProperty('--fuente-titulos', `'${config.fuente_titulos}', Georgia, serif`);
      cargarFuenteGoogle(config.fuente_titulos);
    }
    if (config.fuente_cuerpo) {
      raiz.style.setProperty('--fuente-cuerpo', `'${config.fuente_cuerpo}', sans-serif`);
      cargarFuenteGoogle(config.fuente_cuerpo);
    }
  },

  cargarConfiguracion: async () => {
    set({ cargando: true });
    try {
      const config = await servicioNegocio.obtener();
      set({ configuracion: config, cargando: false });
      get().aplicarTemaVisual(config);
      return config;
    } catch (error) {
      console.error('Error al cargar configuración del negocio:', error);
      set({ cargando: false });
      return null;
    }
  },

  actualizarConfiguracion: async (datos) => {
    const configActualizada = await servicioNegocio.actualizar(datos);
    set({ configuracion: configActualizada });
    get().aplicarTemaVisual(configActualizada);
    return configActualizada;
  },
}));

/**
 * Carga dinámicamente una fuente de Google Fonts si no está en el documento
 */
function cargarFuenteGoogle(nombreFuente: string) {
  if (!nombreFuente || !FUENTES_GOOGLE.includes(nombreFuente)) return;
  const idElemento = `fuente-dinamica-${nombreFuente.toLowerCase().replace(/\s+/g, '-')}`;
  if (document.getElementById(idElemento)) return;

  const link = document.createElement('link');
  link.id = idElemento;
  link.rel = 'stylesheet';
  const nombreCodificado = nombreFuente.replace(/\s+/g, '+');
  link.href = `https://fonts.googleapis.com/css2?family=${nombreCodificado}:ital,wght@0,400;0,600;0,700;1,400&display=swap`;
  document.head.appendChild(link);
}

/**
 * Oscurece o aclara un color hexadecimal para estados hover
 */
function ajustarBrillo(hex: string, porcentaje: number): string {
  let num = parseInt(hex.replace('#', ''), 16);
  if (isNaN(num)) return hex;

  let r = (num >> 16) + Math.round((255 * porcentaje) / 100);
  let g = ((num >> 8) & 0x00ff) + Math.round((255 * porcentaje) / 100);
  let b = (num & 0x0000ff) + Math.round((255 * porcentaje) / 100);

  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

