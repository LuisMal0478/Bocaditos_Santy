import { create } from 'zustand';
import { Usuario } from '../tipos/usuario';

interface EstadoAutenticacionStore {
  token: string | null;
  usuario: Usuario | null;
  estaAutenticado: boolean;
  iniciarSesion: (token: string, usuario: Usuario) => void;
  actualizarUsuario: (usuario: Usuario, nuevoToken?: string) => void;
  cerrarSesion: () => void;
}

export const useAutenticacion = create<EstadoAutenticacionStore>((set) => {
  const tokenGuardado = localStorage.getItem('token_acceso_bocaditos');
  const usuarioGuardado = localStorage.getItem('usuario_bocaditos');

  let usuarioInicial: Usuario | null = null;
  if (usuarioGuardado) {
    try {
      usuarioInicial = JSON.parse(usuarioGuardado);
    } catch {
      usuarioInicial = null;
    }
  }

  return {
    token: tokenGuardado,
    usuario: usuarioInicial,
    estaAutenticado: Boolean(tokenGuardado && usuarioInicial?.is_staff),

    iniciarSesion: (token, usuario) => {
      localStorage.setItem('token_acceso_bocaditos', token);
      localStorage.setItem('usuario_bocaditos', JSON.stringify(usuario));
      set({
        token,
        usuario,
        estaAutenticado: Boolean(usuario.is_staff),
      });
    },

    actualizarUsuario: (usuario, nuevoToken) => {
      localStorage.setItem('usuario_bocaditos', JSON.stringify(usuario));
      if (nuevoToken) {
        localStorage.setItem('token_acceso_bocaditos', nuevoToken);
      }
      set((state) => ({
        usuario,
        token: nuevoToken || state.token,
        estaAutenticado: Boolean(usuario.is_staff),
      }));
    },

    cerrarSesion: () => {
      localStorage.removeItem('token_acceso_bocaditos');
      localStorage.removeItem('usuario_bocaditos');
      set({
        token: null,
        usuario: null,
        estaAutenticado: false,
      });
    },
  };
});

