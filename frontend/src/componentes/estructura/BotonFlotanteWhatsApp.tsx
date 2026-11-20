import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useConfiguracion } from '../../contextos/almacen_configuracion';

export const BotonFlotanteWhatsApp: React.FC = () => {
  const { configuracion } = useConfiguracion();

  const numeroRaw = configuracion?.numero_whatsapp || '573000000000';
  const soloDigitos = numeroRaw.replace(/\D/g, '');
  const numeroWhatsapp = soloDigitos.length === 10 ? `57${soloDigitos}` : soloDigitos;
  const mensajeDefault = configuracion?.mensaje_bienvenida_whatsapp || '¡Hola Bocaditos Santy! Vengo de su página web y deseo consultar sobre sus pasabocas para mi evento.';

  const urlChat = `https://api.whatsapp.com/send?phone=${numeroWhatsapp}&text=${encodeURIComponent(mensajeDefault)}`;

  return (
    <a
      href={urlChat}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 group flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-elevada hover:shadow-2xl transition-all duration-300 active:scale-95"
      aria-label="Contactar por WhatsApp"
    >
      <div className="relative">
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping opacity-75"></span>
      </div>
      <span className="text-sm font-bold tracking-wide hidden sm:inline">
        ¿Cotizamos por WhatsApp?
      </span>
    </a>
  );
};

