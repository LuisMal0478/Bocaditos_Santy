import React from 'react';
import { Plus, Eye, Sparkles, Star } from 'lucide-react';
import { ProductoLista } from '../../tipos/producto';
import { formatearMoneda } from '../../utilidades/formateadores';
import { obtenerUrlImagen, manejarErrorImagen } from '../../utilidades/imagenes';

export interface PropiedadesTarjetaProducto {
  producto: ProductoLista;
  alVerDetalles: (producto: ProductoLista) => void;
  alAgregarDirecto?: (producto: ProductoLista) => void;
}

export const TarjetaProducto: React.FC<PropiedadesTarjetaProducto> = ({
  producto,
  alVerDetalles,
  alAgregarDirecto,
}) => {
  const pres = producto.presentacion_predeterminada;
  const esConfirmado = pres?.estado_verificacion_precio === 'CONFIRMADO';
  const esFijo = pres?.tipo_precio === 'FIJO';
  const tienePrecioDefinitivo = esConfirmado && esFijo && pres?.precio;

  return (
    <div className="group bg-white rounded-3xl border border-orange-100/90 shadow-sm hover:shadow-elevada hover:-translate-y-1.5 transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Contenedor Fotográfico con Zoom y Vista Rápida */}
      <div
        className="relative aspect-[4/3] bg-gradient-to-tr from-orange-50 to-amber-50/50 overflow-hidden cursor-pointer"
        onClick={() => alVerDetalles(producto)}
      >
        <img
          src={obtenerUrlImagen(producto.imagen_url)}
          alt={producto.nombre}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
          loading="lazy"
          onError={manejarErrorImagen}
        />
        
        {/* Degradado sutil para resaltar textos e insignias */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Insignias Superiores */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-white/95 backdrop-blur-md text-orange-800 border border-orange-200/80 shadow-xs">
            {producto.categoria_nombre}
          </span>
          {producto.esta_destacado && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-orange-500 text-white shadow-xs backdrop-blur-sm">
              <Star className="w-3 h-3 fill-current" />
              <span>Destacado</span>
            </span>
          )}
        </div>

        {/* Botón flotante central de Vista Rápida en hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              alVerDetalles(producto);
            }}
            className="px-4 py-2 rounded-full bg-white/95 backdrop-blur-md text-texto-principal text-xs font-bold shadow-lg flex items-center gap-2 hover:bg-orange-500 hover:text-white transition-all transform hover:scale-105 active:scale-95"
            aria-label={`Ver detalles de ${producto.nombre}`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Vista rápida</span>
          </button>
        </div>
      </div>

      {/* Cuerpo de la Tarjeta */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3
            onClick={() => alVerDetalles(producto)}
            className="font-serif font-bold text-base sm:text-lg text-texto-principal group-hover:text-orange-600 transition-colors cursor-pointer line-clamp-1 leading-snug"
          >
            {producto.nombre}
          </h3>
          <p className="text-xs text-texto-secundario mt-1 line-clamp-2 leading-relaxed">
            {producto.descripcion || 'Exquisito pasaboca preparado artesanalmente para celebrar tus momentos felices.'}
          </p>
        </div>

        {/* Presentación y Precio */}
        <div className="mt-3.5 pt-3 border-t border-orange-50">
          <div className="flex items-center justify-between mb-2 text-xs">
            <span className="text-texto-secundario font-medium">
              {pres ? pres.nombre : 'Presentación a cotizar'}
            </span>
            {pres && pres.cantidad_unidades > 1 && (
              <span className="font-extrabold text-orange-700 bg-orange-100/80 border border-orange-200/80 px-2 py-0.5 rounded-lg text-[10px]">
                x{pres.cantidad_unidades} unid
              </span>
            )}
          </div>

          <div className="flex items-center justify-between gap-3">
            <div>
              {tienePrecioDefinitivo ? (
                <div className="text-base sm:text-lg font-serif font-extrabold text-texto-principal">
                  {formatearMoneda(pres?.precio)}
                </div>
              ) : (
                <span className="text-xs font-bold text-orange-600 italic">
                  Sujeto a cotización
                </span>
              )}
            </div>

            <button
              onClick={() => {
                if (producto.tiene_variantes || producto.total_presentaciones > 1) {
                  alVerDetalles(producto);
                } else if (alAgregarDirecto) {
                  alAgregarDirecto(producto);
                } else {
                  alVerDetalles(producto);
                }
              }}
              className="px-4 py-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm hover:shadow-md active:scale-95 transition-all transform hover:scale-105"
              title="Agregar a mi cotización"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Cotizar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
