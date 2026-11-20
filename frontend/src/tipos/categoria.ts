export interface Categoria {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string;
  imagen_url: string;
  imagen_id_publico?: string;
  orden: number;
  esta_activa: boolean;
  total_productos?: number;
  fecha_creacion?: string;
}

