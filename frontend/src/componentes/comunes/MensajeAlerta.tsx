import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export interface PropiedadesMensajeAlerta {
  tipo?: 'exito' | 'error' | 'advertencia' | 'info';
  titulo?: string;
  mensaje: string;
  alCerrar?: () => void;
  className?: string;
}

export const MensajeAlerta: React.FC<PropiedadesMensajeAlerta> = ({
  tipo = 'info',
  titulo,
  mensaje,
  alCerrar,
  className = '',
}) => {
  const estilos = {
    exito: {
      fondo: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      icono: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    },
    error: {
      fondo: 'bg-red-50 border-red-200 text-red-800',
      icono: <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />,
    },
    advertencia: {
      fondo: 'bg-amber-50 border-amber-200 text-amber-800',
      icono: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
    },
    info: {
      fondo: 'bg-rosa-50 border-rosa-200 text-rosa-900',
      icono: <Info className="w-5 h-5 text-rosa-600 shrink-0" />,
    },
  }[tipo];

  return (
    <div className={`border rounded-2xl p-4 flex items-start gap-3 transition-all ${estilos.fondo} ${className}`}>
      {estilos.icono}
      <div className="flex-1 text-sm">
        {titulo && <h5 className="font-semibold mb-0.5">{titulo}</h5>}
        <p className="leading-relaxed">{mensaje}</p>
      </div>
      {alCerrar && (
        <button
          onClick={alCerrar}
          className="text-gray-400 hover:text-gray-700 transition p-0.5 rounded-lg"
          aria-label="Cerrar alerta"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

