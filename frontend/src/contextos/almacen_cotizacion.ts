import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProductoDetalle, PresentacionProducto, OpcionVariante } from '../tipos/producto';
import { ItemCotizacion } from '../tipos/cotizacion';

interface EstadoCotizacionStore {
  items: ItemCotizacion[];
  agregarItem: (
    producto: ProductoDetalle,
    presentacion: PresentacionProducto,
    variante?: OpcionVariante | null,
    cantidad?: number,
    observaciones?: string
  ) => void;
  eliminarItem: (idUnico: string) => void;
  actualizarCantidad: (idUnico: string, cantidad: number) => void;
  vaciarCotizacion: () => void;
  obtenerTotalPresentaciones: () => number;
  obtenerTotalUnidades: () => number;
  obtenerSubtotalEstimado: () => { subtotal: number; tienePendientes: boolean };
}

export const useCotizacion = create<EstadoCotizacionStore>()(
  persist(
    (set, get) => ({
      items: [],

      agregarItem: (producto, presentacion, variante = null, cantidad = 1, observaciones = '') => {
        const idUnico = `${producto.id}-${presentacion.id}-${variante ? variante.id : 'base'}`;
        const itemsActuales = get().items;
        const indiceExistente = itemsActuales.findIndex((item) => item.idUnico === idUnico);

        if (indiceExistente >= 0) {
          const nuevosItems = [...itemsActuales];
          nuevosItems[indiceExistente].cantidad += cantidad;
          if (observaciones) {
            nuevosItems[indiceExistente].observaciones = observaciones;
          }
          set({ items: nuevosItems });
        } else {
          set({
            items: [
              ...itemsActuales,
              {
                idUnico,
                producto,
                presentacion,
                variante,
                cantidad,
                observaciones,
              },
            ],
          });
        }
      },

      eliminarItem: (idUnico) => {
        set({
          items: get().items.filter((item) => item.idUnico !== idUnico),
        });
      },

      actualizarCantidad: (idUnico, cantidad) => {
        if (cantidad <= 0) {
          get().eliminarItem(idUnico);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.idUnico === idUnico ? { ...item, cantidad } : item
          ),
        });
      },

      vaciarCotizacion: () => {
        set({ items: [] });
      },

      obtenerTotalPresentaciones: () => {
        return get().items.reduce((total, item) => total + item.cantidad, 0);
      },

      obtenerTotalUnidades: () => {
        return get().items.reduce(
          (total, item) => total + item.cantidad * item.presentacion.cantidad_unidades,
          0
        );
      },

      obtenerSubtotalEstimado: () => {
        let subtotal = 0;
        let tienePendientes = false;

        for (const item of get().items) {
          const precioPres = item.presentacion.precio;
          const precioNum = typeof precioPres === 'string' ? parseFloat(precioPres) : precioPres;
          const esFijo = item.presentacion.tipo_precio === 'FIJO';
          const esConfirmado = item.presentacion.estado_verificacion_precio === 'CONFIRMADO';

          if (esFijo && esConfirmado && precioNum && precioNum > 0) {
            let precioUnitarioTotal = precioNum;
            if (item.variante && item.variante.precio_adicional) {
              const recargo = typeof item.variante.precio_adicional === 'string'
                ? parseFloat(item.variante.precio_adicional)
                : item.variante.precio_adicional;
              precioUnitarioTotal += recargo || 0;
            }
            subtotal += precioUnitarioTotal * item.cantidad;
          } else {
            tienePendientes = true;
          }
        }

        return { subtotal, tienePendientes };
      },
    }),
    {
      name: 'almacen_cotizacion_bocaditos_santy',
    }
  )
);

