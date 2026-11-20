import React, { useState, useEffect } from 'react';
import { ShoppingBag, Check, Plus, Minus, AlertCircle } from 'lucide-react';
import { Modal } from '../comunes/Modal';
import { Boton } from '../comunes/Boton';
import { Insignia } from '../comunes/Insignia';
import { ProductoDetalle, PresentacionProducto, OpcionVariante } from '../../tipos/producto';
import { formatearMoneda } from '../../utilidades/formateadores';
import { useCotizacion } from '../../contextos/almacen_cotizacion';

export interface PropiedadesModalDetalleProducto {
  producto: ProductoDetalle | null;
  abierto: boolean;
  alCerrar: () => void;
}

export const ModalDetalleProducto: React.FC<PropiedadesModalDetalleProducto> = ({
  producto,
  abierto,
  alCerrar,
}) => {
  const { agregarItem } = useCotizacion();

  const [presentacionSeleccionada, setPresentacionSeleccionada] = useState<PresentacionProducto | null>(null);
  const [varianteSeleccionada, setVarianteSeleccionada] = useState<OpcionVariante | null>(null);
  const [cantidad, setCantidad] = useState(1);
  const [nota, setNota] = useState('');
  const [mensajeExito, setMensajeExito] = useState(false);
  const [errorValidacion, setErrorValidacion] = useState<string | null>(null);

  useEffect(() => {
    if (producto) {
      // Seleccionar presentación predeterminada
      const pred = producto.presentaciones.find((p) => p.es_predeterminada) || producto.presentaciones[0] || null;
      setPresentacionSeleccionada(pred);

      // Si tiene variantes obligatorias, preseleccionar la primera opción
      const primerGrupo = producto.grupos_variantes[0];
      if (primerGrupo && primerGrupo.opciones.length > 0) {
        setVarianteSeleccionada(primerGrupo.opciones[0]);
      } else {
        setVarianteSeleccionada(null);
      }

      setCantidad(1);
      setNota('');
      setMensajeExito(false);
      setErrorValidacion(null);
    }
  }, [producto]);

  if (!producto) return null;

  const tieneGrupoObligatorio = producto.grupos_variantes.some((g) => g.es_obligatorio);

  const alAgregar = () => {
    if (!presentacionSeleccionada) {
      setErrorValidacion('Por favor seleccione una presentación.');
      return;
    }
    if (tieneGrupoObligatorio && !varianteSeleccionada) {
      setErrorValidacion('Por favor elija una opción o sabor requerido.');
      return;
    }

    setErrorValidacion(null);
    agregarItem(producto, presentacionSeleccionada, varianteSeleccionada, cantidad, nota);
    setMensajeExito(true);

    setTimeout(() => {
      setMensajeExito(false);
      alCerrar();
    }, 1200);
  };

  const esFijo = presentacionSeleccionada?.tipo_precio === 'FIJO';
  const esConfirmado = presentacionSeleccionada?.estado_verificacion_precio === 'CONFIRMADO';
  const tienePrecioDefinitivo = esFijo && esConfirmado && presentacionSeleccionada?.precio;

  return (
    <Modal abierto={abierto} alCerrar={alCerrar} anchoMaximo="xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Imagen y Badges */}
        <div className="space-y-2 sm:space-y-3">
          <div className="h-36 sm:h-52 md:h-auto md:aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-rosa-50/60 border border-rosa-100 relative shrink-0">
            <img
              src={producto.imagen_url || '/placeholder.jpg'}
              alt={producto.nombre}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <Insignia variante="rosa">{producto.categoria.nombre}</Insignia>
            {producto.esta_destacado && <Insignia variante="amarillo">Destacado</Insignia>}
          </div>
        </div>

        {/* Detalles y Opciones de Configuración */}
        <div className="flex flex-col justify-between space-y-3.5 sm:space-y-4">
          <div>
            <h2 className="font-serif font-bold text-lg sm:text-2xl text-texto-principal leading-snug">
              {producto.nombre}
            </h2>
            <p className="text-xs sm:text-sm text-texto-secundario mt-1 sm:mt-1.5 leading-relaxed">
              {producto.descripcion || 'Preparado con ingredientes seleccionados para tus celebraciones.'}
            </p>
          </div>

          {/* Selector de Presentación */}
          {producto.presentaciones.length > 0 && (
            <div>
              <label className="block text-[11px] sm:text-xs font-bold text-texto-principal uppercase tracking-wider mb-1.5">
                Presentación de venta:
              </label>
              <div className="space-y-1.5 max-h-36 sm:max-h-none overflow-y-auto pr-0.5">
                {producto.presentaciones.map((p) => {
                  const seleccionada = presentacionSeleccionada?.id === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPresentacionSeleccionada(p)}
                      className={`w-full text-left px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border transition flex items-center justify-between gap-2 ${
                        seleccionada
                          ? 'border-rosa-500 bg-rosa-50/80 text-rosa-900 font-semibold ring-1 ring-rosa-400'
                          : 'border-gray-200 hover:border-rosa-300 text-texto-secundario bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border shrink-0 flex items-center justify-center ${
                            seleccionada ? 'border-rosa-500 bg-rosa-500' : 'border-gray-300'
                          }`}
                        >
                          {seleccionada && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                        </div>
                        <span className="text-xs sm:text-sm truncate">{p.nombre}</span>
                      </div>
                      <span className="text-[11px] sm:text-xs font-semibold shrink-0 text-rosa-600">
                        {p.tipo_precio === 'FIJO' && p.estado_verificacion_precio === 'CONFIRMADO' && p.precio
                          ? formatearMoneda(p.precio)
                          : 'A cotizar'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Selector de Grupo de Variantes (ej. Sabores) */}
          {producto.grupos_variantes.map((grupo) => (
            <div key={grupo.id}>
              <label className="block text-[11px] sm:text-xs font-bold text-texto-principal uppercase tracking-wider mb-1.5">
                {grupo.nombre} {grupo.es_obligatorio ? '(Obligatorio)' : '(Opcional)'}:
              </label>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {grupo.opciones.map((opcion) => {
                  const seleccionada = varianteSeleccionada?.id === opcion.id;
                  return (
                    <button
                      key={opcion.id}
                      type="button"
                      onClick={() => setVarianteSeleccionada(opcion)}
                      className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl border text-xs font-medium transition text-center ${
                        seleccionada
                          ? 'border-rosa-500 bg-rosa-500 text-white font-semibold shadow-xs'
                          : 'border-gray-200 hover:border-rosa-200 text-texto-secundario bg-gray-50/60'
                      }`}
                    >
                      {opcion.nombre}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Cantidad y Precio Estimado */}
          <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between">
            <div>
              <span className="block text-[11px] sm:text-xs text-texto-secundario">Cantidad:</span>
              <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5">
                <button
                  type="button"
                  onClick={() => setCantidad((prev) => Math.max(1, prev - 1))}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-rosa-400 hover:text-rosa-600 transition"
                  aria-label="Disminuir cantidad"
                >
                  <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
                <span className="w-8 sm:w-10 text-center font-bold text-sm sm:text-base text-texto-principal">
                  {cantidad}
                </span>
                <button
                  type="button"
                  onClick={() => setCantidad((prev) => prev + 1)}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-rosa-400 hover:text-rosa-600 transition"
                  aria-label="Aumentar cantidad"
                >
                  <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
              </div>
            </div>

            <div className="text-right">
              <span className="block text-[11px] sm:text-xs text-texto-secundario">Estimado:</span>
              <div className="text-base sm:text-lg font-serif font-bold text-rosa-600 mt-0.5">
                {tienePrecioDefinitivo
                  ? formatearMoneda(Number(presentacionSeleccionada?.precio) * cantidad)
                  : 'A cotizar'}
              </div>
            </div>
          </div>

          {errorValidacion && (
            <div className="flex items-center gap-1.5 text-xs text-red-600">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorValidacion}</span>
            </div>
          )}

          {/* Botón de Acción */}
          <Boton
            variante="primario"
            tamano="md"
            onClick={alAgregar}
            className="w-full py-2.5 sm:py-3 text-xs sm:text-sm"
            icono={mensajeExito ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />}
          >
            {mensajeExito ? '¡Agregado a tu cotización!' : 'Agregar a mi cotización'}
          </Boton>
        </div>
      </div>
    </Modal>
  );
};

