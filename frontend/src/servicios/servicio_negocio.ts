import { clienteApi } from './cliente_api';
import { ConfiguracionNegocio } from '../tipos/negocio';

export const servicioNegocio = {
  obtener: async () => {
    const respuesta = await clienteApi.get<ConfiguracionNegocio>('/negocio/');
    return respuesta.data;
  },

  actualizar: async (datos: Partial<ConfiguracionNegocio> | FormData) => {
    const esFormData = typeof FormData !== 'undefined' && datos instanceof FormData;
    const respuesta = await clienteApi.patch<ConfiguracionNegocio>('/negocio/', datos, {
      headers: esFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
    return respuesta.data;
  },
};

