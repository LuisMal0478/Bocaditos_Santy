import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { RUTAS } from '../../utilidades/constantes';
import { useCotizacion } from '../../contextos/almacen_cotizacion';
import { formatearMoneda } from '../../utilidades/formateadores';

export const BarraFlotanteCotizacion: React.FC = () => {
  const ubicacion = useLocation();
  const { obtenerSubtotalEstimado, obtenerTotalPresentaciones } = useCotizacion();

  // No mostrar en la propia página de cotización o administración
  if (ubicacion.pathname === RUTAS.COTIZACION || ubicacion.pathname.startsWith('/administracion')) {
    return null;
  }

  const totalItems = obtenerTotalPresentaciones();
  if (totalItems === 0) return null;

  const { subtotal } = obtenerSubtotalEstimado();

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-md w-[92%] sm:w-auto animate-in fade-in slide-in-from-bottom-5 duration-300">
      <Link
        to={RUTAS.COTIZACION}
        className="flex items-center justify-between gap-4 px-5 py-3 rounded-full bg-texto-principal/95 hover:bg-black text-white shadow-2xl backdrop-blur-md border border-rosa-400/40 transition-all transform hover:scale-105 active:scale-95 group"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-rosa-500 text-white flex items-center justify-center font-bold text-xs shrink-0 animate-pulse">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold block text-white leading-tight">
              {totalItems} {totalItems === 1 ? 'producto seleccionado' : 'productos seleccionados'}
            </span>
            <span className="text-[11px] text-rosa-300">
              {subtotal > 0 ? `Subtotal aprox: ${formatearMoneda(subtotal)}` : 'Lista para cotizar'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold text-rosa-400 group-hover:text-rosa-300 pl-2 border-l border-white/20 whitespace-nowrap">
          <span>Ver mi cotización</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </Link>
    </div>
  );
};
