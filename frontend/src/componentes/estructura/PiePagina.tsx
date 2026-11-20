import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MessageCircle, Instagram, Facebook, Mail, MapPin, ShieldCheck, Lock, UserCheck, Heart } from 'lucide-react';
import { RUTAS } from '../../utilidades/constantes';
import { useAutenticacion } from '../../contextos/almacen_autenticacion';
import { useConfiguracion } from '../../contextos/almacen_configuracion';
import { servicioCategorias } from '../../servicios/servicio_categorias';
import { Categoria } from '../../tipos/categoria';

export const PiePagina: React.FC = () => {
  const { estaAutenticado } = useAutenticacion();
  const { configuracion } = useConfiguracion();
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    servicioCategorias.obtenerTodas()
      .then((cats) => setCategorias(cats.filter((c) => c.esta_activa)))
      .catch(() => {});
  }, []);

  const numeroRaw = configuracion?.numero_whatsapp || '+573164486299';
  const soloDigitos = numeroRaw.replace(/\D/g, '');
  const numeroWhatsapp = soloDigitos.length === 10 ? `57${soloDigitos}` : soloDigitos;
  const urlWhatsappDirecto = `https://api.whatsapp.com/send?phone=${numeroWhatsapp}&text=${encodeURIComponent(
    '¡Hola Bocaditos Santy! Vengo de su página web y deseo hacer un pedido de pasabocas.'
  )}`;

  // Enlace y formato dinámico de Facebook
  const obtenerUrlFacebook = (fb?: string) => {
    if (!fb || !fb.trim()) return null;
    const limpio = fb.trim();
    if (limpio.startsWith('http://') || limpio.startsWith('https://')) return limpio;
    if (limpio.includes(' ') || limpio.includes('+')) {
      return `https://www.facebook.com/search/top?q=${encodeURIComponent(limpio)}`;
    }
    return `https://www.facebook.com/${limpio.replace(/^@/, '')}`;
  };
  const urlFacebook = obtenerUrlFacebook(configuracion?.facebook);
  const textoFacebook = configuracion?.facebook?.trim() || 'Bocaditos Santy';

  // Enlace y formato dinámico de Instagram
  const usuarioIg = configuracion?.instagram?.trim() || '@bocaditossanty';
  const urlInstagram = usuarioIg.startsWith('http')
    ? usuarioIg
    : `https://instagram.com/${usuarioIg.replace('@', '')}`;

  // Correo de contacto oficial
  const emailContacto = configuracion?.email_contacto?.trim();

  return (
    <footer className="mt-20">
      {/* ========================================================= */}
      {/* PIE DE PÁGINA NARANJA ESTILO DELISNACKS                   */}
      {/* ========================================================= */}
      <div className="bg-gradient-to-b from-orange-500 via-orange-600 to-orange-700 text-white pt-14 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            
            {/* Columna 1: Marca Oficial y Logo */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-white p-0.5 shadow-md shrink-0">
                  <img
                    src={configuracion?.logo_url || '/logo-bocaditos-santy.jpg'}
                    alt="Bocaditos Santy"
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/logo-bocaditos-santy.jpg';
                    }}
                  />
                </div>
                <div>
                  <h4 className="font-serif font-extrabold text-2xl text-white">
                    {configuracion?.nombre_negocio || 'Bocaditos Santy'}
                  </h4>
                  <p className="text-xs text-amber-200 font-bold tracking-wider uppercase">
                    • {configuracion?.eslogan || 'Momentos felices'} •
                  </p>
                </div>
              </div>
              <p className="text-sm text-white/90 leading-relaxed font-normal">
                {configuracion?.descripcion_negocio ||
                  'Preparación artesanal de pasabocas dulces, salados, bebidas refrescantes y mesas temáticas para cualquier tipo de celebración.'}
              </p>
              
              {/* Botón WhatsApp Verde Oficial en Footer */}
              <div className="pt-2">
                <a
                  href={urlWhatsappDirecto}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-bold shadow-md hover:shadow-lg transition-transform transform hover:scale-105 active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Haz tu pedido por WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Columna 2: Enlaces Rápidos */}
            <div>
              <h5 className="font-serif font-bold text-white text-lg mb-4">Navegación</h5>
              <ul className="space-y-2.5 text-sm text-white/90">
                <li>
                  <Link to={RUTAS.INICIO} className="hover:text-amber-200 transition-colors">Inicio</Link>
                </li>
                <li>
                  <Link to={RUTAS.CATALOGO} className="hover:text-amber-200 transition-colors">Nuestros Pasabocas</Link>
                </li>
                <li>
                  <Link to={RUTAS.NOSOTROS} className="hover:text-amber-200 transition-colors">Sobre Nosotros</Link>
                </li>
                <li>
                  <Link to={RUTAS.SERVICIOS_EVENTOS} className="hover:text-amber-200 transition-colors">Servicios para eventos</Link>
                </li>
                <li>
                  <Link to={RUTAS.COTIZACION} className="hover:text-amber-200 transition-colors">Mi cotización</Link>
                </li>
              </ul>
            </div>

            {/* Columna 3: Categorías Dinámicas (Solo Activas) */}
            <div>
              <h5 className="font-serif font-bold text-white text-lg mb-4">Categorías</h5>
              <ul className="space-y-2.5 text-sm text-white/90">
                {categorias.map((c) => (
                  <li key={c.id}>
                    <Link to={`${RUTAS.CATALOGO}?categoria=${c.slug}`} className="hover:text-amber-200 transition-colors">
                      {c.nombre}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Columna 4: Contacto y Redes Sociales */}
            <div className="space-y-3.5">
              <h5 className="font-serif font-bold text-white text-lg mb-4">Síguenos y Contáctanos</h5>
              <a
                href={urlWhatsappDirecto}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-white/90 hover:text-amber-200 transition-colors group"
              >
                <MessageCircle className="w-5 h-5 text-amber-200 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="font-bold">
                  WhatsApp: {configuracion?.numero_whatsapp || '+57 316 4486299'}
                </span>
              </a>

              {/* Enlace Facebook */}
              {urlFacebook && (
                <a
                  href={urlFacebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-white/90 hover:text-amber-200 transition-colors group"
                >
                  <Facebook className="w-5 h-5 text-amber-200 shrink-0 group-hover:scale-110 transition-transform" />
                  <span>Facebook: {textoFacebook}</span>
                </a>
              )}

              {/* Enlace Instagram */}
              <a
                href={urlInstagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-white/90 hover:text-amber-200 transition-colors group"
              >
                <Instagram className="w-5 h-5 text-amber-200 shrink-0 group-hover:scale-110 transition-transform" />
                <span>Instagram: {usuarioIg}</span>
              </a>

              {/* Enlace Correo Electrónico */}
              {emailContacto && (
                <a
                  href={`mailto:${emailContacto}`}
                  className="flex items-center gap-2.5 text-sm text-white/90 hover:text-amber-200 transition-colors group"
                >
                  <Mail className="w-5 h-5 text-amber-200 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="truncate max-w-[210px]" title={emailContacto}>
                    {emailContacto}
                  </span>
                </a>
              )}

              {/* Zona de Cobertura */}
              <div className="flex items-start gap-2.5 text-sm text-white/90">
                <MapPin className="w-5 h-5 text-amber-200 shrink-0 mt-0.5" />
                <span>{configuracion?.zona_cobertura || 'Entregas y pedidos con anticipación'}</span>
              </div>

              {/* Iconos de Redes Sociales y Contacto Directo */}
              <div className="pt-2 flex items-center gap-2.5 flex-wrap">
                {/* Botón WhatsApp */}
                <a
                  href={urlWhatsappDirecto}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white flex items-center justify-center transition shadow-xs hover:scale-110 active:scale-95"
                  aria-label="WhatsApp"
                  title="Chatear por WhatsApp"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                </a>

                {/* Botón Facebook */}
                {urlFacebook && (
                  <a
                    href={urlFacebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-[#1877F2] hover:bg-[#166fe5] text-white flex items-center justify-center transition shadow-xs hover:scale-110 active:scale-95"
                    aria-label="Facebook"
                    title={`Síguenos en Facebook (${textoFacebook})`}
                  >
                    <Facebook className="w-4 h-4 fill-white" />
                  </a>
                )}

                {/* Botón Instagram */}
                <a
                  href={urlInstagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center transition shadow-xs hover:scale-110 active:scale-95"
                  aria-label="Instagram"
                  title={`Síguenos en Instagram (${usuarioIg})`}
                >
                  <Instagram className="w-4 h-4" />
                </a>

                {/* Botón Correo Electrónico */}
                {emailContacto && (
                  <a
                    href={`mailto:${emailContacto}`}
                    className="w-9 h-9 rounded-full bg-white/20 hover:bg-white text-white hover:text-orange-600 flex items-center justify-center transition shadow-xs hover:scale-110 active:scale-95"
                    aria-label="Correo electrónico"
                    title={`Enviar correo a ${emailContacto}`}
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Barra inferior de derechos y acceso admin */}
          <div className="pt-8 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/80">
            <p className="flex items-center gap-1">
              <span>© {new Date().getFullYear()} Bocaditos Santy - "Momentos felices". Hecho con</span>
              <Heart className="w-3.5 h-3.5 text-amber-300 fill-current inline" />
            </p>
            <div className="flex items-center gap-4">
              <Link
                to={estaAutenticado ? RUTAS.ADMIN_TABLERO : RUTAS.ADMIN_LOGIN}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white text-white hover:text-orange-700 border border-white/30 font-semibold transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                <span>{estaAutenticado ? 'Panel de Control Activo' : 'Acceso Administradora'}</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

