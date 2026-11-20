import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Sparkles, MessageCircle, ShieldCheck, Lock } from 'lucide-react';
import { RUTAS } from '../../utilidades/constantes';
import { useCotizacion } from '../../contextos/almacen_cotizacion';
import { useAutenticacion } from '../../contextos/almacen_autenticacion';
import { useConfiguracion } from '../../contextos/almacen_configuracion';

export const BarraNavegacion: React.FC = () => {
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);
  const ubicacion = useLocation();
  const totalPresentaciones = useCotizacion((estado) => estado.obtenerTotalPresentaciones());
  const { estaAutenticado } = useAutenticacion();
  const { configuracion } = useConfiguracion();

  const enlaces = [
    { nombre: 'Inicio', ruta: RUTAS.INICIO },
    { nombre: 'Productos', ruta: RUTAS.CATALOGO },
    { nombre: 'Nosotros', ruta: RUTAS.NOSOTROS },
    { nombre: 'Servicios para eventos', ruta: RUTAS.SERVICIOS_EVENTOS },
    { nombre: 'Contacto', ruta: RUTAS.CONTACTO },
  ];

  const estaActivo = (ruta: string) => {
    if (ruta === RUTAS.INICIO) return ubicacion.pathname === RUTAS.INICIO;
    return ubicacion.pathname.startsWith(ruta);
  };

  const numeroRaw = configuracion?.numero_whatsapp || '+573164486299';
  const soloDigitos = numeroRaw.replace(/\D/g, '');
  const numeroWhatsapp = soloDigitos.length === 10 ? `57${soloDigitos}` : soloDigitos;
  const urlWhatsappDirecto = `https://api.whatsapp.com/send?phone=${numeroWhatsapp}&text=${encodeURIComponent(
    '¡Hola Bocaditos Santy! Vengo de su página web y deseo hacer un pedido de pasabocas.'
  )}`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-orange-100 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-22">
          
          {/* Logo Oficial y Eslogan */}
          <Link to={RUTAS.INICIO} className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full p-0.5 bg-gradient-to-tr from-orange-500 to-amber-400 shadow-sm group-hover:scale-105 transition-transform overflow-hidden shrink-0">
              <img
                src={configuracion?.logo_url || '/logo-bocaditos-santy.jpg'}
                alt={configuracion?.nombre_negocio || 'Bocaditos Santy'}
                className="w-full h-full object-cover rounded-full bg-white"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/logo-bocaditos-santy.jpg';
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-extrabold text-xl sm:text-2xl tracking-tight text-texto-principal group-hover:text-orange-600 transition-colors leading-tight">
                {configuracion?.nombre_negocio || 'Bocaditos Santy'}
              </span>
              <span className="text-[11px] sm:text-xs text-orange-600 font-bold tracking-wider uppercase">
                • {configuracion?.eslogan || 'Momentos felices'} •
              </span>
            </div>
          </Link>

          {/* Menú de navegación en escritorio */}
          <nav className="hidden md:flex items-center gap-7">
            {enlaces.map((enlace) => (
              <Link
                key={enlace.ruta}
                to={enlace.ruta}
                className={`text-sm font-semibold transition-colors relative py-1 ${
                  estaActivo(enlace.ruta)
                    ? 'text-orange-600 font-bold'
                    : 'text-texto-secundario hover:text-orange-600'
                }`}
              >
                {enlace.nombre}
                {estaActivo(enlace.ruta) && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 rounded-full animate-in fade-in duration-200"></span>
                )}
              </Link>
            ))}
          </nav>

          {/* Acciones del lado derecho: Cotización y Panel Admin */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Acceso para la Administradora */}
            {estaAutenticado ? (
              <Link
                to={RUTAS.ADMIN_TABLERO}
                className="hidden lg:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200 transition"
                title="Ir a mi panel administrativo"
              >
                <ShieldCheck className="w-4 h-4 text-orange-600" />
                <span>Mi Panel</span>
              </Link>
            ) : (
              <Link
                to={RUTAS.ADMIN_LOGIN}
                className="hidden xl:inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full text-gray-500 hover:text-orange-600 hover:bg-orange-50 transition"
                title="Acceso para la dueña"
              >
                <Lock className="w-3.5 h-3.5 text-gray-400" />
                <span>Admin</span>
              </Link>
            )}

            {/* Botón 'Mi cotización' */}
            <Link
              to={RUTAS.COTIZACION}
              className="relative inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-bold shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Mi cotización</span>
              {totalPresentaciones > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold bg-white text-orange-600 rounded-full shadow-xs">
                  {totalPresentaciones}
                </span>
              )}
            </Link>

            {/* Botón menú móvil */}
            <button
              onClick={() => setMenuMovilAbierto(!menuMovilAbierto)}
              className="md:hidden p-2 rounded-xl text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition"
              aria-label="Abrir menú"
            >
              {menuMovilAbierto ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú desplegable móvil */}
      {menuMovilAbierto && (
        <div className="md:hidden border-b border-orange-100 bg-white px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200 shadow-lg">
          {enlaces.map((enlace) => (
            <Link
              key={enlace.ruta}
              to={enlace.ruta}
              onClick={() => setMenuMovilAbierto(false)}
              className={`block px-4 py-3 rounded-xl text-base font-semibold transition ${
                estaActivo(enlace.ruta)
                  ? 'bg-orange-50 text-orange-600 font-bold'
                  : 'text-texto-principal hover:bg-orange-50 hover:text-orange-600'
              }`}
            >
              {enlace.nombre}
            </Link>
          ))}

          {/* Botón de acceso administrativo fácil en móvil */}
          <div className="pt-2 border-t border-gray-100">
            <Link
              to={estaAutenticado ? RUTAS.ADMIN_TABLERO : RUTAS.ADMIN_LOGIN}
              onClick={() => setMenuMovilAbierto(false)}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-orange-800 bg-orange-50 border border-orange-200 transition active:scale-98"
            >
              <ShieldCheck className="w-4 h-4 text-orange-600" />
              <span>{estaAutenticado ? '✦ Ir a mi Panel de Control' : '✦ Acceso Dueña / Administradora'}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

