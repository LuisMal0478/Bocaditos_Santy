import axios, { AxiosError } from 'axios';

// En producción en Vercel se puede definir VITE_API_BASE_URL con la URL de la nube.
// En desarrollo local se utiliza por defecto '/api' que conecta al proxy de Vite.
const urlBase = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/+$/, '');

export const clienteApi = axios.create({
  baseURL: urlBase,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de peticiones para inyectar token de autenticación
clienteApi.interceptors.request.use((configuracion) => {
  const token = localStorage.getItem('token_acceso_bocaditos');
  if (token && configuracion.headers) {
    configuracion.headers.Authorization = `Bearer ${token}`;
  }
  return configuracion;
});

// Interceptor de respuestas para manejo centralizado de errores
clienteApi.interceptors.response.use(
  (respuesta) => respuesta,
  (error: AxiosError<{ estado?: string; codigo_error?: string; mensaje?: string; detalles?: any }>) => {
    if (error.response?.status === 401) {
      // Si el token expiró en una ruta administrativa
      if (window.location.pathname.startsWith('/administracion') && !window.location.pathname.includes('/iniciar-sesion')) {
        localStorage.removeItem('token_acceso_bocaditos');
        localStorage.removeItem('usuario_bocaditos');
        window.location.href = '/administracion/iniciar-sesion';
      }
    }
    return Promise.reject(error);
  }
);

