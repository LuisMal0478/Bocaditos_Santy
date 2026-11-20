import { ProductoDetalle, PresentacionProducto, OpcionVariante } from './producto';

export type EstadoCotizacion =
  | 'PENDIENTE'
  | 'EN_REVISION'
  | 'COTIZACION_ENVIADA'
  | 'CONFIRMADA'
  | 'CANCELADA';

export interface ItemCotizacion {
  idUnico: string; // Para identificar el item en el carrito (ej. productoId-presentacionId-varianteId)
  producto: ProductoDetalle;
  presentacion: PresentacionProducto;
  variante?: OpcionVariante | null;
  cantidad: number; // Número de paquetes / presentaciones
  observaciones?: string;
}

export interface SolicitudCotizacionFormulario {
  nombre_cliente: string;
  telefono_whatsapp: string;
  correo_electronico?: string;
  tipo_evento: string;
  fecha_evento: string;
  lugar_evento?: string;
  cantidad_invitados?: number;
  observaciones?: string;
  acepta_politica_privacidad: boolean;
  campo_control_trampa?: string;
}

export interface ItemCotizacionEnvio {
  producto_id: number;
  presentacion_id: number;
  opcion_variante_id?: number | null;
  cantidad: number;
  observaciones?: string;
}

export interface RespuestaCotizacionExitosa {
  id: number;
  codigo_seguimiento: string;
  nombre_cliente: string;
  tipo_evento: string;
  fecha_evento: string;
  url_whatsapp: string;
  mensaje_whatsapp: string;
  total_items: number;
  fecha_creacion: string;
}

export interface CotizacionResumenAdmin {
  id: number;
  codigo_seguimiento: string;
  nombre_cliente: string;
  telefono_whatsapp: string;
  tipo_evento: string;
  fecha_evento: string;
  cantidad_invitados?: number;
  estado: EstadoCotizacion;
  estado_texto: string;
  total_items: number;
  fecha_creacion: string;
}

