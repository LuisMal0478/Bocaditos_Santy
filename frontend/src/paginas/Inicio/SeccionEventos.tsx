import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Check, ArrowRight } from 'lucide-react';
import { RUTAS } from '../../utilidades/constantes';
import { Boton } from '../../componentes/comunes/Boton';

export const SeccionEventos: React.FC = () => {
  const servicios = [
    'Mesas temáticas de pasabocas dulces y salados',
    'Montajes sencillos y con accesorios de lujo',
    'Estaciones de café para reuniones y empresas',
    'Asesoría en cantidades según tu número de invitados',
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white via-rosa-50/40 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-rosa-200/80 p-8 sm:p-12 lg:p-16 shadow-elevada relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rosa-100 text-rosa-700 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-rosa-500" />
                <span>Servicios integrales para eventos</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-texto-principal leading-tight">
                Hacemos de tu evento una experiencia inolvidable
              </h2>

              <p className="text-base text-texto-secundario leading-relaxed">
                Además de nuestros pasabocas individuales y paquetes, ofrecemos el servicio de montaje de mesas de bocaditos y estaciones de café, adaptadas al estilo y magnitud de tu celebración.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {servicios.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-sm text-texto-principal">
                    <div className="w-5 h-5 rounded-full bg-rosa-100 flex items-center justify-center text-rosa-600 shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <Link to={`${RUTAS.CATALOGO}?categoria=servicios-para-eventos`}>
                  <Boton variante="primario" tamano="md" icono={<ArrowRight className="w-4 h-4" />}>
                    Ver opciones de mesas
                  </Boton>
                </Link>
                <Link to={RUTAS.COTIZACION}>
                  <Boton variante="secundario" tamano="md">
                    Solicitar cotización
                  </Boton>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-tarjeta border-4 border-white bg-rosa-100">
                <img
                  src="/media/productos/pag_7_img_1_X4.png"
                  alt="Mesa de pasabocas con accesorios de lujo"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

