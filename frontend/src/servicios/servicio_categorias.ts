import { clienteApi } from './cliente_api';
import { Categoria } from '../tipos/categoria';

export const servicioCategorias = {
  obtenerTodas: async () => {
    const respuesta = await clienteApi.get<{ results?: Categoria[] } | Categoria[]>('/categorias/');
    if ('results' in respuesta.data && Array.isArray(respuesta.data.results)) {
      return respuesta.data.results;
    }
    return Array.isArray(respuesta.data) ? respuesta.data : [];
  },

  obtenerTodasAdmin: async () => {
    const respuesta = await clienteApi.get<{ results?: Categoria[] } | Categoria[]>('/categorias/', {
      params: { todas: true },
    });
    if ('results' in respuesta.data && Array.isArray(respuesta.data.results)) {
      return respuesta.data.results;
    }
    return Array.isArray(respuesta.data) ? respuesta.data : [];
  },

  crear: async (datos: Partial<Categoria>) => {
    const respuesta = await clienteApi.post<Categoria>('/categorias/', datos);
    return respuesta.data;
  },

  actualizar: async (id: number, datos: Partial<Categoria>) => {
    const respuesta = await clienteApi.patch<Categoria>(`/categorias/${id}/`, datos);
    return respuesta.data;
  },

  eliminar: async (id: number) => {
    const respuesta = await clienteApi.delete<{ estado: string; mensaje: string }>(`/categorias/${id}/`);
    return respuesta.data;
  },

  alternarActiva: async (id: number) => {
    const respuesta = await clienteApi.patch<{ estado: string; mensaje: string; esta_activa: boolean }>(
      `/categorias/${id}/alternar-activa/`
    );
    return respuesta.data;
  },
};
