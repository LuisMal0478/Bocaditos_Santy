import React from 'react';
import { Categoria } from '../../tipos/categoria';

export interface PropiedadesFiltroCategorias {
  categorias: Categoria[];
  categoriaSeleccionada: string | null; // slug o null para 'todos'
  alSeleccionarCategoria: (slug: string | null) => void;
}

export const FiltroCategorias: React.FC<PropiedadesFiltroCategorias> = ({
  categorias,
  categoriaSeleccionada,
  alSeleccionarCategoria,
}) => {
  return (
    <div className="w-full min-w-0">
      {/* Contenedor flexible que se ajusta a la pantalla sin salirse en celulares */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => alSeleccionarCategoria(null)}
          className={`px-3.5 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all shadow-xs ${
            categoriaSeleccionada === null
              ? 'bg-orange-500 text-white shadow-md ring-2 ring-orange-300'
              : 'bg-white text-texto-secundario hover:text-orange-600 hover:bg-orange-50 border border-orange-100'
          }`}
        >
          ✦ Todos los pasabocas
        </button>

        {categorias.map((cat) => (
          <button
            key={cat.id}
            onClick={() => alSeleccionarCategoria(cat.slug)}
            className={`px-3.5 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all shadow-xs ${
              categoriaSeleccionada === cat.slug
                ? 'bg-orange-500 text-white shadow-md ring-2 ring-orange-300'
                : 'bg-white text-texto-secundario hover:text-orange-600 hover:bg-orange-50 border border-orange-100'
            }`}
          >
            {cat.nombre}
          </button>
        ))}
      </div>
    </div>
  );
};


