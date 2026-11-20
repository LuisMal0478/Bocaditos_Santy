import React from 'react';
import { MessageCircle, Instagram, Facebook, Mail, MapPin, Clock, Send, Sparkles } from 'lucide-react';
import { useConfiguracion } from '../../contextos/almacen_configuracion';
import { Boton } from '../../componentes/comunes/Boton';

export const PaginaContacto: React.FC = () => {
  const { configuracion: negocio } = useConfiguracion();

  const numeroRaw = negocio?.numero_whatsapp || '+573164486299';
  const soloDigitos = numeroRaw.replace(/\D/g, '');
  const numeroLimpio = soloDigitos.length === 10 ? `57${soloDigitos}` : soloDigitos;
  const urlWhatsapp = `https://api.whatsapp.com/send?phone=${numeroLimpio}&text=${encodeURIComponent(
    negocio?.mensaje_bienvenida_whatsapp || '¡Hola Bocaditos Santy! Deseo comunicarme con ustedes.'
  )}`;

  const obtenerUrlFacebook = (fb?: string) => {
    if (!fb || !fb.trim()) return null;
    const limpio = fb.trim();
    if (limpio.startsWith('http://') || limpio.startsWith('https://')) return limpio;
    if (limpio.includes(' ') || limpio.includes('+')) {
      return `https://www.facebook.com/search/top?q=${encodeURIComponent(limpio)}`;
    }
    return `https://www.facebook.com/${limpio.replace(/^@/, '')}`;
  };
  const urlFacebook = obtenerUrlFacebook(negocio?.facebook) || 'https://facebook.com';
  const textoFacebook = negocio?.facebook?.trim() || 'Bocaditos Santy';

  const usuarioIg = negocio?.instagram?.trim() || '@bocaditossanty';
  const urlInstagram = usuarioIg.startsWith('http')
    ? usuarioIg
    : `https://instagram.com/${usuarioIg.replace('@', '')}`;

  const emailContacto = negocio?.email_contacto?.trim() || 'contacto@bocaditossanty.com';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      
      {/* Encabezado */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rosa-100 text-rosa-700 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-rosa-500" />
          <span>Atención Directa</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-texto-principal tracking-tight">
          Ponte en Contacto
        </h1>
        <p className="text-sm sm:text-base text-texto-secundario mt-3">
          ¿Tienes dudas o requerimientos especiales para tu celebración? Estamos a tu disposición vía WhatsApp, Facebook, Instagram y correo electrónico.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-10">
        
        {/* Tarjeta WhatsApp */}
        <div className="bg-white rounded-3xl border border-rosa-100 p-6 sm:p-7 shadow-tarjeta text-center flex flex-col justify-between items-center space-y-5 hover:shadow-lg transition">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <MessageCircle className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-texto-principal">WhatsApp Oficial</h3>
            <p className="text-xs text-texto-secundario mt-1.5 leading-relaxed">
              Atención inmediata para coordinar cotizaciones y pedidos de eventos.
            </p>
            <p className="font-mono font-bold text-sm text-emerald-700 mt-2">
              {negocio?.numero_whatsapp || '+57 316 4486299'}
            </p>
          </div>
          <a
            href={urlWhatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Boton variante="primario" tamano="sm" className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white">
              Escribir al WhatsApp
            </Boton>
          </a>
        </div>

        {/* Tarjeta Facebook */}
        <div className="bg-white rounded-3xl border border-rosa-100 p-6 sm:p-7 shadow-tarjeta text-center flex flex-col justify-between items-center space-y-5 hover:shadow-lg transition">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <Facebook className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-texto-principal">Facebook</h3>
            <p className="text-xs text-texto-secundario mt-1.5 leading-relaxed">
              Sigue nuestras publicaciones, promociones y recomendaciones de pasabocas.
            </p>
            <p className="font-semibold text-sm text-blue-600 mt-2 truncate max-w-[200px]" title={textoFacebook}>
              {textoFacebook}
            </p>
          </div>
          <a
            href={urlFacebook}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Boton variante="secundario" tamano="sm" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50">
              Visitar Facebook
            </Boton>
          </a>
        </div>

        {/* Tarjeta Instagram */}
        <div className="bg-white rounded-3xl border border-rosa-100 p-6 sm:p-7 shadow-tarjeta text-center flex flex-col justify-between items-center space-y-5 hover:shadow-lg transition">
          <div className="w-14 h-14 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center">
            <Instagram className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-texto-principal">Instagram</h3>
            <p className="text-xs text-texto-secundario mt-1.5 leading-relaxed">
              Fotografías reales de nuestras mesas, pasabocas y montajes de gala.
            </p>
            <p className="font-semibold text-sm text-pink-600 mt-2 truncate max-w-[200px]" title={usuarioIg}>
              {usuarioIg}
            </p>
          </div>
          <a
            href={urlInstagram}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Boton variante="secundario" tamano="sm" className="w-full border-pink-200 text-pink-700 hover:bg-pink-50">
              Visitar Instagram
            </Boton>
          </a>
        </div>

        {/* Tarjeta Correo */}
        <div className="bg-white rounded-3xl border border-rosa-100 p-6 sm:p-7 shadow-tarjeta text-center flex flex-col justify-between items-center space-y-5 hover:shadow-lg transition">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Mail className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-texto-principal">Correo Electrónico</h3>
            <p className="text-xs text-texto-secundario mt-1.5 leading-relaxed">
              Para requerimientos formales, empresas o solicitudes especiales.
            </p>
            <p className="font-semibold text-xs text-amber-900 mt-2 truncate max-w-[200px]" title={emailContacto}>
              {emailContacto}
            </p>
          </div>
          <a
            href={`mailto:${emailContacto}`}
            className="w-full"
          >
            <Boton variante="secundario" tamano="sm" className="w-full border-amber-200 text-amber-900 hover:bg-amber-50">
              Enviar Correo
            </Boton>
          </a>
        </div>

      </div>

      {/* Franja de Cobertura */}
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 rounded-2xl border border-orange-200 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm text-texto-principal">Zona de Cobertura y Entregas</h4>
            <p className="text-xs text-texto-secundario mt-0.5">
              {negocio?.zona_cobertura || 'Cobertura en la ciudad y municipios aledaños bajo confirmación previa.'}
            </p>
          </div>
        </div>
        <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-white text-orange-700 border border-orange-200 shadow-2xs whitespace-nowrap">
          Pedidos con anticipación
        </span>
      </div>

    </div>
  );
};

