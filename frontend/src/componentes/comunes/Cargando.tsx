import React from 'react';

export const Cargando: React.FC<{ texto?: string; pantallaCompleta?: boolean }> = ({
  texto = 'Cargando deliciosos momentos...',
  pantallaCompleta = false,
}) => {
  const contenido = (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="relative w-16 h-16">
        <div className="w-16 h-16 rounded-full border-4 border-rosa-100 border-t-rosa-500 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-rosa-500 font-serif font-bold text-lg">
          S
        </div>
      </div>
      <p className="mt-4 text-texto-secundario text-sm font-medium animate-pulse">{texto}</p>
    </div>
  );

  if (pantallaCompleta) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {contenido}
      </div>
    );
  }

  return contenido;
};

