import { clienteApi } from './cliente_api';
import { ProductoLista, ProductoDetalle, PresentacionProducto } from '../tipos/producto';

export interface ParametrosFiltroProductos {
  categoria?: string | number;
  destacado?: boolean;
  q?: string;
  page?: number;
  sin_paginar?: boolean;
  admin?: boolean;
  todos?: boolean;
}

export const servicioProductos = {
  obtenerTodos: async (filtros?: ParametrosFiltroProductos) => {
    const params = { sin_paginar: true, ...filtros };
    const respuesta = await clienteApi.get<{ results?: ProductoLista[]; count?: number } | ProductoLista[]>('/productos/', {
      params,
    });
    if ('results' in respuesta.data && Array.isArray(respuesta.data.results)) {
      return respuesta.data.results;
    }
    return Array.isArray(respuesta.data) ? respuesta.data : [];
  },

  obtenerPorSlug: async (slugOId: string | number) => {
    const respuesta = await clienteApi.get<ProductoDetalle>(`/productos/${slugOId}/`);
    return respuesta.data;
  },

  obtenerDestacados: async () => {
    return servicioProductos.obtenerTodos({ destacado: true });
  },

  crear: async (datos: FormData) => {
    const respuesta = await clienteApi.post<ProductoDetalle>('/productos/', datos, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return respuesta.data;
  },

  actualizar: async (id: number, datos: FormData) => {
    const respuesta = await clienteApi.patch<ProductoDetalle>(`/productos/${id}/`, datos, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return respuesta.data;
  },

  eliminar: async (id: number) => {
    const respuesta = await clienteApi.delete<{ estado: string; mensaje: string }>(`/productos/${id}/`);
    return respuesta.data;
  },

  alternarActivo: async (id: number) => {
    const respuesta = await clienteApi.patch<{ estado: string; mensaje: string; esta_activo: boolean }>(
      `/productos/${id}/alternar-activo/`
    );
    return respuesta.data;
  },

  alternarDestacado: async (id: number) => {
    const respuesta = await clienteApi.patch<{ estado: string; mensaje: string; esta_destacado: boolean }>(
      `/productos/${id}/alternar-destacado/`
    );
    return respuesta.data;
  },

  alternarDisponible: async (id: number) => {
    const respuesta = await clienteApi.patch<{ estado: string; mensaje: string; esta_disponible: boolean }>(
      `/productos/${id}/alternar-disponible/`
    );
    return respuesta.data;
  },

  // Gestión de Presentaciones
  obtenerPresentaciones: async (productoId: number) => {
    const respuesta = await clienteApi.get<PresentacionProducto[]>('/productos/presentaciones/', {
      params: { producto_id: productoId },
    });
    return Array.isArray(respuesta.data) ? respuesta.data : [];
  },

  crearPresentacion: async (datos: {
    producto_id: number;
    nombre: string;
    cantidad_unidades: number;
    precio?: number | string | null;
    tipo_precio: string;
    estado_verificacion_precio: string;
    es_predeterminada?: boolean;
  }) => {
    const respuesta = await clienteApi.post<PresentacionProducto>('/productos/presentaciones/', datos);
    return respuesta.data;
  },

  eliminarPresentacion: async (id: number) => {
    const respuesta = await clienteApi.delete(`/productos/presentaciones/${id}/`);
    return respuesta.data;
  },

  actualizarPresentacion: async (id: number, datos: Partial<PresentacionProducto>) => {
    const respuesta = await clienteApi.patch<PresentacionProducto>(`/productos/presentaciones/${id}/`, datos);
    return respuesta.data;
  },
};
