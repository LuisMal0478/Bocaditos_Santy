import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Clock, Award, ArrowRight } from 'lucide-react';
import { RUTAS } from '../../utilidades/constantes';
import { Boton } from '../../componentes/comunes/Boton';

export const PaginaNosotros: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      
      {/* Cabecera */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rosa-100 text-rosa-700 text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-rosa-500" />
          <span>Nuestra Historia & Pasión</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-texto-principal tracking-tight">
          Creamos momentos felices
        </h1>
        <p className="text-base sm:text-lg text-texto-secundario mt-4 leading-relaxed">
          En Bocaditos Santy nos dedicamos con amor a endulzar y complementar cada una de tus celebraciones con pasabocas variados y montajes especiales.
        </p>
      </div>

      {/* Contenido con imagen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
        <div className="lg:col-span-6 relative">
          <div className="rounded-3xl overflow-hidden shadow-elevada border-4 border-white aspect-[4/3] bg-rosa-100">
            <img
              src="/media/productos/pag_7_img_3_X7.png"
              alt="Mesa de pasabocas Bocaditos Santy"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          <h2 className="font-serif text-3xl font-bold text-texto-principal">
            El arte de compartir alrededor de la mesa
          </h2>
          <p className="text-texto-secundario leading-relaxed text-sm sm:text-base">
            Cada reunión familiar, cumpleaños, grado o evento corporativo merece una atención especial. Por eso preparamos una amplia gama de opciones dulces y saladas pensadas para complacer todos los gustos de tus invitados.
          </p>
          <p className="text-texto-secundario leading-relaxed text-sm sm:text-base">
            Trabajamos bajo solicitud previa para ofrecerte una cotización adaptada a las necesidades puntuales de tu fecha, garantizando puntualidad y una presentación cuidada en cada detalle.
          </p>

          <div className="pt-2">
            <Link to={RUTAS.CATALOGO}>
              <Boton variante="primario" tamano="md" icono={<ArrowRight className="w-4 h-4" />}>
                Conocer nuestros productos
              </Boton>
            </Link>
          </div>
        </div>
      </div>

      {/* Pilares */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 border-t border-rosa-100">
        <div className="p-6 rounded-3xl bg-rosa-50/60 border border-rosa-100 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-rosa-500 mx-auto">
            <Heart className="w-6 h-6" />
          </div>
          <h4 className="font-serif font-bold text-lg text-texto-principal">Dedicación</h4>
          <p className="text-xs text-texto-secundario leading-relaxed">
            Cuidamos cada receta y acabado con el mayor esmero para tus celebraciones.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-rosa-50/60 border border-rosa-100 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-rosa-500 mx-auto">
            <Clock className="w-6 h-6" />
          </div>
          <h4 className="font-serif font-bold text-lg text-texto-principal">Puntualidad</h4>
          <p className="text-xs text-texto-secundario leading-relaxed">
            Coordinamos los horarios de entrega con anticipación para la tranquilidad de tu evento.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-rosa-50/60 border border-rosa-100 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-rosa-500 mx-auto">
            <Award className="w-6 h-6" />
          </div>
          <h4 className="font-serif font-bold text-lg text-texto-principal">Variedad</h4>
          <p className="text-xs text-texto-secundario leading-relaxed">
            Más de 50 opciones en bocaditos, bebidas y mesas con accesorios de lujo.
          </p>
        </div>
      </div>
    </div>
  );
};

