import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Sparkles, Cake, Wine, Coffee, ArrowRight } from 'lucide-react';
import { RUTAS } from '../../utilidades/constantes';
import { Boton } from '../comunes/Boton';

export const CalculadoraEvento: React.FC = () => {
  const [invitados, setInvitados] = useState(50);
  const [tipoEvento, setTipoEvento] = useState<'cumpleanos' | 'boda' | 'empresarial' | 'familiar'>('cumpleanos');

  // Multiplicadores según ocasión
  const factores = {
    cumpleanos: { porPersona: 5, saladoPct: 60, dulcePct: 40 },
    boda: { porPersona: 6, saladoPct: 55, dulcePct: 45 },
    empresarial: { porPersona: 4, saladoPct: 70, dulcePct: 30 },
    familiar: { porPersona: 5, saladoPct: 60, dulcePct: 40 },
  };

  const config = factores[tipoEvento];
  const totalPasabocas = invitados * config.porPersona;
  const totalSalados = Math.round((totalPasabocas * config.saladoPct) / 100);
  const totalDulces = totalPasabocas - totalSalados;

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-rosa-100/40 via-white to-rosa-50/70 relative overflow-hidden">
      {/* Salpicaduras decorativas de fondo */}
      <div className="absolute -top-20 -right-20 w-80 h-80 salpicadura-rosa -z-10 opacity-70"></div>
      <div className="absolute -bottom-20 -left-20 w-80 h-80 salpicadura-acento -z-10 opacity-60"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-rosa-200 p-6 sm:p-10 lg:p-14 shadow-2xl relative">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Columna Izquierda: Controles interactivos */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rosa-100 text-rosa-700 text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-rosa-500" />
                  <span>Calculadora interactiva</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-4xl font-bold text-texto-principal">
                  ¿Cuántos pasabocas necesitas para tu evento?
                </h3>
                <p className="text-xs sm:text-sm text-texto-secundario mt-2 leading-relaxed">
                  Calcula al instante la cantidad perfecta de bocaditos dulces y salados según tu número de invitados.
                </p>
              </div>

              {/* Selector de tipo de evento */}
              <div>
                <label className="block text-xs font-bold text-texto-principal uppercase tracking-wider mb-2.5">
                  1. Selecciona el tipo de celebración:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setTipoEvento('cumpleanos')}
                    className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                      tipoEvento === 'cumpleanos'
                        ? 'border-rosa-500 bg-rosa-500 text-white shadow-sm'
                        : 'border-gray-200 hover:border-rosa-300 text-texto-secundario bg-gray-50/50'
                    }`}
                  >
                    <Cake className="w-4 h-4" />
                    <span>Cumpleaños</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTipoEvento('boda')}
                    className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                      tipoEvento === 'boda'
                        ? 'border-rosa-500 bg-rosa-500 text-white shadow-sm'
                        : 'border-gray-200 hover:border-rosa-300 text-texto-secundario bg-gray-50/50'
                    }`}
                  >
                    <Wine className="w-4 h-4" />
                    <span>Boda / Gala</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTipoEvento('empresarial')}
                    className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                      tipoEvento === 'empresarial'
                        ? 'border-rosa-500 bg-rosa-500 text-white shadow-sm'
                        : 'border-gray-200 hover:border-rosa-300 text-texto-secundario bg-gray-50/50'
                    }`}
                  >
                    <Coffee className="w-4 h-4" />
                    <span>Empresarial</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTipoEvento('familiar')}
                    className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                      tipoEvento === 'familiar'
                        ? 'border-rosa-500 bg-rosa-500 text-white shadow-sm'
                        : 'border-gray-200 hover:border-rosa-300 text-texto-secundario bg-gray-50/50'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>Reunión Familiar</span>
                  </button>
                </div>
              </div>

              {/* Slider de Invitados */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-texto-principal uppercase tracking-wider">
                    2. Número aproximado de invitados:
                  </label>
                  <span className="font-serif font-bold text-xl text-rosa-600 bg-rosa-50 px-3 py-1 rounded-xl border border-rosa-200">
                    {invitados} personas
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="200"
                  step="5"
                  value={invitados}
                  onChange={(e) => setInvitados(Number(e.target.value))}
                  className="w-full accent-rosa-500 cursor-pointer h-2.5 bg-rosa-100 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-texto-secundario mt-1 font-semibold">
                  <span>10 invitados</span>
                  <span>100 invitados</span>
                  <span>200 invitados</span>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Tarjeta de Resultado Recomendado */}
            <div className="lg:col-span-5 bg-gradient-to-br from-rosa-500 to-rosa-600 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-rosa-200 block mb-1">
                  Recomendación para tu fiesta
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif font-bold text-4xl sm:text-5xl text-white">
                    {totalPasabocas}
                  </span>
                  <span className="text-sm font-semibold text-rosa-100">pasabocas totales</span>
                </div>
                <p className="text-xs text-rosa-100 mt-2 leading-relaxed">
                  Basado en {config.porPersona} pasabocas por persona para una duración típica de 2 a 4 horas.
                </p>
              </div>

              {/* Desglose Salado / Dulce */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/20">
                <div className="bg-white/15 backdrop-blur-sm p-3.5 rounded-2xl">
                  <span className="text-[11px] text-rosa-100 block">Salados ({config.saladoPct}%)</span>
                  <span className="font-serif font-bold text-2xl text-white block mt-0.5">
                    {totalSalados} unid
                  </span>
                  <span className="text-[10px] text-rosa-200">Empanaditas, deditos, quiches</span>
                </div>

                <div className="bg-white/15 backdrop-blur-sm p-3.5 rounded-2xl">
                  <span className="text-[11px] text-rosa-100 block">Dulces ({config.dulcePct}%)</span>
                  <span className="font-serif font-bold text-2xl text-white block mt-0.5">
                    {totalDulces} unid
                  </span>
                  <span className="text-[10px] text-rosa-200">Mini postres, alfajores, trufas</span>
                </div>
              </div>

              {/* Botón de Acción Directo */}
              <Link to={RUTAS.CATALOGO} className="w-full">
                <button
                  type="button"
                  className="w-full py-3.5 px-4 rounded-full bg-white text-rosa-700 hover:bg-rosa-50 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95"
                >
                  <span>Explorar pasabocas para mi evento</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
