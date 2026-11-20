import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { RUTAS } from '../../utilidades/constantes';
import { Categoria } from '../../tipos/categoria';
import { servicioCategorias } from '../../servicios/servicio_categorias';

export const SeccionCategoriasVisual: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    servicioCategorias.obtenerTodas()
      .then((cats) => setCategorias(cats.filter((c) => c.esta_activa)))
      .catch(console.error);
  }, []);

  if (categorias.length === 0) return null;

  return (
    <section className="py-12 sm:py-20 bg-gradient-to-b from-transparent via-orange-50/30 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabecera de la sección */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>Nuestras Especialidades</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-texto-principal tracking-tight">
            Diseñados para deleitar la vista y el paladar
          </h2>
          <p className="text-sm sm:text-base text-texto-secundario mt-3 leading-relaxed font-medium">
            Explora por categoría y descubre la combinación perfecta de pasabocas dulces y salados para tu celebración.
          </p>
        </div>

        {/* Tarjetas Visuales de Categorías Dinámicas (Solo Activas) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {categorias.map((cat) => (
            <Link
              key={cat.id}
              to={`${RUTAS.CATALOGO}?categoria=${cat.slug}`}
              className="group relative bg-white rounded-3xl overflow-hidden border border-orange-100/90 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between"
            >
              {/* Imagen con zoom */}
              <div className="relative aspect-[4/3] overflow-hidden bg-orange-50">
                <img
                  src={cat.imagen_url || '/media/productos/pag_1_img_2_X11.jpg'}
                  alt={cat.nombre}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-orange-700 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                  Disponible
                </span>
              </div>

              {/* Información de la categoría */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg text-texto-principal group-hover:text-orange-600 transition-colors">
                    {cat.nombre}
                  </h3>
                  <p className="text-xs text-texto-secundario mt-1.5 leading-relaxed line-clamp-2">
                    {cat.descripcion || 'Variedad de pasabocas preparados con amor para tu celebración.'}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-orange-600 group-hover:text-orange-700">
                  <span>Ver pasabocas</span>
                  <div className="w-7 h-7 rounded-full bg-orange-50 group-hover:bg-orange-500 group-hover:text-white flex items-center justify-center transition-all">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};
