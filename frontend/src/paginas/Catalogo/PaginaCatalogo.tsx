import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Sparkles, AlertCircle } from 'lucide-react';
import { Categoria } from '../../tipos/categoria';
import { ProductoLista, ProductoDetalle } from '../../tipos/producto';
import { servicioCategorias } from '../../servicios/servicio_categorias';
import { servicioProductos } from '../../servicios/servicio_productos';
import { FiltroCategorias } from '../../componentes/productos/FiltroCategorias';
import { TarjetaProducto } from '../../componentes/productos/TarjetaProducto';
import { ModalDetalleProducto } from '../../componentes/productos/ModalDetalleProducto';
import { Cargando } from '../../componentes/comunes/Cargando';

export const PaginaCatalogo: React.FC = () => {
  const [parametrosBusqueda, setParametrosBusqueda] = useSearchParams();
  const categoriaInicial = parametrosBusqueda.get('categoria');

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string | null>(categoriaInicial);
  const [productos, setProductos] = useState<ProductoLista[]>([]);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);

  const [productoModal, setProductoModal] = useState<ProductoDetalle | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  // Cargar categorías
  useEffect(() => {
    servicioCategorias.obtenerTodas().then(setCategorias).catch(console.error);
  }, []);

  // Actualizar categoría seleccionada si cambian los search params de la URL
  useEffect(() => {
    const cat = parametrosBusqueda.get('categoria');
    setCategoriaSeleccionada(cat);
  }, [parametrosBusqueda]);

  // Cargar productos al cambiar filtros
  useEffect(() => {
    setCargando(true);
    servicioProductos
      .obtenerTodos({
        categoria: categoriaSeleccionada || undefined,
        q: terminoBusqueda || undefined,
      })
      .then((datos) => {
        setProductos(datos);
        setCargando(false);
      })
      .catch(() => {
        setCargando(false);
      });
  }, [categoriaSeleccionada, terminoBusqueda]);

  const alCambiarCategoria = (slug: string | null) => {
    setCategoriaSeleccionada(slug);
    if (slug) {
      setParametrosBusqueda({ categoria: slug });
    } else {
      setParametrosBusqueda({});
    }
  };

  const verDetalles = async (prod: ProductoLista) => {
    try {
      const detalle = await servicioProductos.obtenerPorSlug(prod.slug);
      setProductoModal(detalle);
      setModalAbierto(true);
    } catch (error) {
      console.error('Error al cargar detalle:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      
      {/* Encabezado */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rosa-100 text-rosa-700 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-rosa-500" />
          <span>Explora nuestra variedad</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-texto-principal tracking-tight">
          Nuestro Catálogo
        </h1>
        <p className="text-texto-secundario text-sm sm:text-base mt-3 leading-relaxed">
          Selecciona tus pasabocas favoritos, elige las presentaciones deseadas y crea tu lista de cotización para tu evento.
        </p>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="space-y-4 mb-8 w-full">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="flex-1 min-w-0">
            <FiltroCategorias
              categorias={categorias}
              categoriaSeleccionada={categoriaSeleccionada}
              alSeleccionarCategoria={alCambiarCategoria}
            />
          </div>

          {/* Campo de Búsqueda */}
          <div className="relative w-full md:w-80 shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-400" />
            <input
              type="text"
              placeholder="Buscar empanadas, postres..."
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-full border border-orange-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-xs transition"
            />
          </div>
        </div>

        {/* Contador de resultados */}
        <div className="flex items-center justify-between text-xs text-texto-secundario pt-1">
          <span>
            Mostrando <strong>{productos.length}</strong> {productos.length === 1 ? 'pasaboca disponible' : 'pasabocas disponibles para tu evento'}
          </span>
          {(categoriaSeleccionada || terminoBusqueda) && (
            <button
              onClick={() => {
                setCategoriaSeleccionada(null);
                setTerminoBusqueda('');
                setParametrosBusqueda({});
              }}
              className="text-rosa-600 font-bold hover:underline"
            >
              ✕ Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Lista de Productos */}
      {cargando ? (
        <Cargando texto="Cargando productos del catálogo..." />
      ) : productos.length === 0 ? (
        <div className="text-center py-16 px-4 bg-rosa-50/40 rounded-3xl border border-rosa-100 max-w-lg mx-auto">
          <AlertCircle className="w-12 h-12 text-rosa-400 mx-auto mb-3" />
          <h3 className="font-serif font-bold text-xl text-texto-principal">
            No encontramos pasabocas con estos criterios
          </h3>
          <p className="text-sm text-texto-secundario mt-2 mb-4">
            Prueba buscando con otra palabra clave o selecciona otra categoría.
          </p>
          <button
            onClick={() => {
              setCategoriaSeleccionada(null);
              setTerminoBusqueda('');
              setParametrosBusqueda({});
            }}
            className="px-5 py-2.5 rounded-full bg-rosa-500 text-white font-bold text-xs shadow-sm hover:bg-rosa-600 transition"
          >
            Ver todos los pasabocas
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {productos.map((producto) => (
            <TarjetaProducto
              key={producto.id}
              producto={producto}
              alVerDetalles={verDetalles}
            />
          ))}
        </div>
      )}

      {/* Modal de Detalle y Cotización */}
      <ModalDetalleProducto
        producto={productoModal}
        abierto={modalAbierto}
        alCerrar={() => setModalAbierto(false)}
      />
    </div>
  );
};

