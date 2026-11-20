import { clienteApi } from './cliente_api';
import { RespuestaAutenticacion, Usuario } from '../tipos/usuario';

export interface DatosCambioCredenciales {
  username?: string;
  first_name?: string;
  email?: string;
  clave_actual: string;
  clave_nueva?: string;
  confirmar_clave_nueva?: string;
}

export interface RespuestaCambioCredenciales {
  estado: string;
  mensaje: string;
  cambio_clave: boolean;
  usuario: Usuario;
  access: string;
  refresh: string;
}

export const servicioAutenticacion = {
  iniciarSesion: async (nombreUsuario: string, clave: string) => {
    const respuesta = await clienteApi.post<RespuestaAutenticacion>('/usuarios/iniciar-sesion/', {
      username: nombreUsuario,
      password: clave,
    });
    return respuesta.data;
  },

  obtenerPerfil: async () => {
    const respuesta = await clienteApi.get<Usuario>('/usuarios/perfil/');
    return respuesta.data;
  },

  cambiarCredenciales: async (datos: DatosCambioCredenciales) => {
    const respuesta = await clienteApi.post<RespuestaCambioCredenciales>('/usuarios/cambiar-credenciales/', datos);
    if (respuesta.data.access) {
      localStorage.setItem('token_acceso_bocaditos', respuesta.data.access);
    }
    if (respuesta.data.usuario) {
      localStorage.setItem('usuario_bocaditos', JSON.stringify(respuesta.data.usuario));
    }
    return respuesta.data;
  },
};

