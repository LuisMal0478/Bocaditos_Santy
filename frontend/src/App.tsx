import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BarraNavegacion } from './componentes/estructura/BarraNavegacion';
import { PiePagina } from './componentes/estructura/PiePagina';
import { BotonFlotanteWhatsApp } from './componentes/estructura/BotonFlotanteWhatsApp';
import { BarraFlotanteCotizacion } from './componentes/estructura/BarraFlotanteCotizacion';
import { PaginaInicio } from './paginas/Inicio/PaginaInicio';
import { PaginaCatalogo } from './paginas/Catalogo/PaginaCatalogo';
import { PaginaCotizacion } from './paginas/Cotizacion/PaginaCotizacion';
import { PaginaNosotros } from './paginas/Nosotros/PaginaNosotros';
import { PaginaContacto } from './paginas/Contacto/PaginaContacto';
import { PaginaIniciarSesion } from './paginas/Administracion/PaginaIniciarSesion';
import { TableroControl } from './paginas/Administracion/TableroControl';
import { RUTAS } from './utilidades/constantes';
import { useConfiguracion } from './contextos/almacen_configuracion';

export const App: React.FC = () => {
  const { cargarConfiguracion } = useConfiguracion();

  useEffect(() => {
    cargarConfiguracion();
  }, [cargarConfiguracion]);
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-white">
        <BarraNavegacion />
        
        <main className="flex-1">
          <Routes>
            <Route path={RUTAS.INICIO} element={<PaginaInicio />} />
            <Route path={RUTAS.CATALOGO} element={<PaginaCatalogo />} />
            <Route path={RUTAS.COTIZACION} element={<PaginaCotizacion />} />
            <Route path={RUTAS.NOSOTROS} element={<PaginaNosotros />} />
            <Route path={RUTAS.SERVICIOS_EVENTOS} element={<Navigate to={`${RUTAS.CATALOGO}?categoria=servicios-para-eventos`} replace />} />
            <Route path={RUTAS.CONTACTO} element={<PaginaContacto />} />
            
            {/* Rutas administrativas */}
            <Route path={RUTAS.ADMIN_LOGIN} element={<PaginaIniciarSesion />} />
            <Route path={RUTAS.ADMIN_TABLERO} element={<TableroControl />} />

            {/* Redirección por defecto */}
            <Route path="*" element={<Navigate to={RUTAS.INICIO} replace />} />
          </Routes>
        </main>

        <PiePagina />
        <BarraFlotanteCotizacion />
        <BotonFlotanteWhatsApp />
      </div>
    </BrowserRouter>
  );
};

export default App;

