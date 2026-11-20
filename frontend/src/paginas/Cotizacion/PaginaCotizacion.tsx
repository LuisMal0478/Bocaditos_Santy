import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  MessageCircle,
  Calendar,
  Users,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { RUTAS, TIPOS_EVENTO } from '../../utilidades/constantes';
import { useCotizacion } from '../../contextos/almacen_cotizacion';
import { formatearMoneda } from '../../utilidades/formateadores';
import { servicioCotizaciones } from '../../servicios/servicio_cotizaciones';
import { Boton } from '../../componentes/comunes/Boton';
import { MensajeAlerta } from '../../componentes/comunes/MensajeAlerta';
import { RespuestaCotizacionExitosa } from '../../tipos/cotizacion';

// Esquema de validación con Zod
const hoyStr = new Date().toISOString().split('T')[0];

const esquemaCotizacion = z.object({
  nombre_cliente: z.string().min(3, 'El nombre debe tener al menos 3 caracteres.'),
  telefono_whatsapp: z
    .string()
    .min(7, 'Ingrese un número de teléfono o WhatsApp válido.')
    .regex(/^[0-9+\s()-]+$/, 'Formato de teléfono no válido.'),
  correo_electronico: z.string().email('Correo no válido').optional().or(z.literal('')),
  tipo_evento: z.string().min(1, 'Seleccione el tipo de evento.'),
  fecha_evento: z.string().refine((val) => val >= hoyStr, {
    message: 'La fecha del evento debe ser hoy o una fecha futura.',
  }),
  lugar_evento: z.string().optional(),
  cantidad_invitados: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  observaciones: z.string().optional(),
  acepta_politica_privacidad: z.boolean().refine((val) => val === true, {
    message: 'Debe aceptar el tratamiento de datos de contacto.',
  }),
  campo_control_trampa: z.string().optional(), // Honeypot anti-spam
});

type FormularioDatos = z.infer<typeof esquemaCotizacion>;

