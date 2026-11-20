import React from 'react';
import { Utensils, MessageCircle, HeartHandshake, Sparkles } from 'lucide-react';

export const SeccionComoFunciona: React.FC = () => {
  const pasos = [
    {
      numero: '01',
      icono: <Utensils className="w-7 h-7 text-rosa-500" />,
      titulo: 'Elige tus pasabocas',
      descripcion:
        'Explora nuestro catálogo con fotografías reales, selecciona las cantidades y presentaciones que necesitas.',
    },
    {
      numero: '02',
      icono: <MessageCircle className="w-7 h-7 text-rosa-500" />,
      titulo: 'Cotiza por WhatsApp',
      descripcion:
        'Completa los datos de tu fiesta o reunión y envía tu lista organizada con un solo clic directamente a nuestro WhatsApp.',
    },
    {
      numero: '03',
      icono: <HeartHandshake className="w-7 h-7 text-rosa-500" />,
      titulo: 'Celebra momentos felices',
      descripcion:
        'Confirmamos tu pedido y horneamos todo fresco y listo para compartir y disfrutar con tus invitados.',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white border-y border-rosa-100/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabecera */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rosa-100 text-rosa-700 text-xs font-bold uppercase tracking-widest mb-2">
            <Sparkles className="w-3.5 h-3.5 text-rosa-500" />
            <span>Fácil, Rápido y Personalizado</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-texto-principal">
            Cómo ordenar tus pasabocas
          </h2>
          <p className="text-xs sm:text-sm text-texto-secundario mt-2">
            Sin registros complicados ni pasarelas de pago. Te asesoramos directamente.
          </p>
        </div>

        {/* 3 Pasos con Estilo Minimalista y Elegante */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
          {pasos.map((p, idx) => (
            <div
              key={idx}
              className="text-center p-6 rounded-3xl bg-rosa-50/30 hover:bg-rosa-50/70 border border-rosa-100/60 transition-all duration-300 hover:-translate-y-1 group"
            >
              {/* Ícono circular */}
              <div className="relative mx-auto w-20 h-20 rounded-full bg-white border-2 border-rosa-200/80 shadow-md flex items-center justify-center mb-5 group-hover:scale-110 group-hover:border-rosa-400 transition-all">
                <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-rosa-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {p.numero}
                </span>
                {p.icono}
              </div>

              <h3 className="font-serif font-bold text-xl text-texto-principal mb-2">
                {p.titulo}
              </h3>
              <p className="text-xs sm:text-sm text-texto-secundario leading-relaxed max-w-xs mx-auto">
                {p.descripcion}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
