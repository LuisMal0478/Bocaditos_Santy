import React from 'react';
import { SeccionPrincipal } from './SeccionPrincipal';
import { SeccionValores } from './SeccionValores';
import { SeccionDestacados } from './SeccionDestacados';
import { SeccionSobreNosotros } from './SeccionSobreNosotros';
import { CalculadoraEvento } from '../../componentes/inicio/CalculadoraEvento';
import { SeccionComoFunciona } from './SeccionComoFunciona';
import { SeccionEventos } from './SeccionEventos';
import { SeccionGaleriaEventos } from './SeccionGaleriaEventos';

export const PaginaInicio: React.FC = () => {
  return (
    <div className="space-y-4 sm:space-y-8">
      <SeccionPrincipal />
      <SeccionValores />
      <SeccionDestacados />
      <SeccionSobreNosotros />
      <CalculadoraEvento />
      <SeccionComoFunciona />
      <SeccionEventos />
      <SeccionGaleriaEventos />
    </div>
  );
};