export const PaginaCotizacion: React.FC = () => {
  const {
    items,
    actualizarCantidad,
    eliminarItem,
    vaciarCotizacion,
    obtenerTotalPresentaciones,
    obtenerTotalUnidades,
    obtenerSubtotalEstimado,
  } = useCotizacion();

  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null);
  const [cotizacionExitosa, setCotizacionExitosa] = useState<RespuestaCotizacionExitosa | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormularioDatos>({
    resolver: zodResolver(esquemaCotizacion),
    defaultValues: {
      tipo_evento: TIPOS_EVENTO[0],
      acepta_politica_privacidad: true,
      fecha_evento: hoyStr,
      campo_control_trampa: '',
    },
  });

  const totalPresentaciones = obtenerTotalPresentaciones();
  const totalUnidades = obtenerTotalUnidades();
  const { subtotal, tienePendientes } = obtenerSubtotalEstimado();

  const alEnviarFormulario = async (datos: FormularioDatos) => {
    if (items.length === 0) {
      setErrorEnvio('Debe seleccionar al menos un producto para cotizar.');
      return;
    }

    setEnviando(true);
    setErrorEnvio(null);

    try {
      const itemsEnvio = items.map((item) => ({
        producto_id: item.producto.id,
        presentacion_id: item.presentacion.id,
        opcion_variante_id: item.variante?.id || null,
        cantidad: item.cantidad,
        observaciones: item.observaciones || '',
      }));

      const respuesta = await servicioCotizaciones.crear({
        ...datos,
        items: itemsEnvio,
      });

      // Guardar respuesta exitosa
      setCotizacionExitosa(respuesta.datos);

      // Vaciar carrito
      vaciarCotizacion();

      // Abrir WhatsApp en pestaña nueva
      if (respuesta.datos.url_whatsapp) {
        window.open(respuesta.datos.url_whatsapp, '_blank');
      }
    } catch (error: any) {
      const mensaje = error.response?.data?.mensaje || 'No fue posible registrar la cotización. Intente nuevamente.';
      setErrorEnvio(mensaje);
    } finally {
      setEnviando(false);
    }
  };

  // Pantalla de Confirmación Exitosa
  if (cotizacionExitosa) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl border border-rosa-200 p-8 sm:p-12 shadow-elevada space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold text-rosa-500 uppercase tracking-widest">
              Solicitud Registrada con Éxito
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-texto-principal mt-1">
              ¡Gracias, {cotizacionExitosa.nombre_cliente}!
            </h1>
            <p className="text-texto-secundario text-sm sm:text-base mt-2">
              Tu cotización ha sido guardada en nuestro sistema con el código:
            </p>
            <div className="inline-block mt-3 px-5 py-2 rounded-full bg-rosa-50 border border-rosa-200 font-mono font-bold text-lg text-rosa-700">
              {cotizacionExitosa.codigo_seguimiento}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-rosa-50/50 border border-rosa-100 text-left text-xs sm:text-sm text-texto-secundario space-y-1.5 max-w-lg mx-auto">
            <p><strong>Evento:</strong> {cotizacionExitosa.tipo_evento}</p>
            <p><strong>Fecha:</strong> {cotizacionExitosa.fecha_evento}</p>
            <p><strong>Total de productos:</strong> {cotizacionExitosa.total_items} items seleccionados</p>
          </div>

          <div className="space-y-3 pt-2">
            <p className="text-xs text-texto-secundario">
              Si no se abrió la ventana de WhatsApp automáticamente, haz clic en el siguiente botón:
            </p>
            <a
              href={cotizacionExitosa.url_whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-md transition active:scale-95"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Abrir WhatsApp con mi cotización</span>
            </a>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <Link to={RUTAS.CATALOGO}>
              <Boton variante="secundario" tamano="md">
                Volver al catálogo
              </Boton>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Estado Carrito Vacío
  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-rosa-100 text-rosa-500 flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-texto-principal">
          Tu lista de cotización está vacía
        </h2>
        <p className="text-texto-secundario text-sm sm:text-base mt-2 max-w-md mx-auto">
          Aún no has agregado pasabocas a tu cotización. Explora nuestro catálogo y selecciona las preparaciones ideales para tu evento.
        </p>
        <div className="mt-8">
          <Link to={RUTAS.CATALOGO}>
            <Boton variante="primario" tamano="lg" icono={<ArrowRight className="w-5 h-5" />}>
              Explorar el catálogo
            </Boton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-texto-principal">
          Mi Cotización
        </h1>
        <p className="text-sm text-texto-secundario mt-1">
          Revisa tus productos seleccionados y completa los datos de tu evento para cotizar directamente por WhatsApp.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Columna Izquierda: Lista de Productos Seleccionados */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl border border-rosa-100 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <span className="font-serif font-bold text-lg text-texto-principal">
                Productos seleccionados ({items.length})
              </span>
              <button
                onClick={vaciarCotizacion}
                className="text-xs text-red-500 hover:text-red-700 font-semibold transition"
              >
                Vaciar lista
              </button>
            </div>

            <div className="divide-y divide-gray-100">
              {items.map((item) => {
                const esConfirmado = item.presentacion.estado_verificacion_precio === 'CONFIRMADO';
                const esFijo = item.presentacion.tipo_precio === 'FIJO';
                const precioNum = typeof item.presentacion.precio === 'string'
                  ? parseFloat(item.presentacion.precio)
                  : item.presentacion.precio;
                const tienePrecio = esConfirmado && esFijo && precioNum;

                return (
                  <div key={item.idUnico} className="py-4 flex gap-4 items-center">
                    {/* Foto */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-rosa-50 shrink-0 border border-rosa-100">
                      <img
                        src={item.producto.imagen_url || '/placeholder.jpg'}
                        alt={item.producto.nombre}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Información */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif font-bold text-sm text-texto-principal truncate">
                        {item.producto.nombre}
                      </h4>
                      <p className="text-xs text-texto-secundario mt-0.5">
                        {item.presentacion.nombre}
                        {item.variante ? ` • ${item.variante.nombre}` : ''}
                      </p>
                      <p className="text-xs text-rosa-600 font-semibold mt-1">
                        {tienePrecio ? formatearMoneda(Number(precioNum) * item.cantidad) : 'Precio por cotizar'}
                      </p>
                    </div>

                    {/* Controles de Cantidad */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => actualizarCantidad(item.idUnico, item.cantidad - 1)}
                        className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-rosa-400 hover:text-rosa-600 transition"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-texto-principal">
                        {item.cantidad}
                      </span>
                      <button
                        type="button"
                        onClick={() => actualizarCantidad(item.idUnico, item.cantidad + 1)}
                        className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-rosa-400 hover:text-rosa-600 transition"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Botón Eliminar */}
                    <button
                      type="button"
                      onClick={() => eliminarItem(item.idUnico)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition shrink-0"
                      title="Eliminar de la cotización"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Resumen de totales */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between gap-2 text-xs sm:text-sm text-texto-secundario">
              <span>Total paquetes: <strong>{totalPresentaciones}</strong></span>
              <span>Total unidades aproximadas: <strong>{totalUnidades} piezas</strong></span>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Formulario de Información del Evento */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl border border-rosa-200 p-6 sm:p-8 shadow-tarjeta sticky top-28">
            <h3 className="font-serif font-bold text-xl text-texto-principal mb-1">
              Datos de tu celebración
            </h3>
            <p className="text-xs text-texto-secundario mb-6">
              Para organizar tu propuesta personalizada antes de abrir WhatsApp.
            </p>

            {errorEnvio && (
              <MensajeAlerta
                tipo="error"
                mensaje={errorEnvio}
                className="mb-4"
                alCerrar={() => setErrorEnvio(null)}
              />
            )}

            <form onSubmit={handleSubmit(alEnviarFormulario)} className="space-y-4 text-sm">
              
              {/* Campo Trampa Anti-Spam (Honeypot) */}
              <input
                type="text"
                {...register('campo_control_trampa')}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              {/* Nombre del Cliente */}
              <div>
                <label className="block text-xs font-bold text-texto-principal uppercase tracking-wider mb-1">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Carolina Gómez"
                  {...register('nombre_cliente')}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rosa-400 transition"
                />
                {errors.nombre_cliente && (
                  <p className="text-xs text-red-500 mt-1">{errors.nombre_cliente.message}</p>
                )}
              </div>

              {/* Teléfono / WhatsApp */}
              <div>
                <label className="block text-xs font-bold text-texto-principal uppercase tracking-wider mb-1">
                  Número de WhatsApp *
                </label>
                <input
                  type="tel"
                  placeholder="Ej: 3101234567"
                  {...register('telefono_whatsapp')}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rosa-400 transition"
                />
                {errors.telefono_whatsapp && (
                  <p className="text-xs text-red-500 mt-1">{errors.telefono_whatsapp.message}</p>
                )}
              </div>

              {/* Tipo de Evento */}
              <div>
                <label className="block text-xs font-bold text-texto-principal uppercase tracking-wider mb-1">
                  Tipo de evento *
                </label>
                <select
                  {...register('tipo_evento')}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-rosa-400 transition text-sm"
                >
                  {TIPOS_EVENTO.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fecha y Lugar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-texto-principal uppercase tracking-wider mb-1">
                    Fecha del evento *
                  </label>
                  <input
                    type="date"
                    min={hoyStr}
                    {...register('fecha_evento')}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rosa-400 transition text-xs"
                  />
                  {errors.fecha_evento && (
                    <p className="text-xs text-red-500 mt-1">{errors.fecha_evento.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-texto-principal uppercase tracking-wider mb-1">
                    Invitados aprox.
                  </label>
                  <input
                    type="number"
                    placeholder="Ej: 50"
                    min="1"
                    {...register('cantidad_invitados')}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rosa-400 transition text-xs"
                  />
                </div>
              </div>

              {/* Lugar / Municipio */}
              <div>
                <label className="block text-xs font-bold text-texto-principal uppercase tracking-wider mb-1">
                  Lugar o municipio del evento
                </label>
                <input
                  type="text"
                  placeholder="Ej: Salón social / Bogotá / Chía"
                  {...register('lugar_evento')}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rosa-400 transition"
                />
              </div>

              {/* Observaciones */}
              <div>
                <label className="block text-xs font-bold text-texto-principal uppercase tracking-wider mb-1">
                  Observaciones o requerimientos
                </label>
                <textarea
                  rows={2}
                  placeholder="Ej: Requerimos entrega a las 4:00 PM..."
                  {...register('observaciones')}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rosa-400 transition text-xs resize-none"
                ></textarea>
              </div>

              {/* Checkbox de Privacidad */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="privacidad"
                  {...register('acepta_politica_privacidad')}
                  className="mt-1 rounded text-rosa-500 focus:ring-rosa-400"
                />
                <label htmlFor="privacidad" className="text-xs text-texto-secundario leading-relaxed cursor-pointer">
                  Acepto el tratamiento de mis datos de contacto únicamente para la elaboración y envío de esta cotización.
                </label>
              </div>
              {errors.acepta_politica_privacidad && (
                <p className="text-xs text-red-500">{errors.acepta_politica_privacidad.message}</p>
              )}

              {/* Botón de Envío */}
              <div className="pt-4">
                <Boton
                  type="submit"
                  variante="primario"
                  tamano="lg"
                  cargando={enviando}
                  className="w-full shadow-md gap-2"
                  icono={<MessageCircle className="w-5 h-5" />}
                >
                  Solicitar cotización por WhatsApp
                </Boton>
                <p className="text-[11px] text-texto-secundario text-center mt-2.5">
                  ✨ Tu solicitud se registrará de forma segura antes de abrir WhatsApp.
                </p>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

