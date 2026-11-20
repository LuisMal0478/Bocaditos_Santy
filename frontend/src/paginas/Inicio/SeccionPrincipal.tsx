import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, MessageCircle, Star, Heart, CheckCircle2, ShieldCheck, Flame } from 'lucide-react';
import { RUTAS } from '../../utilidades/constantes';
import { Boton } from '../../componentes/comunes/Boton';
import { useConfiguracion } from '../../contextos/almacen_configuracion';

export const SeccionPrincipal: React.FC = () => {
  const { configuracion } = useConfiguracion();

  const tituloHero = configuracion?.titulo_hero || 'El snack perfecto para cualquier ocasión';
  const subtituloHero =
    configuracion?.subtitulo_hero ||
    'Pasabocas que hacen la vida más deliciosa. Crujientes, frescos y con el mejor sabor tradicional, preparados artesanalmente con amor para tus reuniones, cumpleaños y celebraciones especiales.';
  const textoBoton = configuracion?.texto_boton_hero || 'Haz tu pedido';
  const nombreNegocio = configuracion?.nombre_negocio || 'Bocaditos Santy';

  const numeroRaw = configuracion?.numero_whatsapp || '+573164486299';
  const soloDigitos = numeroRaw.replace(/\D/g, '');
  const numeroWhatsapp = soloDigitos.length === 10 ? `57${soloDigitos}` : soloDigitos;
  const urlWhatsappDirecto = `https://api.whatsapp.com/send?phone=${numeroWhatsapp}&text=${encodeURIComponent(
    '¡Hola Bocaditos Santy! Vengo de su página web y deseo hacer un pedido de pasabocas.'
  )}`;

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24 bg-gradient-to-b from-amber-50/70 via-orange-50/40 to-white">
      {/* Elementos decorativos de fondo con calidez gourmet */}
      <div className="absolute top-1/4 right-0 w-[480px] h-[480px] lg:w-[620px] lg:h-[620px] bg-gradient-to-tr from-orange-200/40 via-amber-200/30 to-yellow-100/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute top-6 left-1/4 w-72 h-72 bg-orange-100/40 rounded-full blur-2xl -z-10 pointer-events-none"></div>
      <div className="absolute -top-10 left-6 text-orange-200/60 font-serif text-9xl select-none -z-10">✦</div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Columna Izquierda: Mensaje y Llamados a la Acción */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Pill de Bienvenida / Slogan */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100/90 border border-orange-200 text-orange-800 text-xs font-bold tracking-wide shadow-xs animate-in fade-in duration-500">
              <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" />
              <span>{nombreNegocio} • Momentos felices</span>
              <span className="hidden sm:inline text-orange-300">•</span>
              <span className="hidden sm:inline text-orange-700 font-extrabold">100% Artesanal</span>
            </div>

            {/* Título Principal Atractivo y Editorial */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-texto-principal tracking-tight leading-[1.14]">
              {tituloHero}
            </h1>

            {/* Párrafo descriptivo apetitoso */}
            <p className="text-base sm:text-lg text-texto-secundario max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              {subtituloHero}
            </p>

            {/* Accesos rápidos a categorías favoritas en pastillas redondeadas */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1 text-xs text-texto-secundario">
              <span className="font-bold text-texto-principal mr-1 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                Populares:
              </span>
              <Link
                to={`${RUTAS.CATALOGO}?categoria=bocaditos-salados`}
                className="px-3.5 py-1.5 rounded-full bg-white hover:bg-orange-50 text-gray-800 hover:text-orange-600 font-semibold border border-orange-200/80 transition shadow-xs"
              >
                🥟 Salados
              </Link>
              <Link
                to={`${RUTAS.CATALOGO}?categoria=bocaditos-dulces`}
                className="px-3.5 py-1.5 rounded-full bg-white hover:bg-orange-50 text-gray-800 hover:text-orange-600 font-semibold border border-orange-200/80 transition shadow-xs"
              >
                🍰 Dulces
              </Link>
              <Link
                to={`${RUTAS.CATALOGO}?categoria=bebidas`}
                className="px-3.5 py-1.5 rounded-full bg-white hover:bg-orange-50 text-gray-800 hover:text-orange-600 font-semibold border border-orange-200/80 transition shadow-xs"
              >
                🍹 Bebidas
              </Link>
              <Link
                to={`${RUTAS.CATALOGO}?categoria=servicios-para-eventos`}
                className="px-3.5 py-1.5 rounded-full bg-white hover:bg-orange-50 text-gray-800 hover:text-orange-600 font-semibold border border-orange-200/80 transition shadow-xs"
              >
                🎉 Combos Fiesta
              </Link>
            </div>

            {/* Botones de Llamada a la Acción (Naranja y Verde WhatsApp) */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              {/* Botón Principal Naranja: Haz tu pedido */}
              <Link to={RUTAS.CATALOGO} className="w-full sm:w-auto">
                <Boton
                  variante="primario"
                  tamano="lg"
                  className="w-full sm:w-auto shadow-md hover:shadow-lg text-sm sm:text-base font-bold bg-orange-500 hover:bg-orange-600 text-white rounded-full px-7 py-3.5"
                  icono={<ArrowRight className="w-5 h-5" />}
                >
                  {textoBoton}
                </Boton>
              </Link>

              {/* Botón Verde WhatsApp Oficial */}
              <a
                href={urlWhatsappDirecto}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white text-sm sm:text-base font-bold shadow-md hover:shadow-lg transition-all transform hover:scale-105 active:scale-95"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>Haz tu pedido por WhatsApp</span>
              </a>
            </div>

            {/* Métricas Visuales de Calidad y Confianza */}
            <div className="pt-6 border-t border-orange-200/60 grid grid-cols-3 gap-3 sm:gap-6 max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
              <div>
                <span className="block font-serif font-extrabold text-2xl sm:text-3xl text-orange-600">+50</span>
                <span className="text-[11px] sm:text-xs text-texto-secundario font-semibold">Variedades gourmet</span>
              </div>
              <div>
                <span className="block font-serif font-extrabold text-2xl sm:text-3xl text-orange-600">100%</span>
                <span className="text-[11px] sm:text-xs text-texto-secundario font-semibold">Fresco del día</span>
              </div>
              <div>
                <div className="flex items-center justify-center lg:justify-start gap-1">
                  <span className="font-serif font-extrabold text-2xl sm:text-3xl text-orange-600">4.9</span>
                  <div className="flex text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                </div>
                <span className="text-[11px] sm:text-xs text-texto-secundario font-semibold">Momentos felices</span>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Composición Fotográfica Gastronómica con Aura Cálida */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md lg:max-w-none">
              
              {/* Tarjeta Fotográfica Principal */}
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 sm:border-8 border-white aspect-[4/3] bg-orange-100 group">
                <img
                  src="/media/productos/pag_1_img_2_X11.jpg"
                  alt="Pasabocas Bocaditos Santy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Degradado sutil para legibilidad */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

                {/* Insignia visual sobre la foto */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5 bg-white/95 backdrop-blur-md text-orange-950 text-xs font-bold px-3.5 py-2 rounded-2xl flex items-center justify-between shadow-md">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Preparado fresco para tu evento</span>
                  </div>
                  <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-extrabold">
                    ★ Favorito
                  </span>
                </div>
              </div>

              {/* Tarjeta Flotante Superior: Estrella de la Casa */}
              <div className="absolute -top-5 -right-3 sm:-right-5 z-20 bg-white/95 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl shadow-xl border border-orange-100 flex items-center gap-3 transform hover:scale-105 transition-transform">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-orange-50 border border-orange-200 shrink-0">
                  <img
                    src="/media/productos/pag_2_img_6_X10.jpg"
                    alt="Empanaditas gourmet"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1 text-amber-500 text-[10px]">
                    {'★'.repeat(5)}
                    <span className="text-gray-600 font-bold ml-1">5.0</span>
                  </div>
                  <span className="font-serif font-bold text-xs sm:text-sm text-texto-principal block leading-tight">
                    Empanaditas Caseras
                  </span>
                  <span className="text-[10px] text-orange-600 font-bold">¡Crujientes y deliciosas!</span>
                </div>
              </div>

              {/* Tarjeta Flotante Inferior: Hecho con amor */}
              <div className="absolute -bottom-6 -left-3 sm:-left-6 z-20 bg-white/95 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl shadow-xl border border-orange-100 flex items-center gap-3 transform hover:scale-105 transition-transform">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Heart className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <span className="block text-[10px] text-orange-600 font-extrabold uppercase tracking-wider">
                    Bocaditos Santy
                  </span>
                  <span className="font-serif font-bold text-xs sm:text-sm text-texto-principal block leading-tight">
                    Hecho con amor
                  </span>
                  <span className="text-[10px] text-texto-secundario">Para cualquier ocasión</span>
                </div>
              </div>

              {/* Elemento decorativo detrás */}
              <div className="absolute -bottom-8 -right-6 w-36 h-36 bg-amber-400/20 rounded-full blur-2xl -z-10"></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
