export interface Usuario {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  nombre_completo: string;
  is_staff: boolean;
}

export interface RespuestaAutenticacion {
  access: string;
  refresh: string;
  usuario: Usuario;
}

