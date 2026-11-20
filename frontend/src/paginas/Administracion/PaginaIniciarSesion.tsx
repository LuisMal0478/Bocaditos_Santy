import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, Sparkles, AlertCircle, Eye, EyeOff, ArrowLeft, HelpCircle } from 'lucide-react';
import { RUTAS } from '../../utilidades/constantes';
import { servicioAutenticacion } from '../../servicios/servicio_autenticacion';
import { useAutenticacion } from '../../contextos/almacen_autenticacion';
import { useConfiguracion } from '../../contextos/almacen_configuracion';
import { Boton } from '../../componentes/comunes/Boton';
import { MensajeAlerta } from '../../componentes/comunes/MensajeAlerta';

export const PaginaIniciarSesion: React.FC = () => {
  const navigate = useNavigate();
  const { iniciarSesion } = useAutenticacion();
  const { configuracion } = useConfiguracion();

  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [mostrarClave, setMostrarClave] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const alEnviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario.trim() || !clave.trim()) {
      setError('Por favor complete su usuario y contraseña.');
      return;
    }

    setCargando(true);
    setError(null);

    try {
      const respuesta = await servicioAutenticacion.iniciarSesion(usuario, clave);
      if (!respuesta.usuario.is_staff) {
        setError('Este usuario no tiene permisos de administración.');
        setCargando(false);
        return;
      }

      iniciarSesion(respuesta.access, respuesta.usuario);
      navigate(RUTAS.ADMIN_TABLERO);
    } catch (err: any) {
      const msg = err.response?.data?.mensaje || 'Credenciales inválidas. Verifique su usuario y contraseña.';
      setError(msg);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-rosa-200 p-6 sm:p-8 shadow-elevada space-y-6">
        
        {/* Enlace para volver */}
        <Link
          to={RUTAS.INICIO}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-rosa-600 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver a la página principal</span>
        </Link>

        {/* Cabecera amigable con Logo Oficial */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-orange-200 bg-white p-0.5 mx-auto shadow-md">
            <img
              src={configuracion?.logo_url || '/logo-bocaditos-santy.jpg'}
              alt="Bocaditos Santy"
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/logo-bocaditos-santy.jpg';
              }}
            />
          </div>
          <h2 className="font-serif font-bold text-2xl text-texto-principal">
            Panel de la Dueña
          </h2>
          <p className="text-xs text-texto-secundario max-w-xs mx-auto">
            Ingresa para gestionar fácilmente tus productos, precios, colores de la web y solicitudes de tus clientes.
          </p>
        </div>

        {/* Tarjeta de ayuda para no complicarse */}
        <div className="p-3.5 rounded-2xl bg-rosa-50/70 border border-rosa-200 text-xs text-rosa-950 flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-rosa-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-rosa-900">¿Cómo ingresar?</span>
            <span className="text-rosa-800 text-[11px] leading-tight">
              Escribe tu nombre de usuario y contraseña. Si es tu primera vez, utiliza el usuario <strong>admin</strong> y contraseña <strong>admin</strong>.
            </span>
          </div>
        </div>

        {error && (
          <MensajeAlerta
            tipo="error"
            mensaje={error}
            alCerrar={() => setError(null)}
          />
        )}

        <form onSubmit={alEnviar} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-texto-principal uppercase tracking-wider mb-1">
              Usuario Administrador
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Ej: admin"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rosa-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-texto-principal uppercase tracking-wider mb-1">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={mostrarClave ? 'text' : 'password'}
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                placeholder="Tu contraseña secreta"
                className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rosa-400"
                required
              />
              <button
                type="button"
                onClick={() => setMostrarClave(!mostrarClave)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rosa-600 transition"
                title={mostrarClave ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {mostrarClave ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <Boton
              type="submit"
              variante="primario"
              tamano="lg"
              cargando={cargando}
              className="w-full shadow-md text-sm font-bold"
            >
              Entrar a mi Panel
            </Boton>
          </div>
        </form>

        <div className="pt-3 border-t border-gray-100 text-center">
          <p className="text-[11px] text-texto-secundario">
            Bocaditos Santy • Sistema seguro y protegido.
          </p>
        </div>
      </div>
    </div>
  );
};

