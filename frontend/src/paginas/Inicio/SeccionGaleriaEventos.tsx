import React from 'react';
import { Instagram, Sparkles, Heart } from 'lucide-react';
import { useConfiguracion } from '../../contextos/almacen_configuracion';

export const SeccionGaleriaEventos: React.FC = () => {
  const { configuracion } = useConfiguracion();
  const usuarioIg = configuracion?.instagram || '@bocaditossanty';
  const urlInstagram = usuarioIg.startsWith('http')
    ? usuarioIg
    : `https://instagram.com/${usuarioIg.replace('@', '')}`;
  const fotos = [
    {
      url: '/media/productos/pag_1_img_2_X11.jpg',
      titulo: 'Bandeja surtida de pasabocas',
      tipo: 'Celebración familiar',
    },
    {
      url: '/media/productos/pag_7_img_1_X4.png',
      titulo: 'Mesa temática con accesorios de lujo',
      tipo: 'Recepción de gala',
    },
    {
      url: '/media/productos/pag_3_img_1_X4.jpg',
      titulo: 'Mini repostería artesanal',
      tipo: 'Cumpleaños y aniversarios',
    },
    {
      url: '/media/productos/pag_5_img_1_X4.png',
      titulo: 'Estación de bebidas refrescantes',
      tipo: 'Evento al aire libre',
    },
    {
      url: '/media/productos/pag_1_img_4_X21.jpg',
      titulo: 'Empanaditas recién horneadas',
      tipo: 'Reunión empresarial',
    },
    {
      url: '/media/productos/pag_7_img_2_X9.png',
      titulo: 'Montaje sencillo y elegante',
      tipo: 'Baby Shower',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabecera */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rosa-100 text-rosa-700 text-xs font-bold uppercase tracking-widest mb-2">
              <Sparkles className="w-3.5 h-3.5 text-rosa-500" />
              <span>Galería de Momentos</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-texto-principal">
              Momentos felices en cada mesa
            </h2>
            <p className="text-sm text-texto-secundario mt-2 max-w-xl">
              Cada pasaboca y montaje refleja nuestra dedicación por hacer de tu celebración algo especial.
            </p>
          </div>

          <a
            href={urlInstagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-rosa-50 hover:bg-rosa-100 text-rosa-700 font-bold text-xs transition border border-rosa-200 w-fit"
          >
            <Instagram className="w-4 h-4 text-rosa-500" />
            <span>Síguenos en {usuarioIg}</span>
          </a>
        </div>

        {/* Mosaico Fotográfico */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {fotos.map((foto, index) => (
            <div
              key={index}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-rosa-50 border border-rosa-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <img
                src={foto.url}
                alt={foto.titulo}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 text-white">
                <span className="text-[10px] text-rosa-300 font-bold uppercase tracking-wider block">
                  {foto.tipo}
                </span>
                <span className="text-xs font-serif font-bold line-clamp-1 block">
                  {foto.titulo}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
