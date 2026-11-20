import { Categoria } from './categoria';

export type TipoPrecio = 'FIJO' | 'A_COTIZAR';
export type EstadoVerificacionPrecio = 'PENDIENTE' | 'CONFIRMADO' | 'NO_APLICA';

export interface PresentacionProducto {
  id: number;
  nombre: string;
  cantidad_unidades: number;
  precio: number | string | null;
  tipo_precio: TipoPrecio;
  texto_tipo_precio?: string;
  estado_verificacion_precio: EstadoVerificacionPrecio;
  texto_estado_verificacion?: string;
  es_predeterminada: boolean;
  esta_activa: boolean;
  orden: number;
}

export interface OpcionVariante {
  id: number;
  nombre: string;
  precio_adicional: number | string;
  esta_disponible: boolean;
  esta_activa: boolean;
  orden: number;
}

export interface GrupoVariante {
  id: number;
  nombre: string;
  es_obligatorio: boolean;
  permite_multiple: boolean;
  orden: number;
  esta_activo: boolean;
  opciones: OpcionVariante[];
}

export interface ProductoLista {
  id: number;
  categoria_id: number;
  categoria_nombre: string;
  categoria_slug: string;
  nombre: string;
  slug: string;
  descripcion: string;
  imagen_url: string;
  esta_disponible: boolean;
  esta_destacado: boolean;
  esta_activo: boolean;
  presentacion_predeterminada: PresentacionProducto | null;
  total_presentaciones: number;
  tiene_variantes: boolean;
}

export interface ProductoDetalle {
  id: number;
  categoria: Categoria;
  nombre: string;
  slug: string;
  descripcion: string;
  imagen_url: string;
  imagen_id_publico?: string;
  esta_disponible: boolean;
  esta_destacado: boolean;
  esta_activo: boolean;
  presentaciones: PresentacionProducto[];
  grupos_variantes: GrupoVariante[];
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

