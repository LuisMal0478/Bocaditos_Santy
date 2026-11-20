import React from 'react';

export interface PropiedadesInsignia {
  children: React.ReactNode;
  variante?: 'rosa' | 'verde' | 'amarillo' | 'gris' | 'azul';
  tamano?: 'sm' | 'md';
  className?: string;
}

export const Insignia: React.FC<PropiedadesInsignia> = ({
  children,
  variante = 'rosa',
  tamano = 'sm',
  className = '',
}) => {
  const estilosBase = 'inline-flex items-center font-medium rounded-full';

  const variantes = {
    rosa: 'bg-rosa-100 text-rosa-700 border border-rosa-200',
    verde: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    amarillo: 'bg-amber-50 text-amber-800 border border-amber-200',
    gris: 'bg-gray-100 text-gray-700 border border-gray-200',
    azul: 'bg-sky-50 text-sky-700 border border-sky-200',
  };

  const tamanos = {
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-sm px-3 py-1',
  };

  return (
    <span className={`${estilosBase} ${variantes[variante]} ${tamanos[tamano]} ${className}`}>
      {children}
    </span>
  );
};

