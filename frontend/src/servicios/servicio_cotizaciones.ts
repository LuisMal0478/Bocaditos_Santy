import { clienteApi } from './cliente_api';
import {
  SolicitudCotizacionFormulario,
  ItemCotizacionEnvio,
  RespuestaCotizacionExitosa,
  CotizacionResumenAdmin,
  EstadoCotizacion,
} from '../tipos/cotizacion';

export interface CargaSolicitudCotizacion extends SolicitudCotizacionFormulario {
  items: ItemCotizacionEnvio[];
}

export const servicioCotizaciones = {
  crear: async (datos: CargaSolicitudCotizacion) => {
    const respuesta = await clienteApi.post<{
      estado: string;
      mensaje: string;
      datos: RespuestaCotizacionExitosa;
    }>('/cotizaciones/', datos);
    return respuesta.data;
  },

  obtenerTodasAdmin: async (estado?: EstadoCotizacion) => {
    const respuesta = await clienteApi.get<CotizacionResumenAdmin[]>('/cotizaciones/gestion/solicitudes/', {
      params: estado ? { estado } : undefined,
    });
    return Array.isArray(respuesta.data) ? respuesta.data : [];
  },

  obtenerPorIdAdmin: async (id: number) => {
    const respuesta = await clienteApi.get(`/cotizaciones/gestion/solicitudes/${id}/`);
    return respuesta.data;
  },

  cambiarEstadoAdmin: async (id: number, nuevoEstado: EstadoCotizacion) => {
    const respuesta = await clienteApi.patch(`/cotizaciones/gestion/solicitudes/${id}/cambiar-estado/`, {
      estado: nuevoEstado,
    });
    return respuesta.data;
  },
};

