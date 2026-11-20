import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface PropiedadesModal {
  abierto: boolean;
  alCerrar: () => void;
  titulo?: string;
  subtitulo?: string;
  children: React.ReactNode;
  anchoMaximo?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<PropiedadesModal> = ({
  abierto,
  alCerrar,
  titulo,
  subtitulo,
  children,
  anchoMaximo = 'lg',
}) => {
  useEffect(() => {
    const alPresionarEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') alCerrar();
    };
    if (abierto) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', alPresionarEsc);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', alPresionarEsc);
    };
  }, [abierto, alCerrar]);

  if (!abierto) return null;

  const anchos = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  const tieneCabecera = Boolean(titulo || subtitulo);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 overflow-y-auto">
      {/* Fondo oscuro traslúcido con desenfoque */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={alCerrar}
      ></div>

      {/* Contenedor del diálogo */}
      <div
        className={`relative bg-white rounded-2xl sm:rounded-3xl shadow-elevada w-full ${anchos[anchoMaximo]} z-10 overflow-hidden transform transition-all my-auto sm:my-6 max-h-[94vh] sm:max-h-[90vh] flex flex-col border border-rosa-100 animate-in fade-in zoom-in-95 duration-200`}
      >
        {/* Cabecera del modal */}
        {tieneCabecera ? (
          <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-100 shrink-0">
            <div className="pr-2 min-w-0">
              {titulo && <h3 className="font-serif text-lg sm:text-2xl font-bold text-texto-principal truncate">{titulo}</h3>}
              {subtitulo && <p className="text-xs sm:text-sm text-texto-secundario mt-0.5 truncate">{subtitulo}</p>}
            </div>
            <button
              onClick={alCerrar}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-rosa-600 hover:bg-rosa-50 transition shrink-0"
              aria-label="Cerrar ventana"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          /* Si no hay título en la cabecera, botón de cierre flotante elegante */
          <button
            onClick={alCerrar}
            className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-30 w-8 h-8 rounded-full bg-white/95 backdrop-blur-md shadow-sm border border-gray-100 flex items-center justify-center text-gray-500 hover:text-rosa-600 hover:bg-rosa-50 transition"
            aria-label="Cerrar ventana"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Cuerpo con scroll optimizado para móviles */}
        <div className="p-3.5 sm:p-6 overflow-y-auto flex-1 overscroll-contain">
          {children}
        </div>
      </div>
    </div>
  );
};

