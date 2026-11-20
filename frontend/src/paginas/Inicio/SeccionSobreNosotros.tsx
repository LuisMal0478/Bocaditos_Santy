import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, ArrowRight, Award, Smile } from 'lucide-react';
import { RUTAS } from '../../utilidades/constantes';
import { useConfiguracion } from '../../contextos/almacen_configuracion';

export const SeccionSobreNosotros: React.FC = () => {
  const { configuracion } = useConfiguracion();

  return (
    <section className="py-12 sm:py-20 bg-gradient-to-b from-orange-50/50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-orange-100 shadow-calida p-6 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Foto Circular con Aro Festivo */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative">
                {/* Aro decorativo */}
                <div className="w-56 h-56 sm:w-72 sm:h-72 rounded-full p-2 bg-gradient-to-tr from-orange-400 via-amber-300 to-orange-500 shadow-xl">
                  <div className="w-full h-full rounded-full overflow-hidden border-4 border-white bg-orange-50">
                    <img
                      src="/media/productos/pag_2_img_1_X4.jpg"
                      alt="Sobre Bocaditos Santy"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>

                {/* Insignia Flotante */}
                <div className="absolute bottom-2 right-2 bg-white rounded-2xl p-3 shadow-lg border border-orange-100 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                    <Heart className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-texto-principal block">100% Amor</span>
                    <span className="text-[10px] text-gray-500">Recetas de familia</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contenido Editorial */}
            <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                <span>Nuestra Pasión</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-texto-principal tracking-tight">
                Sobre {configuracion?.nombre_negocio || 'Bocaditos Santy'}
              </h2>

              <p className="text-sm sm:text-base text-texto-secundario leading-relaxed font-medium">
                Somos un emprendimiento familiar apasionado por los pasabocas, con el objetivo de endulzar tus momentos y compartir alegría en cada bocado. Creemos en el poder de los pequeños placeres y la calidez de celebrar juntos.
              </p>

              <p className="text-xs sm:text-sm text-texto-secundario leading-relaxed">
                Ofrecemos pasabocas de alta calidad con el mejor sabor y siempre preparados con una sonrisa. Desde empanaditas y deditos de queso hasta repostería fina y mesas temáticas completas.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2 max-w-md mx-auto lg:mx-0 text-left">
                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-orange-50/70 border border-orange-100">
                  <Award className="w-5 h-5 text-orange-500 shrink-0" />
                  <span className="text-xs font-bold text-texto-principal">Ingredientes de primera</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-orange-50/70 border border-orange-100">
                  <Smile className="w-5 h-5 text-orange-500 shrink-0" />
                  <span className="text-xs font-bold text-texto-principal">Atención con cariño</span>
                </div>
              </div>

              <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <Link
                  to={RUTAS.NOSOTROS}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
                >
                  <span>Conoce más de nosotros</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to={RUTAS.CONTACTO}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-orange-50 text-orange-600 text-sm font-bold border border-orange-200 transition-all"
                >
                  <span>Ponte en contacto</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
