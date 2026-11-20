import React from 'react';

export interface PropiedadesBoton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: 'primario' | 'secundario' | 'contorno' | 'fantasma' | 'peligro';
  tamano?: 'sm' | 'md' | 'lg';
  cargando?: boolean;
  icono?: React.ReactNode;
}

export const Boton: React.FC<PropiedadesBoton> = ({
  children,
  variante = 'primario',
  tamano = 'md',
  cargando = false,
  icono,
  disabled,
  className = '',
  ...resto
}) => {
  const estilosBase = 'inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantes = {
    primario: 'bg-rosa-500 text-white hover:bg-rosa-600 focus:ring-rosa-400 shadow-sm hover:shadow active:scale-95',
    secundario: 'bg-rosa-100 text-rosa-800 hover:bg-rosa-200 focus:ring-rosa-300 active:scale-95',
    contorno: 'border-2 border-rosa-500 text-rosa-600 hover:bg-rosa-50 focus:ring-rosa-400 active:scale-95',
    fantasma: 'text-texto-principal hover:text-rosa-600 hover:bg-rosa-50 focus:ring-rosa-200',
    peligro: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-400 active:scale-95',
  };

  const tamanos = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-7 py-3.5 gap-2.5 font-semibold',
  };

  return (
    <button
      className={`${estilosBase} ${variantes[variante]} ${tamanos[tamano]} ${className}`}
      disabled={disabled || cargando}
      {...resto}
    >
      {cargando ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
      ) : icono ? (
        <span className="shrink-0">{icono}</span>
      ) : null}
      <span>{children}</span>
    </button>
  );
};

