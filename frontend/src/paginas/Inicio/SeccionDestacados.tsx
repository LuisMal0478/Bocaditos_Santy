import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, UtensilsCrossed } from 'lucide-react';
import { RUTAS } from '../../utilidades/constantes';
import { ProductoLista, ProductoDetalle } from '../../tipos/producto';
import { Categoria } from '../../tipos/categoria';
import { servicioProductos } from '../../servicios/servicio_productos';
import { servicioCategorias } from '../../servicios/servicio_categorias';
import { TarjetaProducto } from '../../componentes/productos/TarjetaProducto';
import { ModalDetalleProducto } from '../../componentes/productos/ModalDetalleProducto';
import { Cargando } from '../../componentes/comunes/Cargando';

export const SeccionDestacados: React.FC = () => {
  const [productos, setProductos] = useState<ProductoLista[]>([]);
  const [categoriasActivas, setCategoriasActivas] = useState<Categoria[]>([]);
  const [categoriaActiva, setCategoriaActiva] = useState<string>('todos');
  const [cargando, setCargando] = useState(true);
  const [productoSeleccionado, setProductoSeleccionado] = useState<ProductoDetalle | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
    servicioCategorias.obtenerTodas()
      .then((cats) => setCategoriasActivas(cats.filter((c) => c.esta_activa)))
      .catch(console.error);
  }, []);

  useEffect(() => {
    setCargando(true);
    const params: any = {};
    if (categoriaActiva !== 'todos') {
      params.categoria = categoriaActiva;
    }
    servicioProductos.obtenerTodos(params)
      .then((datos) => {
        // En la página de inicio se priorizan los productos marcados como destacados por la administradora
        let seleccionados = datos.filter((p) => p.esta_destacado && p.esta_activo);
        // Si aún no ha seleccionado destacados para esta categoría, muestra los primeros activos disponibles
        if (seleccionados.length === 0) {
          seleccionados = datos.filter((p) => p.esta_activo);
        }
        setProductos(seleccionados.slice(0, 8));
        setCargando(false);
      })
      .catch(() => {
        setCargando(false);
      });
  }, [categoriaActiva]);

  const verDetalles = async (prod: ProductoLista) => {
    try {
      const detalle = await servicioProductos.obtenerPorSlug(prod.slug);
      setProductoSeleccionado(detalle);
      setModalAbierto(true);
    } catch {
      // Manejar error silenciosamente
    }
  };

  const pestanas = [
    { id: 'todos', label: 'Todos los favoritos' },
    ...categoriasActivas.map((cat) => ({
      id: cat.slug,
      label: cat.nombre,
    })),
  ];

  return (
    <section id="productos" className="py-14 sm:py-20 bg-gradient-to-b from-white via-orange-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Cabecera de Sección Estilo DeliSnacks */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-orange-600 uppercase tracking-widest mb-2 px-3.5 py-1 rounded-full bg-orange-100 border border-orange-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>— Nuestros Pasabocas —</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-texto-principal tracking-tight">
            Pasabocas que hacen la vida <span className="text-orange-500 italic">más deliciosa</span>
          </h2>
          <p className="text-sm sm:text-base text-texto-secundario mt-3 font-medium">
            Crujientes, frescos y con el mejor sabor. Elige tus favoritos y agrégalos a tu cotización con un solo clic.
          </p>

          {/* Filtros de Categoría Rápidos */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
            {pestanas.map((p) => (
              <button
                key={p.id}
                onClick={() => setCategoriaActiva(p.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow-xs ${categoriaActiva === p.id
                    ? 'bg-orange-500 text-white shadow-md scale-105'
                    : 'bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600 border border-orange-100'
                  }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cuadrícula de Productos */}
        {cargando ? (
          <Cargando texto="Cargando los pasabocas más deliciosos..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {productos.map((producto) => (
              <TarjetaProducto
                key={producto.id}
                producto={producto}
                alVerDetalles={verDetalles}
              />
            ))}
          </div>
        )}

        {/* Botón Ver Más Catálogo */}
        <div className="mt-12 text-center">
          <Link
            to={RUTAS.CATALOGO}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white hover:bg-orange-50 text-orange-600 font-extrabold text-sm sm:text-base border-2 border-orange-500 shadow-sm hover:shadow-md transition-all transform hover:scale-105"
          >
            <span>Ver todo el catálogo completo (+50 variedades)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <ModalDetalleProducto
        producto={productoSeleccionado}
        abierto={modalAbierto}
        alCerrar={() => setModalAbierto(false)}
      />
    </section>
  );
};

