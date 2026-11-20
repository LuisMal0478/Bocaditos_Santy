import React from 'react';
import { Truck, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const SeccionValores: React.FC = () => {
  const caracteristicas = [
    {
      icono: <Truck className="w-6 h-6 text-orange-500" />,
      titulo: 'Entrega rápida',
      descripcion: 'Puntualidad y máxima frescura garantizada en tu evento o domicilio.',
    },
    {
      icono: <ShieldCheck className="w-6 h-6 text-orange-500" />,
      titulo: 'Ingredientes de calidad',
      descripcion: 'Selección de materias primas de primera para el sabor más auténtico.',
    },
    {
      icono: <Heart className="w-6 h-6 text-orange-500" />,
      titulo: 'Hecho con amor',
      descripcion: 'Preparados artesanalmente con dedicación para compartir momentos felices.',
    },
    {
      icono: <Sparkles className="w-6 h-6 text-orange-500" />,
      titulo: 'Sabor inigualable',
      descripcion: 'Crujientes, deliciosos y diseñados para encantar a todos tus invitados.',
    },
  ];

  return (
    <section className="py-8 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {caracteristicas.map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3.5 p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-orange-50/70 hover:bg-orange-100/80 border border-orange-200/80 shadow-xs hover:shadow-sm transition-all transform hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-2xl bg-white shadow-xs flex items-center justify-center shrink-0 border border-orange-100">
                {item.icono}
              </div>
              <div>
                <h4 className="font-serif font-extrabold text-sm sm:text-base text-texto-principal">
                  {item.titulo}
                </h4>
                <p className="text-[11px] sm:text-xs text-texto-secundario mt-1 leading-relaxed hidden sm:block">
                  {item.descripcion}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

