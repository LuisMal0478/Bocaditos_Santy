import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Layers,
  Inbox,
  Settings,
  LogOut,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  MessageCircle,
  Search,
  Filter,
  DollarSign,
  Save,
  Tag,
  Palette,
  Type,
  User,
  Key,
  Shield,
  Upload,
  Image as ImageIcon,
  Facebook,
  Instagram,
  Mail
} from 'lucide-react';
import { RUTAS } from '../../utilidades/constantes';
import { useAutenticacion } from '../../contextos/almacen_autenticacion';
import { useConfiguracion } from '../../contextos/almacen_configuracion';
import { servicioProductos } from '../../servicios/servicio_productos';
import { servicioCategorias } from '../../servicios/servicio_categorias';
import { servicioCotizaciones } from '../../servicios/servicio_cotizaciones';
import { servicioNegocio } from '../../servicios/servicio_negocio';
import { servicioAutenticacion } from '../../servicios/servicio_autenticacion';
import { CotizacionResumenAdmin, EstadoCotizacion } from '../../tipos/cotizacion';
import { Categoria } from '../../tipos/categoria';
import { ProductoLista, ProductoDetalle, PresentacionProducto } from '../../tipos/producto';
import { ConfiguracionNegocio } from '../../tipos/negocio';
import { Boton } from '../../componentes/comunes/Boton';
import { Insignia } from '../../componentes/comunes/Insignia';
import { Modal } from '../../componentes/comunes/Modal';
import { Cargando } from '../../componentes/comunes/Cargando';
import { MensajeAlerta } from '../../componentes/comunes/MensajeAlerta';
import { formatearMoneda } from '../../utilidades/formateadores';

// Paletas temáticas de 1 clic para Bocaditos Santy
const PALETAS_PREDEFINIDAS = [
  {
    nombre: 'Rosa Santy Clásico',
    descripcion: 'Identidad original dulce y acogedora con tonos frambuesa y pasteles suaves.',
    principal: '#D63384',
    secundario: '#FCE8F0',
    acento: '#F8D7E5',
    fondo: '#FFFFFF',
    texto: '#29232A',
    fuenteTitulos: 'Playfair Display',
    fuenteCuerpo: 'Plus Jakarta Sans',
  },
  {
    nombre: 'Fucsia Festivo',
    descripcion: 'Tonos alegres e intensos, perfectos para cumpleaños y celebraciones.',
    principal: '#C2185B',
    secundario: '#FCE4EC',
    acento: '#F8BBD0',
    fondo: '#FFFFFF',
    texto: '#1F1A24',
    fuenteTitulos: 'Montserrat',
    fuenteCuerpo: 'Plus Jakarta Sans',
  },
  {
    nombre: 'Oro Rosa & Bodas de Gala',
    descripcion: 'Paleta distinguida y romántica para recepciones de etiqueta y bodas.',
    principal: '#B76E79',
    secundario: '#FFF0F5',
    acento: '#F7D6D0',
    fondo: '#FFFCFA',
    texto: '#2B2326',
    fuenteTitulos: 'Cormorant Garamond',
    fuenteCuerpo: 'Inter',
  },
  {
    nombre: 'Pastelería Francesa Romántica',
    descripcion: 'Estilo tierno de alta repostería artesanal con toques florales.',
    principal: '#E05297',
    secundario: '#FDF2F7',
    acento: '#F1ADC9',
    fondo: '#FFFFFF',
    texto: '#261C28',
    fuenteTitulos: 'Lora',
    fuenteCuerpo: 'Poppins',
  },
  {
    nombre: 'Ciruela & Lavanda Gourmet',
    descripcion: 'Acabado sofisticado para cócteles y eventos empresariales.',
    principal: '#8E44AD',
    secundario: '#F4ECF7',
    acento: '#E8DAEF',
    fondo: '#FAFAFC',
    texto: '#221B28',
    fuenteTitulos: 'Cinzel',
    fuenteCuerpo: 'Nunito',
  },
];

// Opciones de Tipografías para Títulos
const FUENTES_TITULOS_OPCIONES = [
  { valor: 'Playfair Display', etiqueta: 'Playfair Display (Elegante & Clásica de Repostería)' },
  { valor: 'Cormorant Garamond', etiqueta: 'Cormorant Garamond (Gourmet Clásica & Bodas)' },
  { valor: 'Montserrat', etiqueta: 'Montserrat (Moderna, Geométrica y Fresca)' },
  { valor: 'Great Vibes', etiqueta: 'Great Vibes (Caligráfica y Romántica)' },
  { valor: 'Lora', etiqueta: 'Lora (Editorial Contemporánea & Suave)' },
  { valor: 'Cinzel', etiqueta: 'Cinzel (Lujosa y Solemne para Galas)' },
  { valor: 'Plus Jakarta Sans', etiqueta: 'Plus Jakarta Sans (Limpia & Minimalista)' },
];

// Opciones de Tipografías para Textos
const FUENTES_CUERPO_OPCIONES = [
  { valor: 'Plus Jakarta Sans', etiqueta: 'Plus Jakarta Sans (Moderna y Altamente Legible)' },
  { valor: 'Inter', etiqueta: 'Inter (Precisa, Clara y Formal)' },
  { valor: 'Poppins', etiqueta: 'Poppins (Redondeada, Cálida y Amigable)' },
  { valor: 'Roboto', etiqueta: 'Roboto (Estándar y Equilibrada)' },
  { valor: 'Nunito', etiqueta: 'Nunito (Cálida, Cercana y Suave)' },
];

export const TableroControl: React.FC = () => {
  const navigate = useNavigate();
  const { usuario, estaAutenticado, cerrarSesion, actualizarUsuario } = useAutenticacion();
  const { aplicarTemaVisual, actualizarConfiguracion } = useConfiguracion();

  useEffect(() => {
    if (!estaAutenticado) {
      navigate(RUTAS.ADMIN_LOGIN);
    }
  }, [estaAutenticado, navigate]);

  const [pestañaActiva, setPestañaActiva] = useState<'cotizaciones' | 'productos' | 'categorias' | 'configuracion' | 'personalizacion' | 'perfil'>('productos');

  // Datos principales
  const [cotizaciones, setCotizaciones] = useState<CotizacionResumenAdmin[]>([]);
  const [productos, setProductos] = useState<ProductoLista[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [configuracion, setConfiguracion] = useState<ConfiguracionNegocio | null>(null);

  const [cargando, setCargando] = useState(true);
  const [mensajeAlerta, setMensajeAlerta] = useState<{ tipo: 'exito' | 'error'; texto: string } | null>(null);

  // Filtros de Productos
  const [busquedaProd, setBusquedaProd] = useState('');
  const [filtroCatProd, setFiltroCatProd] = useState<string>('todas');
  const [filtroEstadoProd, setFiltroEstadoProd] = useState<'todos' | 'activos' | 'inactivos' | 'en_inicio'>('todos');

  // Filtros de Cotizaciones
  const [filtroEstadoCot, setFiltroEstadoCot] = useState<string>('todas');

  // Modal Crear / Editar Producto
  const [modalProductoAbierto, setModalProductoAbierto] = useState(false);
  const [productoEnEdicion, setProductoEnEdicion] = useState<ProductoLista | null>(null);
  const [formProdNombre, setFormProdNombre] = useState('');
  const [formProdCategoria, setFormProdCategoria] = useState<number>(1);
  const [formProdDescripcion, setFormProdDescripcion] = useState('');
  const [formProdDestacado, setFormProdDestacado] = useState(false);
  const [formProdDisponible, setFormProdDisponible] = useState(true);
  const [formProdArchivoImagen, setFormProdArchivoImagen] = useState<File | null>(null);
  const [formPresNombre, setFormPresNombre] = useState('Paquete x 20 unidades');
  const [formPresUnidades, setFormPresUnidades] = useState(20);
  const [formPresPrecio, setFormPresPrecio] = useState<string>('');
  const [formPresTipoPrecio, setFormPresTipoPrecio] = useState<'FIJO' | 'A_COTIZAR'>('FIJO');
  const [formPresVerificacion, setFormPresVerificacion] = useState<'PENDIENTE' | 'CONFIRMADO'>('PENDIENTE');
  const [guardandoProducto, setGuardandoProducto] = useState(false);

  // Modal Presentaciones de Producto
  const [modalPresentacionesAbierto, setModalPresentacionesAbierto] = useState(false);
  const [productoPresentaciones, setProductoPresentaciones] = useState<ProductoLista | null>(null);
  const [listaPresentaciones, setListaPresentaciones] = useState<PresentacionProducto[]>([]);
  const [nuevaPresNombre, setNuevaPresNombre] = useState('');
  const [nuevaPresUnidades, setNuevaPresUnidades] = useState(1);
  const [nuevaPresPrecio, setNuevaPresPrecio] = useState('');
  const [nuevaPresTipo, setNuevaPresTipo] = useState('FIJO');
  const [nuevaPresVerificacion, setNuevaPresVerificacion] = useState('PENDIENTE');
  const [guardandoPres, setGuardandoPres] = useState(false);

  // Edición rápida de presentación existente
  const [presEditandoId, setPresEditandoId] = useState<number | null>(null);
  const [editPresPrecio, setEditPresPrecio] = useState('');
  const [editPresVerificacion, setEditPresVerificacion] = useState('CONFIRMADO');
  const [guardandoEditPres, setGuardandoEditPres] = useState(false);

  // Modal Crear / Editar Categoría
  const [modalCategoriaAbierto, setModalCategoriaAbierto] = useState(false);
  const [categoriaEnEdicion, setCategoriaEnEdicion] = useState<Categoria | null>(null);
  const [formCatNombre, setFormCatNombre] = useState('');
  const [formCatDescripcion, setFormCatDescripcion] = useState('');
  const [formCatOrden, setFormCatOrden] = useState(1);
  const [formCatImagenUrl, setFormCatImagenUrl] = useState('');
  const [guardandoCategoria, setGuardandoCategoria] = useState(false);

  // Formulario Configuración del Negocio
  const [formConfWhatsapp, setFormConfWhatsapp] = useState('');
  const [formConfEslogan, setFormConfEslogan] = useState('');
  const [formConfInstagram, setFormConfInstagram] = useState('');
  const [formConfFacebook, setFormConfFacebook] = useState('');
  const [formConfEmail, setFormConfEmail] = useState('');
  const [formConfMensaje, setFormConfMensaje] = useState('');
  const [formConfDescripcion, setFormConfDescripcion] = useState('');
  const [formConfCobertura, setFormConfCobertura] = useState('');
  const [guardandoConfiguracion, setGuardandoConfiguracion] = useState(false);

  // Estados de Personalización Visual Web (Colores, Fuentes y Textos)
  const [formTemaPrincipal, setFormTemaPrincipal] = useState('#D63384');
  const [formTemaSecundario, setFormTemaSecundario] = useState('#FCE8F0');
  const [formTemaAcento, setFormTemaAcento] = useState('#F8D7E5');
  const [formTemaFondo, setFormTemaFondo] = useState('#FFFFFF');
  const [formTemaTexto, setFormTemaTexto] = useState('#29232A');
  const [formTemaFuenteTitulos, setFormTemaFuenteTitulos] = useState('Playfair Display');
  const [formTemaFuenteCuerpo, setFormTemaFuenteCuerpo] = useState('Plus Jakarta Sans');
  const [formTemaTituloHero, setFormTemaTituloHero] = useState('Momentos especiales, sabores inolvidables');
  const [formTemaSubtituloHero, setFormTemaSubtituloHero] = useState('En Bocaditos Santy hacemos de cada celebración un momento especial con deliciosos pasabocas preparados con dedicación.');
  const [formTemaTextoBotonHero, setFormTemaTextoBotonHero] = useState('Explorar catálogo');
  const [formTemaMensajeAnuncio, setFormTemaMensajeAnuncio] = useState('¡Haz tu solicitud de cotización con anticipación para tus eventos y celebraciones!');
  const [formTemaMostrarAnuncio, setFormTemaMostrarAnuncio] = useState(true);
  const [guardandoPersonalizacion, setGuardandoPersonalizacion] = useState(false);

  // Estados para Gestión del Logo Oficial
  const [formLogoArchivo, setFormLogoArchivo] = useState<File | null>(null);
  const [formLogoUrl, setFormLogoUrl] = useState('');
  const [formLogoPreview, setFormLogoPreview] = useState<string | null>(null);
  const [guardandoLogo, setGuardandoLogo] = useState(false);

  // Estados para Perfil de Administrador (Credenciales y Seguridad)
  const [formPerfilUsername, setFormPerfilUsername] = useState('');
  const [formPerfilFirstName, setFormPerfilFirstName] = useState('');
  const [formPerfilEmail, setFormPerfilEmail] = useState('');
  const [formPerfilClaveActual, setFormPerfilClaveActual] = useState('');
  const [formPerfilClaveNueva, setFormPerfilClaveNueva] = useState('');
  const [formPerfilClaveConfirm, setFormPerfilClaveConfirm] = useState('');
  const [mostrarClaveActual, setMostrarClaveActual] = useState(false);
  const [mostrarClaveNueva, setMostrarClaveNueva] = useState(false);
  const [mostrarClaveConfirm, setMostrarClaveConfirm] = useState(false);
  const [guardandoPerfil, setGuardandoPerfil] = useState(false);

  // Modal Detalle Cotización
  const [modalCotizacionAbierto, setModalCotizacionAbierto] = useState(false);
  const [cotizacionDetalle, setCotizacionDetalle] = useState<any | null>(null);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [prods, cats, cots, conf] = await Promise.all([
        servicioProductos.obtenerTodos({ sin_paginar: true, admin: true }),
        servicioCategorias.obtenerTodasAdmin(),
        servicioCotizaciones.obtenerTodasAdmin(),
        servicioNegocio.obtener(),
      ]);

      setProductos(prods);
      setCategorias(cats);
      setCotizaciones(cots);
      setConfiguracion(conf);

      // Cargar configuración en el formulario
      if (conf) {
        setFormConfWhatsapp(conf.numero_whatsapp || '');
        setFormConfEslogan(conf.eslogan || '');
        setFormConfInstagram(conf.instagram || '');
        setFormConfFacebook(conf.facebook || '');
        setFormConfEmail(conf.email_contacto || '');
        setFormConfMensaje(conf.mensaje_bienvenida_whatsapp || '');
        setFormConfDescripcion(conf.descripcion_negocio || '');
        setFormConfCobertura(conf.zona_cobertura || '');
        setFormLogoUrl(conf.logo_url || '');

        // Cargar personalización visual web
        setFormTemaPrincipal(conf.color_principal || '#D63384');
        setFormTemaSecundario(conf.color_secundario || '#FCE8F0');
        setFormTemaAcento(conf.color_acento || '#F8D7E5');
        setFormTemaFondo(conf.color_fondo || '#FFFFFF');
        setFormTemaTexto(conf.color_texto || '#29232A');
        setFormTemaFuenteTitulos(conf.fuente_titulos || 'Playfair Display');
        setFormTemaFuenteCuerpo(conf.fuente_cuerpo || 'Plus Jakarta Sans');
        setFormTemaTituloHero(conf.titulo_hero || 'Momentos especiales, sabores inolvidables');
        setFormTemaSubtituloHero(conf.subtitulo_hero || 'En Bocaditos Santy hacemos de cada celebración un momento especial con deliciosos pasabocas preparados con dedicación.');
        setFormTemaTextoBotonHero(conf.texto_boton_hero || 'Explorar catálogo');
        setFormTemaMensajeAnuncio(conf.mensaje_anuncio || '');
        setFormTemaMostrarAnuncio(conf.mostrar_anuncio ?? true);
      }

      if (cats.length > 0 && !formProdCategoria) {
        setFormProdCategoria(cats[0].id);
      }
    } catch (error) {
      console.error('Error al cargar datos administrativos:', error);
      setMensajeAlerta({ tipo: 'error', texto: 'No fue posible cargar los datos del panel.' });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (estaAutenticado) {
      cargarDatos();
    }
  }, [estaAutenticado]);

  useEffect(() => {
    if (usuario) {
      setFormPerfilUsername(usuario.username || '');
      setFormPerfilFirstName(usuario.first_name || '');
      setFormPerfilEmail(usuario.email || '');
    }
  }, [usuario]);

  // ==========================================
  // GESTIÓN DE PRODUCTOS
  // ==========================================
  const abrirModalCrearProducto = () => {
    setProductoEnEdicion(null);
    setFormProdNombre('');
    setFormProdCategoria(categorias[0]?.id || 1);
    setFormProdDescripcion('');
    setFormProdDestacado(false);
    setFormProdDisponible(true);
    setFormProdArchivoImagen(null);
    setFormPresNombre('Paquete x 20 unidades');
    setFormPresUnidades(20);
    setFormPresPrecio('');
    setFormPresTipoPrecio('FIJO');
    setFormPresVerificacion('PENDIENTE');
    setModalProductoAbierto(true);
  };

  const abrirModalEditarProducto = (prod: ProductoLista) => {
    setProductoEnEdicion(prod);
    setFormProdNombre(prod.nombre);
    setFormProdCategoria(prod.categoria_id);
    setFormProdDescripcion(prod.descripcion || '');
    setFormProdDestacado(prod.esta_destacado);
    setFormProdDisponible(prod.esta_disponible);
    setFormProdArchivoImagen(null);

    const pres = prod.presentacion_predeterminada;
    setFormPresNombre(pres ? pres.nombre : 'Paquete x 20 unidades');
    setFormPresUnidades(pres ? pres.cantidad_unidades : 20);
    setFormPresPrecio(pres && pres.precio ? String(pres.precio) : '');
    setFormPresTipoPrecio(pres ? pres.tipo_precio : 'FIJO');
    setFormPresVerificacion(pres && pres.estado_verificacion_precio === 'CONFIRMADO' ? 'CONFIRMADO' : 'PENDIENTE');

    setModalProductoAbierto(true);
  };

  const guardarProducto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formProdNombre.trim()) {
      setMensajeAlerta({ tipo: 'error', texto: 'El nombre del producto es obligatorio.' });
      return;
    }

    setGuardandoProducto(true);
    try {
      const formData = new FormData();
      formData.append('nombre', formProdNombre.trim());
      formData.append('categoria', String(formProdCategoria));
      formData.append('descripcion', formProdDescripcion.trim());
      formData.append('esta_destacado', String(formProdDestacado));
      formData.append('esta_disponible', String(formProdDisponible));

      // Presentación inicial
      formData.append('presentacion_nombre', formPresNombre.trim());
      formData.append('presentacion_unidades', String(formPresUnidades));
      formData.append('presentacion_tipo_precio', formPresTipoPrecio);
      formData.append('presentacion_estado_verificacion', formPresVerificacion);
      if (formPresPrecio && formPresTipoPrecio === 'FIJO') {
        formData.append('presentacion_precio', formPresPrecio);
      }

      if (formProdArchivoImagen) {
        formData.append('archivo_imagen', formProdArchivoImagen);
      }

      if (productoEnEdicion) {
        await servicioProductos.actualizar(productoEnEdicion.id, formData);
        setMensajeAlerta({ tipo: 'exito', texto: `Producto '${formProdNombre}' actualizado exitosamente.` });
      } else {
        await servicioProductos.crear(formData);
        setMensajeAlerta({ tipo: 'exito', texto: `Producto '${formProdNombre}' creado exitosamente con su presentación.` });
      }

      setModalProductoAbierto(false);
      cargarDatos();
    } catch (err: any) {
      const msg = err.response?.data?.mensaje || 'Error al guardar el producto.';
      setMensajeAlerta({ tipo: 'error', texto: msg });
    } finally {
      setGuardandoProducto(false);
    }
  };

  const alternarActivoProducto = async (id: number) => {
    try {
      const resp = await servicioProductos.alternarActivo(id);
      setMensajeAlerta({ tipo: 'exito', texto: resp.mensaje });
      setProductos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, esta_activo: resp.esta_activo } : p))
      );
    } catch {
      setMensajeAlerta({ tipo: 'error', texto: 'No se pudo alternar el estado del producto.' });
    }
  };

  const alternarDestacadoProducto = async (id: number) => {
    try {
      const resp = await servicioProductos.alternarDestacado(id);
      setMensajeAlerta({ tipo: 'exito', texto: resp.mensaje });
      setProductos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, esta_destacado: resp.esta_destacado } : p))
      );
    } catch {
      setMensajeAlerta({ tipo: 'error', texto: 'No se pudo alternar producto destacado.' });
    }
  };

  const eliminarProducto = async (prod: ProductoLista) => {
    if (!window.confirm(`¿Estás seguro de desactivar/eliminar el producto '${prod.nombre}'?`)) {
      return;
    }
    try {
      const resp = await servicioProductos.eliminar(prod.id);
      setMensajeAlerta({ tipo: 'exito', texto: resp.mensaje });
      cargarDatos();
    } catch {
      setMensajeAlerta({ tipo: 'error', texto: 'Error al desactivar el producto.' });
    }
  };

  // ==========================================
  // GESTIÓN DE PRESENTACIONES DE PRODUCTO
  // ==========================================
  const abrirModalPresentaciones = async (prod: ProductoLista) => {
    setProductoPresentaciones(prod);
    setNuevaPresNombre('Por unidad');
    setNuevaPresUnidades(1);
    setNuevaPresPrecio('');
    setNuevaPresTipo('FIJO');
    setNuevaPresVerificacion('PENDIENTE');

    try {
      const pres = await servicioProductos.obtenerPresentaciones(prod.id);
      setListaPresentaciones(pres);
      setModalPresentacionesAbierto(true);
    } catch {
      setMensajeAlerta({ tipo: 'error', texto: 'Error al cargar presentaciones del producto.' });
    }
  };

  const agregarPresentacion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productoPresentaciones || !nuevaPresNombre.trim()) return;

    setGuardandoPres(true);
    try {
      await servicioProductos.crearPresentacion({
        producto_id: productoPresentaciones.id,
        nombre: nuevaPresNombre.trim(),
        cantidad_unidades: nuevaPresUnidades,
        precio: nuevaPresPrecio ? parseFloat(nuevaPresPrecio) : null,
        tipo_precio: nuevaPresTipo,
        estado_verificacion_precio: nuevaPresVerificacion,
      });

      const actualizadas = await servicioProductos.obtenerPresentaciones(productoPresentaciones.id);
      setListaPresentaciones(actualizadas);
      setNuevaPresNombre('');
      setNuevaPresPrecio('');
      setMensajeAlerta({ tipo: 'exito', texto: 'Nueva presentación agregada exitosamente.' });
      cargarDatos();
    } catch (err: any) {
      setMensajeAlerta({ tipo: 'error', texto: 'No se pudo agregar la presentación.' });
    } finally {
      setGuardandoPres(false);
    }
  };

  const eliminarPresentacion = async (presId: number) => {
    if (!window.confirm('¿Desea eliminar esta presentación?')) return;
    try {
      await servicioProductos.eliminarPresentacion(presId);
      if (productoPresentaciones) {
        const actualizadas = await servicioProductos.obtenerPresentaciones(productoPresentaciones.id);
        setListaPresentaciones(actualizadas);
      }
      setMensajeAlerta({ tipo: 'exito', texto: 'Presentación eliminada.' });
      cargarDatos();
    } catch {
      setMensajeAlerta({ tipo: 'error', texto: 'No se pudo eliminar la presentación.' });
    }
  };

  const iniciarEdicionPresentacion = (p: PresentacionProducto) => {
    setPresEditandoId(p.id);
    setEditPresPrecio(p.precio ? String(p.precio) : '');
    setEditPresVerificacion(p.estado_verificacion_precio);
  };

  const cancelarEdicionPresentacion = () => {
    setPresEditandoId(null);
    setEditPresPrecio('');
  };

  const guardarEdicionPresentacion = async (presId: number) => {
    setGuardandoEditPres(true);
    try {
      await servicioProductos.actualizarPresentacion(presId, {
        precio: editPresPrecio ? parseFloat(editPresPrecio) : null,
        estado_verificacion_precio: editPresVerificacion as any,
      });
      if (productoPresentaciones) {
        const actualizadas = await servicioProductos.obtenerPresentaciones(productoPresentaciones.id);
        setListaPresentaciones(actualizadas);
      }
      setPresEditandoId(null);
      setMensajeAlerta({ tipo: 'exito', texto: '¡Precio de la presentación actualizado exitosamente!' });
      cargarDatos();
    } catch {
      setMensajeAlerta({ tipo: 'error', texto: 'No se pudo actualizar el precio de la presentación.' });
    } finally {
      setGuardandoEditPres(false);
    }
  };

  // ==========================================
  // GESTIÓN DE CATEGORÍAS
  // ==========================================
  const abrirModalCrearCategoria = () => {
    setCategoriaEnEdicion(null);
    setFormCatNombre('');
    setFormCatDescripcion('');
    setFormCatOrden(categorias.length + 1);
    setFormCatImagenUrl('');
    setModalCategoriaAbierto(true);
  };

  const abrirModalEditarCategoria = (cat: Categoria) => {
    setCategoriaEnEdicion(cat);
    setFormCatNombre(cat.nombre);
    setFormCatDescripcion(cat.descripcion || '');
    setFormCatOrden(cat.orden);
    setFormCatImagenUrl(cat.imagen_url || '');
    setModalCategoriaAbierto(true);
  };

  const guardarCategoria = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCatNombre.trim()) {
      setMensajeAlerta({ tipo: 'error', texto: 'El nombre de la categoría es obligatorio.' });
      return;
    }

    setGuardandoCategoria(true);
    try {
      const datos = {
        nombre: formCatNombre.trim(),
        descripcion: formCatDescripcion.trim(),
        orden: formCatOrden,
        imagen_url: formCatImagenUrl.trim(),
      };

      if (categoriaEnEdicion) {
        await servicioCategorias.actualizar(categoriaEnEdicion.id, datos);
        setMensajeAlerta({ tipo: 'exito', texto: `Categoría '${formCatNombre}' actualizada.` });
      } else {
        await servicioCategorias.crear(datos);
        setMensajeAlerta({ tipo: 'exito', texto: `Categoría '${formCatNombre}' creada.` });
      }

      setModalCategoriaAbierto(false);
      cargarDatos();
    } catch (err: any) {
      const msg = err.response?.data?.mensaje || 'Error al guardar la categoría.';
      setMensajeAlerta({ tipo: 'error', texto: msg });
    } finally {
      setGuardandoCategoria(false);
    }
  };

  const alternarActivaCategoria = async (id: number) => {
    try {
      const resp = await servicioCategorias.alternarActiva(id);
      setMensajeAlerta({ tipo: 'exito', texto: resp.mensaje });
      cargarDatos();
    } catch {
      setMensajeAlerta({ tipo: 'error', texto: 'No se pudo cambiar el estado de la categoría.' });
    }
  };

  const eliminarCategoria = async (cat: Categoria) => {
    if (!window.confirm(`¿Desea desactivar/eliminar la categoría '${cat.nombre}'?`)) return;
    try {
      const resp = await servicioCategorias.eliminar(cat.id);
      setMensajeAlerta({ tipo: 'exito', texto: resp.mensaje });
      cargarDatos();
    } catch (err: any) {
      const msg = err.response?.data?.mensaje || 'No se puede eliminar la categoría porque tiene productos activos.';
      setMensajeAlerta({ tipo: 'error', texto: msg });
    }
  };

  // ==========================================
  // CONFIGURACIÓN DEL NEGOCIO
  // ==========================================
  const guardarConfiguracion = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardandoConfiguracion(true);
    try {
      const confActualizada = await actualizarConfiguracion({
        numero_whatsapp: formConfWhatsapp.trim(),
        eslogan: formConfEslogan.trim(),
        instagram: formConfInstagram.trim(),
        facebook: formConfFacebook.trim(),
        email_contacto: formConfEmail.trim(),
        mensaje_bienvenida_whatsapp: formConfMensaje.trim(),
        descripcion_negocio: formConfDescripcion.trim(),
        zona_cobertura: formConfCobertura.trim(),
      });
      setConfiguracion(confActualizada);
      setMensajeAlerta({ tipo: 'exito', texto: '¡Configuración del negocio guardada exitosamente!' });
      cargarDatos();
    } catch {
      setMensajeAlerta({ tipo: 'error', texto: 'Error al actualizar la configuración del negocio.' });
    } finally {
      setGuardandoConfiguracion(false);
    }
  };

  // ==========================================
  // GESTIÓN DEL LOGO OFICIAL
  // ==========================================
  const alCambiarArchivoLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormLogoArchivo(file);
      const urlPreview = URL.createObjectURL(file);
      setFormLogoPreview(urlPreview);
    }
  };

  const guardarLogoNegocio = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardandoLogo(true);
    try {
      if (formLogoArchivo) {
        const formData = new FormData();
        formData.append('archivo_logo', formLogoArchivo);
        const confActualizada = await actualizarConfiguracion(formData);
        setConfiguracion(confActualizada);
        setFormLogoPreview(null);
        setFormLogoArchivo(null);
        setFormLogoUrl(confActualizada.logo_url || '');
        setMensajeAlerta({
          tipo: 'exito',
          texto: '¡El logo oficial del sitio web ha sido actualizado exitosamente!',
        });
      } else if (formLogoUrl.trim()) {
        const confActualizada = await actualizarConfiguracion({ logo_url: formLogoUrl.trim() });
        setConfiguracion(confActualizada);
        setFormLogoPreview(null);
        setMensajeAlerta({
          tipo: 'exito',
          texto: '¡El logo oficial del sitio web ha sido actualizado exitosamente!',
        });
      } else {
        setMensajeAlerta({
          tipo: 'error',
          texto: 'Por favor selecciona un archivo de imagen o escribe la dirección web del logo.',
        });
      }
      cargarDatos();
    } catch {
      setMensajeAlerta({
        tipo: 'error',
        texto: 'No fue posible actualizar el logo. Por favor intenta con otra imagen.',
      });
    } finally {
      setGuardandoLogo(false);
    }
  };

  // ==========================================
  // PERFIL DE ADMINISTRADOR (CAMBIO DE CREDENCIALES)
  // ==========================================
  const guardarPerfilAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPerfilClaveActual) {
      setMensajeAlerta({
        tipo: 'error',
        texto: 'Debes ingresar tu contraseña actual para confirmar los cambios en tu cuenta.',
      });
      return;
    }

    if (formPerfilClaveNueva) {
      if (formPerfilClaveNueva.length < 6) {
        setMensajeAlerta({
          tipo: 'error',
          texto: 'La nueva contraseña debe tener al menos 6 caracteres.',
        });
        return;
      }
      if (formPerfilClaveNueva !== formPerfilClaveConfirm) {
        setMensajeAlerta({
          tipo: 'error',
          texto: 'La confirmación de la nueva contraseña no coincide.',
        });
        return;
      }
    }

    setGuardandoPerfil(true);
    try {
      const resp = await servicioAutenticacion.cambiarCredenciales({
        username: formPerfilUsername.trim(),
        first_name: formPerfilFirstName.trim(),
        email: formPerfilEmail.trim(),
        clave_actual: formPerfilClaveActual,
        clave_nueva: formPerfilClaveNueva || undefined,
        confirmar_clave_nueva: formPerfilClaveConfirm || undefined,
      });

      if (resp.usuario) {
        actualizarUsuario(resp.usuario, resp.access);
      }

      setFormPerfilClaveActual('');
      setFormPerfilClaveNueva('');
      setFormPerfilClaveConfirm('');
      setMensajeAlerta({
        tipo: 'exito',
        texto: resp.mensaje || '¡Tus datos y credenciales han sido actualizados exitosamente!',
      });
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.mensaje ||
        err.response?.data?.detalles?.username?.[0] ||
        err.response?.data?.detalles?.clave_actual?.[0] ||
        err.response?.data?.detalles?.clave_nueva?.[0] ||
        'Error al actualizar tus credenciales. Verifica que tu contraseña actual sea correcta.';
      setMensajeAlerta({
        tipo: 'error',
        texto: errorMsg,
      });
    } finally {
      setGuardandoPerfil(false);
    }
  };

  // ==========================================
  // PERSONALIZACIÓN WEB (COLORES Y FUENTES)
  // ==========================================
  const aplicarPaletaPredefinida = (paleta: typeof PALETAS_PREDEFINIDAS[0]) => {
    setFormTemaPrincipal(paleta.principal);
    setFormTemaSecundario(paleta.secundario);
    setFormTemaAcento(paleta.acento);
    setFormTemaFondo(paleta.fondo);
    setFormTemaTexto(paleta.texto);
    setFormTemaFuenteTitulos(paleta.fuenteTitulos);
    setFormTemaFuenteCuerpo(paleta.fuenteCuerpo);

    // Previsualización instantánea en el DOM
    aplicarTemaVisual({
      color_principal: paleta.principal,
      color_secundario: paleta.secundario,
      color_acento: paleta.acento,
      color_fondo: paleta.fondo,
      color_texto: paleta.texto,
      fuente_titulos: paleta.fuenteTitulos,
      fuente_cuerpo: paleta.fuenteCuerpo,
    });
  };

  const previsualizarEstilosActuales = () => {
    aplicarTemaVisual({
      color_principal: formTemaPrincipal,
      color_secundario: formTemaSecundario,
      color_acento: formTemaAcento,
      color_fondo: formTemaFondo,
      color_texto: formTemaTexto,
      fuente_titulos: formTemaFuenteTitulos,
      fuente_cuerpo: formTemaFuenteCuerpo,
    });
  };

  const guardarPersonalizacionWeb = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardandoPersonalizacion(true);
    try {
      await actualizarConfiguracion({
        color_principal: formTemaPrincipal,
        color_secundario: formTemaSecundario,
        color_acento: formTemaAcento,
        color_fondo: formTemaFondo,
        color_texto: formTemaTexto,
        fuente_titulos: formTemaFuenteTitulos,
        fuente_cuerpo: formTemaFuenteCuerpo,
        titulo_hero: formTemaTituloHero.trim(),
        subtitulo_hero: formTemaSubtituloHero.trim(),
        texto_boton_hero: formTemaTextoBotonHero.trim(),
        mensaje_anuncio: formTemaMensajeAnuncio.trim(),
        mostrar_anuncio: formTemaMostrarAnuncio,
      });
      setMensajeAlerta({
        tipo: 'exito',
        texto: '¡Diseño y personalización web guardados y aplicados exitosamente!',
      });
      cargarDatos();
    } catch {
      setMensajeAlerta({
        tipo: 'error',
        texto: 'Error al guardar la personalización visual de la web.',
      });
    } finally {
      setGuardandoPersonalizacion(false);
    }
  };

  // ==========================================
  // GESTIÓN DE COTIZACIONES
  // ==========================================
  const verDetalleCotizacion = async (id: number) => {
    try {
      const detalle = await servicioCotizaciones.obtenerPorIdAdmin(id);
      setCotizacionDetalle(detalle);
      setModalCotizacionAbierto(true);
    } catch {
      setMensajeAlerta({ tipo: 'error', texto: 'Error al consultar la cotización.' });
    }
  };

  const cambiarEstadoCotizacion = async (id: number, nuevoEstado: EstadoCotizacion) => {
    try {
      await servicioCotizaciones.cambiarEstadoAdmin(id, nuevoEstado);
      setMensajeAlerta({ tipo: 'exito', texto: `Cotización actualizada a ${nuevoEstado}.` });
      cargarDatos();
      if (cotizacionDetalle && cotizacionDetalle.id === id) {
        setCotizacionDetalle({ ...cotizacionDetalle, estado: nuevoEstado });
      }
    } catch {
      setMensajeAlerta({ tipo: 'error', texto: 'Error al cambiar estado de la cotización.' });
    }
  };

  // Productos filtrados para la vista de administración
  const productosFiltrados = productos.filter((p) => {
    const texto = busquedaProd.trim().toLowerCase();
    const coincideTexto =
      !texto ||
      (p.nombre && p.nombre.toLowerCase().includes(texto)) ||
      (p.categoria_nombre && p.categoria_nombre.toLowerCase().includes(texto)) ||
      (p.categoria_slug && p.categoria_slug.toLowerCase().includes(texto)) ||
      (p.descripcion && p.descripcion.toLowerCase().includes(texto));

    const coincideCat =
      filtroCatProd === 'todas' ||
      p.categoria_slug === filtroCatProd ||
      (p.categoria_slug && p.categoria_slug.includes(filtroCatProd)) ||
      (p.categoria_nombre && p.categoria_nombre.toLowerCase().includes(filtroCatProd.toLowerCase())) ||
      String(p.categoria_id) === filtroCatProd;

    const coincideEstado =
      filtroEstadoProd === 'todos' ||
      (filtroEstadoProd === 'en_inicio' && p.esta_destacado) ||
      (filtroEstadoProd === 'activos' && p.esta_activo) ||
      (filtroEstadoProd === 'inactivos' && !p.esta_activo);

    return coincideTexto && coincideCat && coincideEstado;
  });

  // Cotizaciones filtradas
  const cotizacionesFiltradas = cotizaciones.filter((c) => {
    return filtroEstadoCot === 'todas' || c.estado === filtroEstadoCot;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Cabecera del Panel */}
      <div className="bg-white rounded-3xl border border-rosa-100 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-rosa-600 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Panel de Administración • Bocaditos Santy</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-texto-principal mt-1">
            Gestión Completa del Negocio
          </h1>
          <p className="text-xs text-texto-secundario mt-0.5">
            Agrega productos, activa o desactiva pasabocas, cambia precios, revisa solicitudes de clientes y actualiza tu WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={cargarDatos}
            className="p-2.5 rounded-full border border-gray-200 text-gray-500 hover:text-rosa-600 hover:border-rosa-300 transition"
            title="Recargar datos"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Boton
            variante="contorno"
            tamano="sm"
            onClick={() => {
              cerrarSesion();
              navigate(RUTAS.ADMIN_LOGIN);
            }}
            icono={<LogOut className="w-4 h-4" />}
          >
            Cerrar sesión
          </Boton>
        </div>
      </div>

      {mensajeAlerta && (
        <MensajeAlerta
          tipo={mensajeAlerta.tipo}
          mensaje={mensajeAlerta.texto}
          className="mb-6"
          alCerrar={() => setMensajeAlerta(null)}
        />
      )}

      {/* ========================================================= */}
      {/* GUÍA RÁPIDA Y SENCILLA PARA LA DUEÑA                     */}
      {/* ========================================================= */}
      <div className="bg-gradient-to-r from-rosa-50 via-white to-rosa-50 rounded-3xl border border-rosa-200 p-4 sm:p-6 mb-8 shadow-xs">
        <div className="flex items-center gap-2 text-rosa-800 font-bold text-sm mb-3">
          <Sparkles className="w-4 h-4 text-rosa-500" />
          <span>¡Hola! Guía rápida para manejar tu catálogo sin complicaciones técnicas:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-texto-secundario">
          <div className="bg-white p-3.5 rounded-2xl border border-rosa-100/80 shadow-xs">
            <span className="font-bold text-texto-principal block mb-1 text-xs">
              💰 1. Cambiar Precios o Cantidades
            </span>
            <p className="text-[11px] leading-relaxed">
              En la pestaña <strong>"Mis Pasabocas"</strong>, busca el producto y haz clic en el botón <strong>"Precios"</strong>. Escribe el nuevo valor y pulsa guardar.
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-rosa-100/80 shadow-xs">
            <span className="font-bold text-texto-principal block mb-1 text-xs">
              🚫 2. Si se acabó un producto
            </span>
            <p className="text-[11px] leading-relaxed">
              Pulsa <strong>"Desactivar"</strong> para ocultarlo de los clientes temporalmente sin borrarlo. Cuando vuelvas a tenerlo, pulsa <strong>"Activar"</strong>.
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-rosa-100/80 shadow-xs">
            <span className="font-bold text-texto-principal block mb-1 text-xs">
              ⭐ 3. Elegir para el Inicio
            </span>
            <p className="text-[11px] leading-relaxed">
              Pulsa el botón <strong>"⭐ En Inicio"</strong> en cualquier pasaboca para mostrarlo o quitarlo de los favoritos de tu página principal.
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-rosa-100/80 shadow-xs">
            <span className="font-bold text-texto-principal block mb-1 text-xs">
              🎨 4. Cambiar Colores o Letras
            </span>
            <p className="text-[11px] leading-relaxed">
              En la pestaña <strong>"Colores y Diseño Web"</strong> puedes elegir tu estilo favorito con 1 solo clic o probar nuevos tonos al instante.
            </p>
          </div>
        </div>
      </div>

      {/* Pestañas de Navegación del Panel */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        <button
          onClick={() => setPestañaActiva('productos')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            pestañaActiva === 'productos'
              ? 'border-rosa-500 text-rosa-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>🧁 Mis Pasabocas ({productos.length})</span>
        </button>

        <button
          onClick={() => setPestañaActiva('cotizaciones')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            pestañaActiva === 'cotizaciones'
              ? 'border-rosa-500 text-rosa-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>📩 Pedidos de Clientes ({cotizaciones.length})</span>
        </button>

        <button
          onClick={() => setPestañaActiva('categorias')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            pestañaActiva === 'categorias'
              ? 'border-rosa-500 text-rosa-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>🏷️ Categorías ({categorias.length})</span>
        </button>

        <button
          onClick={() => setPestañaActiva('configuracion')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            pestañaActiva === 'configuracion'
              ? 'border-rosa-500 text-rosa-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>💬 Mi WhatsApp y Contacto</span>
        </button>

        <button
          onClick={() => setPestañaActiva('personalizacion')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            pestañaActiva === 'personalizacion'
              ? 'border-rosa-500 text-rosa-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>🎨 Colores y Diseño Web</span>
        </button>

        <button
          onClick={() => setPestañaActiva('perfil')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            pestañaActiva === 'perfil'
              ? 'border-rosa-500 text-rosa-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <User className="w-4 h-4" />
          <span>👤 Mi Perfil y Contraseña</span>
        </button>
      </div>

      {cargando ? (
        <Cargando texto="Cargando información administrativa..." />
      ) : (
        <>
          {/* ========================================================= */}
          {/* PESTAÑA: PRODUCTOS (CRUD COMPLETO) */}
          {/* ========================================================= */}
          {pestañaActiva === 'productos' && (
            <div className="space-y-6">
              
              {/* Barra de Acciones y Filtros */}
              <div className="bg-white p-5 rounded-3xl border border-rosa-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  {/* Búsqueda */}
                  <div className="relative w-full sm:w-60">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Buscar producto..."
                      value={busquedaProd}
                      onChange={(e) => setBusquedaProd(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-rosa-400 focus:outline-none"
                    />
                  </div>

                  {/* Filtro Categoría */}
                  <select
                    value={filtroCatProd}
                    onChange={(e) => setFiltroCatProd(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white text-gray-700 focus:ring-2 focus:ring-rosa-400 focus:outline-none"
                  >
                    <option value="todas">Todas las categorías</option>
                    {categorias.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>

                  {/* Filtro Estado */}
                  <select
                    value={filtroEstadoProd}
                    onChange={(e) => setFiltroEstadoProd(e.target.value as any)}
                    className="px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white text-gray-700 focus:ring-2 focus:ring-rosa-400 focus:outline-none"
                  >
                    <option value="todos">Todos los estados</option>
                    <option value="en_inicio">⭐ En Inicio (Favoritos)</option>
                    <option value="activos">✓ En venta (Activos)</option>
                    <option value="inactivos">✕ Ocultos (Inactivos)</option>
                  </select>
                </div>

                <Boton
                  variante="primario"
                  tamano="sm"
                  onClick={abrirModalCrearProducto}
                  icono={<Plus className="w-4 h-4" />}
                  className="w-full md:w-auto"
                >
                  Crear Nuevo Producto
                </Boton>
              </div>

              {/* Lista de Productos */}
              <div className="bg-white rounded-3xl border border-rosa-100 shadow-sm overflow-hidden">
                {/* Vista en Tarjetas para Móviles (Super fácil de usar para la dueña) */}
                <div className="md:hidden divide-y divide-gray-100">
                  {productosFiltrados.map((prod) => {
                    const pres = prod.presentacion_predeterminada;
                    return (
                      <div key={prod.id} className="p-4 space-y-3 bg-white">
                        <div className="flex items-start gap-3">
                          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-rosa-50 border border-rosa-100 shrink-0">
                            <img
                              src={prod.imagen_url || '/placeholder.jpg'}
                              alt={prod.nombre}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder.jpg';
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-1">
                              <Insignia variante="rosa" tamano="sm">
                                {prod.categoria_nombre}
                              </Insignia>
                              {prod.esta_destacado && (
                                <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                                  ★ Destacado
                                </span>
                              )}
                            </div>
                            <h4 className="font-bold text-sm text-texto-principal truncate">
                              {prod.nombre}
                            </h4>
                            <p className="text-xs text-rosa-600 font-bold mt-0.5">
                              {pres && pres.tipo_precio === 'FIJO' && pres.precio
                                ? `${formatearMoneda(pres.precio)} (${pres.nombre})`
                                : 'Precio a cotizar'}
                            </p>
                          </div>
                        </div>

                        {/* Botones de acción directos y claros */}
                        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {/* Botón Activar / Desactivar */}
                            <button
                              type="button"
                              onClick={() => alternarActivoProducto(prod.id)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                                prod.esta_activo
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                              title={prod.esta_activo ? 'Clic para ocultar de la tienda' : 'Clic para activar en la tienda'}
                            >
                              <span>{prod.esta_activo ? '✓ En venta' : '✕ Oculto'}</span>
                            </button>

                            {/* Botón Mostrar en Inicio */}
                            <button
                              type="button"
                              onClick={() => alternarDestacadoProducto(prod.id)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                                prod.esta_destacado
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-200'
                              }`}
                              title="Pulsa para mostrar u ocultar en los favoritos de la página de inicio"
                            >
                              <span>{prod.esta_destacado ? '⭐ En Inicio' : '☆ No en Inicio'}</span>
                            </button>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => abrirModalPresentaciones(prod)}
                              className="px-3 py-1.5 rounded-xl bg-rosa-50 hover:bg-rosa-100 text-rosa-700 text-xs font-bold transition"
                            >
                              💰 Precios
                            </button>
                            <button
                              type="button"
                              onClick={() => abrirModalEditarProducto(prod)}
                              className="p-1.5 rounded-xl text-gray-500 hover:text-rosa-600 hover:bg-rosa-50 transition"
                              title="Editar"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => eliminarProducto(prod)}
                              className="p-1.5 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Vista en Tabla para Escritorio */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-rosa-50/50 text-texto-secundario text-xs uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Producto</th>
                        <th className="py-3 px-4">Categoría</th>
                        <th className="py-3 px-4">Presentación / Precio</th>
                        <th className="py-3 px-4 text-center">Estado Activo</th>
                        <th className="py-3 px-4 text-center">En Inicio</th>
                        <th className="py-3 px-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {productosFiltrados.map((prod) => {
                        const pres = prod.presentacion_predeterminada;
                        return (
                          <tr key={prod.id} className="hover:bg-rosa-50/30 transition">
                            {/* Producto Info */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl overflow-hidden bg-rosa-50 border border-rosa-100 shrink-0">
                                  <img
                                    src={prod.imagen_url || '/placeholder.jpg'}
                                    alt={prod.nombre}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = '/placeholder.jpg';
                                    }}
                                  />
                                </div>
                                <div>
                                  <span className="font-bold text-texto-principal block line-clamp-1">
                                    {prod.nombre}
                                  </span>
                                  <span className="text-[11px] text-texto-secundario line-clamp-1">
                                    {prod.descripcion || 'Sin descripción'}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Categoría */}
                            <td className="py-3 px-4 text-texto-secundario">
                              <Insignia variante="rosa" tamano="sm">
                                {prod.categoria_nombre}
                              </Insignia>
                            </td>

                            {/* Presentación y Precio */}
                            <td className="py-3 px-4">
                              <span className="block font-medium text-texto-principal">
                                {pres ? pres.nombre : 'Sin presentación'}
                              </span>
                              <span className="text-[11px] text-rosa-600 font-semibold">
                                {pres && pres.tipo_precio === 'FIJO' && pres.precio
                                  ? formatearMoneda(pres.precio)
                                  : 'Sujeto a cotización'}
                              </span>
                              {pres && (
                                <span className="block text-[10px] text-gray-400">
                                  Verif: {pres.estado_verificacion_precio}
                                </span>
                              )}
                            </td>

                            {/* Toggle Activo / Inactivo */}
                            <td className="py-3 px-4 text-center">
                              <button
                                type="button"
                                onClick={() => alternarActivoProducto(prod.id)}
                                className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                                  prod.esta_activo
                                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                                title="Clic para alternar activo/inactivo"
                              >
                                {prod.esta_activo ? '✓ Activo' : '✕ Inactivo'}
                              </button>
                            </td>

                            {/* Toggle En Inicio */}
                            <td className="py-3 px-4 text-center">
                              <button
                                type="button"
                                onClick={() => alternarDestacadoProducto(prod.id)}
                                className={`px-2.5 py-1 rounded-full text-xs font-bold transition ${
                                  prod.esta_destacado
                                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-200'
                                }`}
                                title="Clic para mostrar u ocultar en la página de inicio"
                              >
                                {prod.esta_destacado ? '⭐ Sí' : '☆ No'}
                              </button>
                            </td>

                            {/* Acciones */}
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => abrirModalPresentaciones(prod)}
                                  className="px-2.5 py-1 rounded-lg bg-rosa-50 hover:bg-rosa-100 text-rosa-700 text-xs font-semibold transition"
                                  title="Ver y configurar presentaciones y precios"
                                >
                                  Precios
                                </button>
                                <button
                                  type="button"
                                  onClick={() => abrirModalEditarProducto(prod)}
                                  className="p-1.5 rounded-lg text-gray-500 hover:text-rosa-600 hover:bg-rosa-50 transition"
                                  title="Editar producto"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => eliminarProducto(prod)}
                                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                                  title="Desactivar / Eliminar"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PESTAÑA: COTIZACIONES */}
          {/* ========================================================= */}
          {pestañaActiva === 'cotizaciones' && (
            <div className="space-y-6">
              
              {/* Filtro por Estado */}
              <div className="bg-white p-4 rounded-3xl border border-rosa-100 shadow-sm flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-texto-principal">Filtrar por estado:</span>
                  <select
                    value={filtroEstadoCot}
                    onChange={(e) => setFiltroEstadoCot(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs bg-white text-gray-700 focus:ring-2 focus:ring-rosa-400"
                  >
                    <option value="todas">Todas las cotizaciones</option>
                    <option value="PENDIENTE">Pendientes</option>
                    <option value="EN_REVISION">En revisión</option>
                    <option value="COTIZACION_ENVIADA">Cotización enviada</option>
                    <option value="CONFIRMADA">Confirmadas</option>
                    <option value="CANCELADA">Canceladas</option>
                  </select>
                </div>
              </div>

              {/* Tabla de Cotizaciones */}
              <div className="bg-white rounded-3xl border border-rosa-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-rosa-50/50 text-texto-secundario text-xs uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Código</th>
                        <th className="py-3 px-4">Cliente</th>
                        <th className="py-3 px-4">WhatsApp</th>
                        <th className="py-3 px-4">Evento</th>
                        <th className="py-3 px-4">Fecha Evento</th>
                        <th className="py-3 px-4">Items</th>
                        <th className="py-3 px-4">Estado</th>
                        <th className="py-3 px-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {cotizacionesFiltradas.map((c) => {
                        const telLimpio = c.telefono_whatsapp?.replace(/\D/g, '') || '';
                        const urlChatCliente = `https://api.whatsapp.com/send?phone=${telLimpio}&text=${encodeURIComponent(`¡Hola ${c.nombre_cliente}! Te escribimos de Bocaditos Santy con respecto a tu solicitud de cotización #${c.codigo_seguimiento}.`)}`;

                        return (
                          <tr key={c.id} className="hover:bg-rosa-50/30 transition">
                            <td className="py-3.5 px-4 font-mono font-bold text-rosa-600">
                              {c.codigo_seguimiento}
                            </td>
                            <td className="py-3.5 px-4 font-semibold text-texto-principal">
                              {c.nombre_cliente}
                            </td>
                            <td className="py-3.5 px-4 text-texto-secundario">
                              {c.telefono_whatsapp}
                            </td>
                            <td className="py-3.5 px-4">{c.tipo_evento}</td>
                            <td className="py-3.5 px-4">{c.fecha_evento}</td>
                            <td className="py-3.5 px-4 font-medium">{c.total_items} item(s)</td>
                            <td className="py-3.5 px-4">
                              <Insignia
                                variante={
                                  c.estado === 'PENDIENTE'
                                    ? 'amarillo'
                                    : c.estado === 'CONFIRMADA'
                                    ? 'verde'
                                    : c.estado === 'CANCELADA'
                                    ? 'gris'
                                    : 'azul'
                                }
                              >
                                {c.estado_texto}
                              </Insignia>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <a
                                  href={urlChatCliente}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2.5 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold flex items-center gap-1 transition"
                                  title="Contactar al cliente por WhatsApp"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                  <span>WhatsApp</span>
                                </a>
                                <button
                                  onClick={() => verDetalleCotizacion(c.id)}
                                  className="px-3 py-1 rounded-full bg-rosa-50 hover:bg-rosa-100 text-rosa-700 text-xs font-semibold transition"
                                >
                                  Detalle
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PESTAÑA: CATEGORÍAS */}
          {/* ========================================================= */}
          {pestañaActiva === 'categorias' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-5 rounded-3xl border border-rosa-100 shadow-sm">
                <div>
                  <h3 className="font-serif font-bold text-lg text-texto-principal">
                    Categorías de Pasabocas ({categorias.length})
                  </h3>
                  <p className="text-xs text-texto-secundario">
                    Organiza los grupos de productos visibles en el catálogo digital.
                  </p>
                </div>
                <Boton
                  variante="primario"
                  tamano="sm"
                  onClick={abrirModalCrearCategoria}
                  icono={<Plus className="w-4 h-4" />}
                >
                  Crear Nueva Categoría
                </Boton>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {categorias.map((cat) => (
                  <div
                    key={cat.id}
                    className="p-5 rounded-3xl border border-rosa-100 bg-white shadow-sm flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Insignia variante="rosa">Orden {cat.orden}</Insignia>
                        <button
                          type="button"
                          onClick={() => alternarActivaCategoria(cat.id)}
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            cat.esta_activa ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {cat.esta_activa ? 'Activa' : 'Inactiva'}
                        </button>
                      </div>
                      <h4 className="font-serif font-bold text-base text-texto-principal">{cat.nombre}</h4>
                      <p className="text-xs text-texto-secundario mt-1 line-clamp-2">
                        {cat.descripcion || 'Sin descripción'}
                      </p>
                      <span className="text-xs text-rosa-600 font-semibold block mt-2">
                        {cat.total_productos || 0} producto(s) activos
                      </span>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => abrirModalEditarCategoria(cat)}
                        className="px-3 py-1 rounded-lg bg-gray-50 hover:bg-rosa-50 text-xs font-semibold text-gray-700 hover:text-rosa-600 transition"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => eliminarCategoria(cat)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PESTAÑA: CONFIGURACIÓN DEL NEGOCIO Y LOGO                */}
          {/* ========================================================= */}
          {pestañaActiva === 'configuracion' && (
            <div className="space-y-8 max-w-3xl">

              {/* TARJETA 1: LOGO OFICIAL DEL SITIO WEB */}
              <div className="bg-white rounded-3xl border border-rosa-100 shadow-sm p-6 sm:p-8">
                <div className="border-b border-gray-100 pb-4 mb-6">
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-orange-600 uppercase tracking-widest">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Marca e Identidad Visual</span>
                  </div>
                  <h3 className="font-serif font-bold text-xl text-texto-principal mt-1">
                    Logo Oficial del Sitio Web
                  </h3>
                  <p className="text-xs text-texto-secundario mt-0.5">
                    Sube una nueva imagen o cambia el logo de Bocaditos Santy en cualquier momento. Se reflejará automáticamente en la barra superior, pie de página y pantalla de acceso.
                  </p>
                </div>

                <form onSubmit={guardarLogoNegocio} className="space-y-5 text-sm">
                  <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-orange-50/50 border border-orange-100">
                    <div className="relative shrink-0">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-orange-200 bg-white shadow-md flex items-center justify-center p-1">
                        <img
                          src={formLogoPreview || configuracion?.logo_url || '/logo-bocaditos-santy.jpg'}
                          alt="Logo Bocaditos Santy"
                          className="w-full h-full object-cover rounded-full"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/logo-bocaditos-santy.jpg';
                          }}
                        />
                      </div>
                      {formLogoPreview && (
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow whitespace-nowrap">
                          Vista previa
                        </span>
                      )}
                    </div>

                    <div className="space-y-3 flex-1 w-full">
                      <div>
                        <label className="block text-xs font-bold text-texto-principal uppercase tracking-wider mb-1">
                          Subir imagen de logo (JPG, PNG o WebP)
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={alCambiarArchivoLogo}
                          className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-orange-500 file:text-white hover:file:bg-orange-600 cursor-pointer"
                        />
                        <p className="text-[11px] text-gray-500 mt-1">
                          Recomendado: Imagen circular o cuadrada con fondo blanco o transparente.
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                          O escribe una dirección URL del logo:
                        </label>
                        <input
                          type="url"
                          value={formLogoUrl}
                          onChange={(e) => {
                            setFormLogoUrl(e.target.value);
                            if (e.target.value) setFormLogoPreview(e.target.value);
                            else setFormLogoPreview(null);
                          }}
                          placeholder="https://ejemplo.com/mi-logo.png"
                          className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Boton
                      type="submit"
                      variante="primario"
                      tamano="sm"
                      cargando={guardandoLogo}
                      icono={<Save className="w-3.5 h-3.5" />}
                    >
                      Guardar Nuevo Logo
                    </Boton>
                  </div>
                </form>
              </div>

              {/* TARJETA 2: DATOS DE CONTACTO Y WHATSAPP */}
              <div className="bg-white rounded-3xl border border-rosa-100 shadow-sm p-6 sm:p-8">
                <div className="border-b border-gray-100 pb-4 mb-6">
                  <h3 className="font-serif font-bold text-xl text-texto-principal">
                    Configuración General y WhatsApp Oficial
                  </h3>
                  <p className="text-xs text-texto-secundario mt-1">
                    Actualiza el número de WhatsApp al que llegarán las cotizaciones y los datos de contacto visibles en el sitio.
                  </p>
                </div>

                <form onSubmit={guardarConfiguracion} className="space-y-5 text-sm">
                
                {/* Número de WhatsApp */}
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                  <label className="block text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1">
                    Número Oficial de WhatsApp *
                  </label>
                  <div className="relative">
                    <MessageCircle className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formConfWhatsapp}
                      onChange={(e) => setFormConfWhatsapp(e.target.value)}
                      placeholder="+57 300 123 4567"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-emerald-300 bg-white font-mono font-bold text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-emerald-700 mt-1.5">
                    Este número recibe los mensajes de cotización estructurados de los clientes. Incluye el código de país (ej: +57).
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Eslogan */}
                  <div>
                    <label className="block text-xs font-bold text-texto-principal uppercase tracking-wider mb-1">
                      Eslogan Oficial
                    </label>
                    <input
                      type="text"
                      value={formConfEslogan}
                      onChange={(e) => setFormConfEslogan(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rosa-400"
                    />
                  </div>

                  {/* Instagram */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-bold text-texto-principal uppercase tracking-wider mb-1">
                      <Instagram className="w-3.5 h-3.5 text-pink-600" />
                      <span>Instagram</span>
                    </label>
                    <input
                      type="text"
                      value={formConfInstagram}
                      onChange={(e) => setFormConfInstagram(e.target.value)}
                      placeholder="@bocaditossanty o https://instagram.com/..."
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rosa-400 text-xs sm:text-sm"
                    />
                    <p className="text-[11px] text-gray-500 mt-1">
                      Enlace o usuario de Instagram. Se abrirá al pulsar el icono del pie de página.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Facebook */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-bold text-texto-principal uppercase tracking-wider mb-1">
                      <Facebook className="w-3.5 h-3.5 text-blue-600" />
                      <span>Facebook</span>
                    </label>
                    <input
                      type="text"
                      value={formConfFacebook}
                      onChange={(e) => setFormConfFacebook(e.target.value)}
                      placeholder="https://facebook.com/bocaditossanty o bocaditos santy"
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rosa-400 text-xs sm:text-sm"
                    />
                    <p className="text-[11px] text-gray-500 mt-1">
                      Enlace o nombre de tu página de Facebook. Se mostrará en el pie de página con su icono oficial.
                    </p>
                  </div>

                  {/* Correo Electrónico */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-bold text-texto-principal uppercase tracking-wider mb-1">
                      <Mail className="w-3.5 h-3.5 text-rose-500" />
                      <span>Correo Electrónico</span>
                    </label>
                    <input
                      type="email"
                      value={formConfEmail}
                      onChange={(e) => setFormConfEmail(e.target.value)}
                      placeholder="ej: contacto@bocaditossanty.com"
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rosa-400 text-xs sm:text-sm"
                    />
                    <p className="text-[11px] text-gray-500 mt-1">
                      Correo de atención a clientes. Se mostrará en el pie de página para contacto directo.
                    </p>
                  </div>
                </div>

                {/* Mensaje de encabezado WhatsApp */}
                <div>
                  <label className="block text-xs font-bold text-texto-principal uppercase tracking-wider mb-1">
                    Mensaje de encabezado en WhatsApp
                  </label>
                  <textarea
                    rows={2}
                    value={formConfMensaje}
                    onChange={(e) => setFormConfMensaje(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rosa-400 text-xs"
                  ></textarea>
                </div>

                {/* Zona de Cobertura */}
                <div>
                  <label className="block text-xs font-bold text-texto-principal uppercase tracking-wider mb-1">
                    Zona de Cobertura
                  </label>
                  <input
                    type="text"
                    value={formConfCobertura}
                    onChange={(e) => setFormConfCobertura(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rosa-400"
                  />
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <Boton
                    type="submit"
                    variante="primario"
                    tamano="md"
                    cargando={guardandoConfiguracion}
                    icono={<Save className="w-4 h-4" />}
                  >
                    Guardar Configuración
                  </Boton>
                </div>
              </form>
            </div>
          </div>
          )}

          {/* ========================================================= */}
          {/* PESTAÑA: PERSONALIZACIÓN WEB (COLORES, FUENTES Y HERO)   */}
          {/* ========================================================= */}
          {pestañaActiva === 'personalizacion' && (
            <div className="space-y-8">
              {/* Cabecera de la sección */}
              <div className="bg-white rounded-3xl border border-rosa-100 shadow-sm p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5 mb-6">
                  <div>
                    <div className="inline-flex items-center gap-2 text-xs font-bold text-rosa-600 uppercase tracking-widest">
                      <Palette className="w-3.5 h-3.5" />
                      <span>Diseño e Identidad Visual</span>
                    </div>
                    <h3 className="font-serif font-bold text-2xl text-texto-principal mt-1">
                      Personalización de Colores, Tipografías y Contenidos
                    </h3>
                    <p className="text-xs text-texto-secundario mt-0.5">
                      Personaliza los colores de marca, tipos de letra oficiales y los textos del banner principal de Bocaditos Santy.
                    </p>
                  </div>
                  
                  <Boton
                    type="button"
                    variante="contorno"
                    tamano="sm"
                    onClick={previsualizarEstilosActuales}
                    icono={<Eye className="w-4 h-4" />}
                  >
                    Probar vista previa en vivo
                  </Boton>
                </div>

                {/* 1. Temas y Paletas de 1 Clic */}
                <div className="mb-8">
                  <h4 className="text-xs font-bold text-texto-principal uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-rosa-500" />
                    <span>Paletas Temáticas Recomendadas (Aplica en 1 Clic)</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {PALETAS_PREDEFINIDAS.map((paleta) => {
                      const estaSeleccionada = formTemaPrincipal.toLowerCase() === paleta.principal.toLowerCase();
                      return (
                        <div
                          key={paleta.nombre}
                          onClick={() => aplicarPaletaPredefinida(paleta)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer text-left flex flex-col justify-between ${
                            estaSeleccionada
                              ? 'border-rosa-500 bg-rosa-50/50 shadow-sm ring-1 ring-rosa-400'
                              : 'border-gray-200 hover:border-rosa-300 bg-white hover:bg-gray-50/50'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-bold text-sm text-texto-principal">{paleta.nombre}</span>
                              {estaSeleccionada && (
                                <span className="text-[10px] bg-rosa-500 text-white font-bold px-2 py-0.5 rounded-full">
                                  Activo
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-texto-secundario mb-3 leading-relaxed">
                              {paleta.descripcion}
                            </p>
                          </div>

                          <div>
                            {/* Muestrario de colores */}
                            <div className="flex items-center gap-1.5 mb-2">
                              <span
                                className="w-6 h-6 rounded-lg border border-black/10 shadow-xs inline-block"
                                style={{ backgroundColor: paleta.principal }}
                                title={`Principal: ${paleta.principal}`}
                              ></span>
                              <span
                                className="w-6 h-6 rounded-lg border border-black/10 shadow-xs inline-block"
                                style={{ backgroundColor: paleta.secundario }}
                                title={`Secundario: ${paleta.secundario}`}
                              ></span>
                              <span
                                className="w-6 h-6 rounded-lg border border-black/10 shadow-xs inline-block"
                                style={{ backgroundColor: paleta.acento }}
                                title={`Acento: ${paleta.acento}`}
                              ></span>
                              <span
                                className="w-6 h-6 rounded-lg border border-black/10 shadow-xs inline-block"
                                style={{ backgroundColor: paleta.fondo }}
                                title={`Fondo: ${paleta.fondo}`}
                              ></span>
                            </div>
                            <span className="text-[10px] text-texto-secundario block font-mono">
                              {paleta.fuenteTitulos} + {paleta.fuenteCuerpo}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Formulario Completo de Personalización */}
                <form onSubmit={guardarPersonalizacionWeb} className="space-y-8">
                  
                  {/* 2. Selectores de Color Nativos */}
                  <div className="p-5 rounded-2xl bg-gray-50/70 border border-gray-200 space-y-4">
                    <h4 className="text-xs font-bold text-texto-principal uppercase tracking-wider flex items-center gap-2">
                      <Palette className="w-3.5 h-3.5 text-rosa-500" />
                      <span>Colores de la Marca y del Sitio</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Color Principal */}
                      <div className="bg-white p-3.5 rounded-xl border border-gray-200">
                        <label className="block text-xs font-bold text-texto-principal mb-1">
                          Color Principal (Botones y Enlaces)
                        </label>
                        <div className="flex items-center gap-2.5">
                          <input
                            type="color"
                            value={formTemaPrincipal}
                            onChange={(e) => {
                              setFormTemaPrincipal(e.target.value);
                              aplicarTemaVisual({ color_principal: e.target.value });
                            }}
                            className="w-10 h-10 rounded-lg cursor-pointer border border-gray-200 p-0.5"
                          />
                          <input
                            type="text"
                            value={formTemaPrincipal}
                            onChange={(e) => {
                              setFormTemaPrincipal(e.target.value);
                              aplicarTemaVisual({ color_principal: e.target.value });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-mono uppercase font-bold"
                          />
                        </div>
                        <span className="text-[10px] text-texto-secundario mt-1 block">
                          Botones de cotizar, destacados e íconos.
                        </span>
                      </div>

                      {/* Color Secundario */}
                      <div className="bg-white p-3.5 rounded-xl border border-gray-200">
                        <label className="block text-xs font-bold text-texto-principal mb-1">
                          Color Secundario (Fondos Suaves)
                        </label>
                        <div className="flex items-center gap-2.5">
                          <input
                            type="color"
                            value={formTemaSecundario}
                            onChange={(e) => {
                              setFormTemaSecundario(e.target.value);
                              aplicarTemaVisual({ color_secundario: e.target.value });
                            }}
                            className="w-10 h-10 rounded-lg cursor-pointer border border-gray-200 p-0.5"
                          />
                          <input
                            type="text"
                            value={formTemaSecundario}
                            onChange={(e) => {
                              setFormTemaSecundario(e.target.value);
                              aplicarTemaVisual({ color_secundario: e.target.value });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-mono uppercase font-bold"
                          />
                        </div>
                        <span className="text-[10px] text-texto-secundario mt-1 block">
                          Fondos de tarjetas, banners y áreas suaves.
                        </span>
                      </div>

                      {/* Color Acento */}
                      <div className="bg-white p-3.5 rounded-xl border border-gray-200">
                        <label className="block text-xs font-bold text-texto-principal mb-1">
                          Color de Acento (Pasteles & Bordes)
                        </label>
                        <div className="flex items-center gap-2.5">
                          <input
                            type="color"
                            value={formTemaAcento}
                            onChange={(e) => {
                              setFormTemaAcento(e.target.value);
                              aplicarTemaVisual({ color_acento: e.target.value });
                            }}
                            className="w-10 h-10 rounded-lg cursor-pointer border border-gray-200 p-0.5"
                          />
                          <input
                            type="text"
                            value={formTemaAcento}
                            onChange={(e) => {
                              setFormTemaAcento(e.target.value);
                              aplicarTemaVisual({ color_acento: e.target.value });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-mono uppercase font-bold"
                          />
                        </div>
                        <span className="text-[10px] text-texto-secundario mt-1 block">
                          Bordes suaves, pasteles e insignias.
                        </span>
                      </div>

                      {/* Color Fondo */}
                      <div className="bg-white p-3.5 rounded-xl border border-gray-200">
                        <label className="block text-xs font-bold text-texto-principal mb-1">
                          Fondo Principal del Sitio
                        </label>
                        <div className="flex items-center gap-2.5">
                          <input
                            type="color"
                            value={formTemaFondo}
                            onChange={(e) => {
                              setFormTemaFondo(e.target.value);
                              aplicarTemaVisual({ color_fondo: e.target.value });
                            }}
                            className="w-10 h-10 rounded-lg cursor-pointer border border-gray-200 p-0.5"
                          />
                          <input
                            type="text"
                            value={formTemaFondo}
                            onChange={(e) => {
                              setFormTemaFondo(e.target.value);
                              aplicarTemaVisual({ color_fondo: e.target.value });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-mono uppercase font-bold"
                          />
                        </div>
                        <span className="text-[10px] text-texto-secundario mt-1 block">
                          Fondo base de las páginas.
                        </span>
                      </div>

                      {/* Color Texto */}
                      <div className="bg-white p-3.5 rounded-xl border border-gray-200">
                        <label className="block text-xs font-bold text-texto-principal mb-1">
                          Color del Texto Principal
                        </label>
                        <div className="flex items-center gap-2.5">
                          <input
                            type="color"
                            value={formTemaTexto}
                            onChange={(e) => {
                              setFormTemaTexto(e.target.value);
                              aplicarTemaVisual({ color_texto: e.target.value });
                            }}
                            className="w-10 h-10 rounded-lg cursor-pointer border border-gray-200 p-0.5"
                          />
                          <input
                            type="text"
                            value={formTemaTexto}
                            onChange={(e) => {
                              setFormTemaTexto(e.target.value);
                              aplicarTemaVisual({ color_texto: e.target.value });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-mono uppercase font-bold"
                          />
                        </div>
                        <span className="text-[10px] text-texto-secundario mt-1 block">
                          Color de lectura de títulos y párrafos.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 3. Tipografías Oficiales */}
                  <div className="p-5 rounded-2xl bg-gray-50/70 border border-gray-200 space-y-4">
                    <h4 className="text-xs font-bold text-texto-principal uppercase tracking-wider flex items-center gap-2">
                      <Type className="w-3.5 h-3.5 text-rosa-500" />
                      <span>Tipografías de la Web (Google Fonts Oficiales)</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Fuente para Títulos */}
                      <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <label className="block text-xs font-bold text-texto-principal mb-1.5">
                          Tipo de Letra para Títulos (Encabezados)
                        </label>
                        <select
                          value={formTemaFuenteTitulos}
                          onChange={(e) => {
                            setFormTemaFuenteTitulos(e.target.value);
                            aplicarTemaVisual({ fuente_titulos: e.target.value });
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium bg-white focus:ring-2 focus:ring-rosa-400"
                        >
                          {FUENTES_TITULOS_OPCIONES.map((f) => (
                            <option key={f.valor} value={f.valor}>
                              {f.etiqueta}
                            </option>
                          ))}
                        </select>
                        <p className="text-[11px] text-texto-secundario mt-2">
                          Aplica a los títulos de los productos, secciones y encabezado del Hero.
                        </p>
                      </div>

                      {/* Fuente para Cuerpo */}
                      <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <label className="block text-xs font-bold text-texto-principal mb-1.5">
                          Tipo de Letra para Textos, Párrafos y Botones
                        </label>
                        <select
                          value={formTemaFuenteCuerpo}
                          onChange={(e) => {
                            setFormTemaFuenteCuerpo(e.target.value);
                            aplicarTemaVisual({ fuente_cuerpo: e.target.value });
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium bg-white focus:ring-2 focus:ring-rosa-400"
                        >
                          {FUENTES_CUERPO_OPCIONES.map((f) => (
                            <option key={f.valor} value={f.valor}>
                              {f.etiqueta}
                            </option>
                          ))}
                        </select>
                        <p className="text-[11px] text-texto-secundario mt-2">
                          Aplica a las descripciones, detalles de pasabocas, formularios y botones.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 4. Textos del Banner Principal (Hero) y Anuncios */}
                  <div className="p-5 rounded-2xl bg-gray-50/70 border border-gray-200 space-y-4">
                    <h4 className="text-xs font-bold text-texto-principal uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-rosa-500" />
                      <span>Contenido del Banner Principal (Hero) y Anuncios</span>
                    </h4>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-texto-principal uppercase tracking-wider mb-1">
                          Título Principal del Banner
                        </label>
                        <input
                          type="text"
                          value={formTemaTituloHero}
                          onChange={(e) => setFormTemaTituloHero(e.target.value)}
                          placeholder="Ej: Momentos especiales, sabores inolvidables"
                          className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-rosa-400 text-sm font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-texto-principal uppercase tracking-wider mb-1">
                          Subtítulo Descriptivo del Banner
                        </label>
                        <textarea
                          rows={2}
                          value={formTemaSubtituloHero}
                          onChange={(e) => setFormTemaSubtituloHero(e.target.value)}
                          placeholder="Descripción atractiva de Bocaditos Santy..."
                          className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-rosa-400 text-xs leading-relaxed"
                        ></textarea>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-texto-principal uppercase tracking-wider mb-1">
                            Texto del Botón Principal
                          </label>
                          <input
                            type="text"
                            value={formTemaTextoBotonHero}
                            onChange={(e) => setFormTemaTextoBotonHero(e.target.value)}
                            placeholder="Explorar catálogo"
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-rosa-400 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-texto-principal uppercase tracking-wider mb-1">
                            Mensaje de Anuncio Superior
                          </label>
                          <input
                            type="text"
                            value={formTemaMensajeAnuncio}
                            onChange={(e) => setFormTemaMensajeAnuncio(e.target.value)}
                            placeholder="Ej: ¡Haz tu pedido con anticipación para tus eventos!"
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-rosa-400 text-xs"
                          />
                        </div>
                      </div>

                      <div className="pt-1">
                        <label className="flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formTemaMostrarAnuncio}
                            onChange={(e) => setFormTemaMostrarAnuncio(e.target.checked)}
                            className="rounded text-rosa-500 focus:ring-rosa-400 w-4 h-4"
                          />
                          <span className="text-xs font-bold text-texto-principal">
                            ¿Mostrar barra de anuncio en la parte superior del sitio web?
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* 5. Vista Previa en Vivo (Live Preview Card) */}
                  <div className="p-6 rounded-3xl border border-rosa-200 shadow-sm space-y-4" style={{ backgroundColor: formTemaFondo }}>
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: formTemaPrincipal }}>
                        ✦ Vista Previa en Tiempo Real de tus Estilos
                      </span>
                      <span className="text-[11px] text-texto-secundario">
                        {formTemaFuenteTitulos} • {formTemaFuenteCuerpo}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <h2
                        className="text-2xl sm:text-3xl font-bold leading-tight"
                        style={{ fontFamily: formTemaFuenteTitulos, color: formTemaTexto }}
                      >
                        {formTemaTituloHero || 'Título de ejemplo'}
                      </h2>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ fontFamily: formTemaFuenteCuerpo, color: formTemaTexto, opacity: 0.85 }}
                      >
                        {formTemaSubtituloHero || 'Descripción de ejemplo para comprobar legibilidad de la fuente.'}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        <button
                          type="button"
                          className="px-5 py-2.5 rounded-full text-white text-xs font-bold shadow-sm transition transform hover:scale-105"
                          style={{ backgroundColor: formTemaPrincipal, fontFamily: formTemaFuenteCuerpo }}
                        >
                          {formTemaTextoBotonHero || 'Botón Primario'}
                        </button>

                        <button
                          type="button"
                          className="px-5 py-2.5 rounded-full text-xs font-bold border transition"
                          style={{
                            backgroundColor: formTemaSecundario,
                            borderColor: formTemaAcento,
                            color: formTemaTexto,
                            fontFamily: formTemaFuenteCuerpo
                          }}
                        >
                          Botón Secundario
                        </button>

                        <span
                          className="px-3 py-1 rounded-full text-[11px] font-bold"
                          style={{
                            backgroundColor: formTemaAcento,
                            color: formTemaTexto,
                            fontFamily: formTemaFuenteCuerpo
                          }}
                        >
                          Insignia de Acento
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Botón de Guardado */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={previsualizarEstilosActuales}
                      className="text-xs text-rosa-600 font-bold hover:underline"
                    >
                      Refrescar previsualización en pantalla
                    </button>

                    <Boton
                      type="submit"
                      variante="primario"
                      tamano="md"
                      cargando={guardandoPersonalizacion}
                      icono={<Save className="w-4 h-4" />}
                    >
                      Guardar y Aplicar Personalización
                    </Boton>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PESTAÑA: PERFIL Y SEGURIDAD DEL ADMINISTRADOR            */}
          {/* ========================================================= */}
          {pestañaActiva === 'perfil' && (
            <div className="bg-white rounded-3xl border border-rosa-100 shadow-sm p-6 sm:p-8 max-w-2xl">
              <div className="border-b border-gray-100 pb-4 mb-6">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-rosa-600 uppercase tracking-widest">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Seguridad de la Cuenta</span>
                </div>
                <h3 className="font-serif font-bold text-2xl text-texto-principal mt-1">
                  Mi Perfil y Contraseña de Acceso
                </h3>
                <p className="text-xs text-texto-secundario mt-0.5">
                  Cambia tu nombre de usuario, datos personales y clave de acceso para administrar la plataforma con total tranquilidad.
                </p>
              </div>

              {/* Tarjeta de Resumen del Usuario Actual */}
              <div className="p-4 rounded-2xl bg-rosa-50/60 border border-rosa-200 mb-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-rosa-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                    {(usuario?.first_name || usuario?.username || 'A')[0].toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-texto-principal">
                      {usuario?.first_name || usuario?.username}
                    </h4>
                    <p className="text-xs text-texto-secundario font-mono">
                      Usuario actual: @{usuario?.username}
                    </p>
                  </div>
                </div>
                <Insignia variante="rosa">
                  Administrador
                </Insignia>
              </div>

              <form onSubmit={guardarPerfilAdmin} className="space-y-5 text-sm">
                
                {/* Nombre de Usuario */}
                <div>
                  <label className="block text-xs font-bold text-texto-principal uppercase tracking-wider mb-1">
                    Nombre de Usuario (para iniciar sesión) *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formPerfilUsername}
                      onChange={(e) => setFormPerfilUsername(e.target.value)}
                      placeholder="ej: sandra_admin"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rosa-400 font-mono text-sm"
                    />
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Solo letras, números y guiones bajos (sin espacios).
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Nombre Completo */}
                  <div>
                    <label className="block text-xs font-bold text-texto-principal uppercase tracking-wider mb-1">
                      Nombre o Apodo de la Dueña
                    </label>
                    <input
                      type="text"
                      value={formPerfilFirstName}
                      onChange={(e) => setFormPerfilFirstName(e.target.value)}
                      placeholder="ej: Sandra Maldonado"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rosa-400 text-sm"
                    />
                  </div>

                  {/* Correo Electrónico */}
                  <div>
                    <label className="block text-xs font-bold text-texto-principal uppercase tracking-wider mb-1">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      value={formPerfilEmail}
                      onChange={(e) => setFormPerfilEmail(e.target.value)}
                      placeholder="admin@bocaditossanty.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rosa-400 text-sm"
                    />
                  </div>
                </div>

                {/* Bloque de Cambio de Contraseña */}
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-4">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                    <Key className="w-4 h-4 text-amber-600" />
                    <span>Cambiar Contraseña de Acceso</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Si no deseas cambiar tu contraseña, deja los campos de <strong>"Nueva contraseña"</strong> en blanco.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Nueva Clave */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Nueva Contraseña (opcional)
                      </label>
                      <div className="relative">
                        <input
                          type={mostrarClaveNueva ? 'text' : 'password'}
                          value={formPerfilClaveNueva}
                          onChange={(e) => setFormPerfilClaveNueva(e.target.value)}
                          placeholder="Mínimo 6 caracteres"
                          className="w-full pl-4 pr-10 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-rosa-400"
                        />
                        <button
                          type="button"
                          onClick={() => setMostrarClaveNueva(!mostrarClaveNueva)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {mostrarClaveNueva ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirmar Nueva Clave */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Confirmar Nueva Contraseña
                      </label>
                      <div className="relative">
                        <input
                          type={mostrarClaveConfirm ? 'text' : 'password'}
                          value={formPerfilClaveConfirm}
                          onChange={(e) => setFormPerfilClaveConfirm(e.target.value)}
                          placeholder="Repite la nueva clave"
                          className="w-full pl-4 pr-10 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-rosa-400"
                        />
                        <button
                          type="button"
                          onClick={() => setMostrarClaveConfirm(!mostrarClaveConfirm)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {mostrarClaveConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contraseña Actual (Requerida para autorizar cambios) */}
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                    Contraseña Actual (Requerida para autorizar cambios) *
                  </label>
                  <div className="relative">
                    <input
                      type={mostrarClaveActual ? 'text' : 'password'}
                      value={formPerfilClaveActual}
                      onChange={(e) => setFormPerfilClaveActual(e.target.value)}
                      placeholder="Ingresa tu contraseña actual"
                      required
                      className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-rosa-400"
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarClaveActual(!mostrarClaveActual)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {mostrarClaveActual ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Por seguridad, debes escribir tu contraseña actual para confirmar cualquier actualización de tu perfil.
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <Boton
                    type="submit"
                    variante="primario"
                    tamano="md"
                    cargando={guardandoPerfil}
                    icono={<Save className="w-4 h-4" />}
                  >
                    Guardar Cambios de Mi Perfil
                  </Boton>
                </div>
              </form>
            </div>
          )}
        </>
      )}

      {/* ========================================================= */}
      {/* MODAL: CREAR / EDITAR PRODUCTO */}
      {/* ========================================================= */}
      <Modal
        abierto={modalProductoAbierto}
        alCerrar={() => setModalProductoAbierto(false)}
        titulo={productoEnEdicion ? `Editar Producto: ${productoEnEdicion.nombre}` : 'Crear Nuevo Producto'}
        anchoMaximo="xl"
      >
        <form onSubmit={guardarProducto} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block text-xs font-bold text-texto-principal uppercase tracking-wider mb-1">
              Nombre del producto *
            </label>
            <input
              type="text"
              value={formProdNombre}
              onChange={(e) => setFormProdNombre(e.target.value)}
              placeholder="Ej: Empanaditas de Pollo y Champiñones"
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rosa-400"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-texto-principal uppercase tracking-wider mb-1">
                Categoría *
              </label>
              <select
                value={formProdCategoria}
                onChange={(e) => setFormProdCategoria(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-rosa-400"
              >
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-texto-principal uppercase tracking-wider mb-1">
                Fotografía (opcional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFormProdArchivoImagen(e.target.files[0]);
                  }
                }}
                className="w-full text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-rosa-50 file:text-rosa-700 hover:file:bg-rosa-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-texto-principal uppercase tracking-wider mb-1">
              Descripción
            </label>
            <textarea
              rows={2}
              value={formProdDescripcion}
              onChange={(e) => setFormProdDescripcion(e.target.value)}
              placeholder="Detalle de los ingredientes o preparación..."
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rosa-400 text-xs"
            ></textarea>
          </div>

          {/* Presentación Inicial */}
          <div className="p-4 rounded-2xl bg-rosa-50/50 border border-rosa-100 space-y-3">
            <span className="block text-xs font-bold text-rosa-800 uppercase tracking-wider">
              Presentación y Precio Principal
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-texto-secundario mb-0.5">
                  Nombre presentación (ej. Paquete x 20)
                </label>
                <input
                  type="text"
                  value={formPresNombre}
                  onChange={(e) => setFormPresNombre(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-texto-secundario mb-0.5">
                  Unidades incluidas
                </label>
                <input
                  type="number"
                  min="1"
                  value={formPresUnidades}
                  onChange={(e) => setFormPresUnidades(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-texto-secundario mb-0.5">
                  Tipo de precio
                </label>
                <select
                  value={formPresTipoPrecio}
                  onChange={(e) => setFormPresTipoPrecio(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs bg-white"
                >
                  <option value="FIJO">Precio Fijo</option>
                  <option value="A_COTIZAR">Sujeto a Cotización</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-texto-secundario mb-0.5">
                  Precio (COP)
                </label>
                <input
                  type="number"
                  placeholder="Ej: 35000"
                  value={formPresPrecio}
                  onChange={(e) => setFormPresPrecio(e.target.value)}
                  disabled={formPresTipoPrecio === 'A_COTIZAR'}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-white disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-texto-secundario mb-0.5">
                  Verificación de precio
                </label>
                <select
                  value={formPresVerificacion}
                  onChange={(e) => setFormPresVerificacion(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs bg-white"
                >
                  <option value="PENDIENTE">Pendiente (Se oculta en web)</option>
                  <option value="CONFIRMADO">Confirmado (Público)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={formProdDestacado}
                onChange={(e) => setFormProdDestacado(e.target.checked)}
                className="rounded text-rosa-500 focus:ring-rosa-400"
              />
              <span className="font-semibold text-texto-principal">¿Destacar en inicio?</span>
            </label>

            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={formProdDisponible}
                onChange={(e) => setFormProdDisponible(e.target.checked)}
                className="rounded text-rosa-500 focus:ring-rosa-400"
              />
              <span className="font-semibold text-texto-principal">¿Disponible para pedidos?</span>
            </label>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end gap-2">
            <Boton
              type="button"
              variante="fantasma"
              tamano="sm"
              onClick={() => setModalProductoAbierto(false)}
            >
              Cancelar
            </Boton>
            <Boton
              type="submit"
              variante="primario"
              tamano="sm"
              cargando={guardandoProducto}
            >
              {productoEnEdicion ? 'Actualizar Producto' : 'Guardar Producto'}
            </Boton>
          </div>
        </form>
      </Modal>

      {/* ========================================================= */}
      {/* MODAL: PRESENTACIONES Y PRECIOS DE PRODUCTO */}
      {/* ========================================================= */}
      {productoPresentaciones && (
        <Modal
          abierto={modalPresentacionesAbierto}
          alCerrar={() => setModalPresentacionesAbierto(false)}
          titulo={`Presentaciones y Precios: ${productoPresentaciones.nombre}`}
          anchoMaximo="lg"
        >
          <div className="space-y-6 text-xs sm:text-sm">
            {/* Lista actual de presentaciones */}
            <div>
              <span className="font-bold text-xs text-texto-principal uppercase tracking-wider block mb-2">
                Presentaciones y Precios Actuales
              </span>
              <div className="divide-y divide-gray-100 border border-gray-200 rounded-2xl overflow-hidden bg-white">
                {listaPresentaciones.map((p) => {
                  const estaEditando = presEditandoId === p.id;
                  if (estaEditando) {
                    return (
                      <div key={p.id} className="p-3.5 bg-rosa-50/70 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-texto-principal text-xs">
                            Editar Precio: {p.nombre} ({p.cantidad_unidades} unid)
                          </span>
                          <button
                            type="button"
                            onClick={cancelarEdicionPresentacion}
                            className="text-xs text-gray-500 hover:text-gray-800"
                          >
                            Cancelar
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-[11px] font-semibold text-texto-secundario mb-0.5">
                              Nuevo Precio en COP:
                            </label>
                            <input
                              type="number"
                              value={editPresPrecio}
                              onChange={(e) => setEditPresPrecio(e.target.value)}
                              placeholder="Ej: 35000"
                              className="w-full px-3 py-1.5 rounded-xl border border-gray-300 text-xs bg-white font-bold text-rosa-600"
                              autoFocus
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-texto-secundario mb-0.5">
                              Estado del precio:
                            </label>
                            <select
                              value={editPresVerificacion}
                              onChange={(e) => setEditPresVerificacion(e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-xl border border-gray-300 text-xs bg-white"
                            >
                              <option value="CONFIRMADO">Confirmado (Visible al público)</option>
                              <option value="PENDIENTE">Pendiente (A cotizar)</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex justify-end pt-1">
                          <Boton
                            type="button"
                            variante="primario"
                            tamano="sm"
                            cargando={guardandoEditPres}
                            onClick={() => guardarEdicionPresentacion(p.id)}
                          >
                            Guardar Precio
                          </Boton>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={p.id} className="p-3 flex items-center justify-between bg-white hover:bg-gray-50">
                      <div>
                        <span className="font-bold text-texto-principal block">{p.nombre}</span>
                        <span className="text-[11px] text-texto-secundario">
                          {p.cantidad_unidades} unid •{' '}
                          <strong className="text-rosa-600">
                            {p.tipo_precio === 'FIJO' && p.precio ? formatearMoneda(p.precio) : 'A cotizar'}
                          </strong>
                          {` • (${p.estado_verificacion_precio === 'CONFIRMADO' ? 'Público' : 'A cotizar'})`}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => iniciarEdicionPresentacion(p)}
                          className="px-2.5 py-1 rounded-lg bg-rosa-50 hover:bg-rosa-100 text-rosa-700 font-semibold text-xs transition"
                          title="Cambiar precio de esta presentación"
                        >
                          Cambiar Precio
                        </button>
                        {listaPresentaciones.length > 1 && (
                          <button
                            type="button"
                            onClick={() => eliminarPresentacion(p.id)}
                            className="p-1 text-gray-400 hover:text-red-500 transition"
                            title="Eliminar presentación"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Formulario Agregar Nueva Presentación */}
            <form onSubmit={agregarPresentacion} className="p-4 rounded-2xl bg-rosa-50/50 border border-rosa-100 space-y-3">
              <span className="font-bold text-xs text-rosa-800 uppercase tracking-wider block">
                + Agregar Otra Presentación
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] text-gray-600 mb-0.5">Nombre (ej. Combo x 100)</label>
                  <input
                    type="text"
                    value={nuevaPresNombre}
                    onChange={(e) => setNuevaPresNombre(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-600 mb-0.5">Unidades incluidas</label>
                  <input
                    type="number"
                    min="1"
                    value={nuevaPresUnidades}
                    onChange={(e) => setNuevaPresUnidades(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] text-gray-600 mb-0.5">Tipo de precio</label>
                  <select
                    value={nuevaPresTipo}
                    onChange={(e) => setNuevaPresTipo(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-gray-200 text-xs bg-white"
                  >
                    <option value="FIJO">Fijo</option>
                    <option value="A_COTIZAR">A Cotizar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-gray-600 mb-0.5">Precio</label>
                  <input
                    type="number"
                    value={nuevaPresPrecio}
                    onChange={(e) => setNuevaPresPrecio(e.target.value)}
                    disabled={nuevaPresTipo === 'A_COTIZAR'}
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-white disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-600 mb-0.5">Verificación</label>
                  <select
                    value={nuevaPresVerificacion}
                    onChange={(e) => setNuevaPresVerificacion(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-gray-200 text-xs bg-white"
                  >
                    <option value="PENDIENTE">Pendiente</option>
                    <option value="CONFIRMADO">Confirmado</option>
                  </select>
                </div>
              </div>

              <Boton
                type="submit"
                variante="primario"
                tamano="sm"
                cargando={guardandoPres}
                className="w-full"
              >
                Guardar Presentación
              </Boton>
            </form>
          </div>
        </Modal>
      )}

      {/* ========================================================= */}
      {/* MODAL: CREAR / EDITAR CATEGORÍA */}
      {/* ========================================================= */}
      <Modal
        abierto={modalCategoriaAbierto}
        alCerrar={() => setModalCategoriaAbierto(false)}
        titulo={categoriaEnEdicion ? `Editar Categoría: ${categoriaEnEdicion.nombre}` : 'Crear Nueva Categoría'}
        anchoMaximo="md"
      >
        <form onSubmit={guardarCategoria} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block text-xs font-bold text-texto-principal uppercase tracking-wider mb-1">
              Nombre de la categoría *
            </label>
            <input
              type="text"
              value={formCatNombre}
              onChange={(e) => setFormCatNombre(e.target.value)}
              placeholder="Ej: Pasabocas Gourmet"
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rosa-400"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-texto-principal uppercase tracking-wider mb-1">
              Descripción
            </label>
            <textarea
              rows={2}
              value={formCatDescripcion}
              onChange={(e) => setFormCatDescripcion(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rosa-400 text-xs"
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-texto-principal uppercase tracking-wider mb-1">
                Orden de visualización
              </label>
              <input
                type="number"
                value={formCatOrden}
                onChange={(e) => setFormCatOrden(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-gray-200"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-texto-principal uppercase tracking-wider mb-1">
                URL de imagen (opcional)
              </label>
              <input
                type="text"
                value={formCatImagenUrl}
                onChange={(e) => setFormCatImagenUrl(e.target.value)}
                placeholder="/media/..."
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end gap-2">
            <Boton
              type="button"
              variante="fantasma"
              tamano="sm"
              onClick={() => setModalCategoriaAbierto(false)}
            >
              Cancelar
            </Boton>
            <Boton
              type="submit"
              variante="primario"
              tamano="sm"
              cargando={guardandoCategoria}
            >
              Guardar Categoría
            </Boton>
          </div>
        </form>
      </Modal>

      {/* ========================================================= */}
      {/* MODAL: DETALLE COMPLETO DE COTIZACIÓN */}
      {/* ========================================================= */}
      {cotizacionDetalle && (
        <Modal
          abierto={modalCotizacionAbierto}
          alCerrar={() => setModalCotizacionAbierto(false)}
          titulo={`Cotización #${cotizacionDetalle.codigo_seguimiento}`}
          subtitulo={`Cliente: ${cotizacionDetalle.nombre_cliente}`}
          anchoMaximo="xl"
        >
          <div className="space-y-5 text-sm">
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-rosa-50/50 border border-rosa-100 text-xs">
              <p><strong>WhatsApp:</strong> {cotizacionDetalle.telefono_whatsapp}</p>
              <p><strong>Tipo de Evento:</strong> {cotizacionDetalle.tipo_evento}</p>
              <p><strong>Fecha Evento:</strong> {cotizacionDetalle.fecha_evento}</p>
              <p><strong>Lugar:</strong> {cotizacionDetalle.lugar_evento || 'Por definir'}</p>
              <p><strong>Invitados:</strong> {cotizacionDetalle.cantidad_invitados || 'Sin especificar'}</p>
              <p><strong>Fecha Solicitud:</strong> {new Date(cotizacionDetalle.fecha_creacion).toLocaleDateString('es-CO')}</p>
            </div>

            {cotizacionDetalle.observaciones && (
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-texto-secundario">
                <strong>Observaciones:</strong> {cotizacionDetalle.observaciones}
              </div>
            )}

            <div>
              <h4 className="font-serif font-bold text-base text-texto-principal mb-2">
                Productos Solicitados ({cotizacionDetalle.detalles?.length || 0})
              </h4>
              <div className="divide-y divide-gray-100 border rounded-2xl overflow-hidden max-h-56 overflow-y-auto">
                {cotizacionDetalle.detalles?.map((det: any) => (
                  <div key={det.id} className="p-3 flex justify-between items-center text-xs bg-white">
                    <div>
                      <span className="font-bold text-texto-principal">{det.nombre_producto_historico}</span>
                      <span className="block text-texto-secundario">
                        {det.nombre_presentacion_historico}
                        {det.nombre_variante_historico ? ` • ${det.nombre_variante_historico}` : ''}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-texto-principal">{det.cantidad_presentaciones} paquete(s)</span>
                      <span className="block text-texto-secundario">({det.total_unidades_calculadas} unid)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs font-bold text-texto-principal">Cambiar estado:</span>
              <div className="flex flex-wrap gap-1.5">
                {(['PENDIENTE', 'EN_REVISION', 'COTIZACION_ENVIADA', 'CONFIRMADA', 'CANCELADA'] as EstadoCotizacion[]).map(
                  (est) => (
                    <button
                      key={est}
                      onClick={() => cambiarEstadoCotizacion(cotizacionDetalle.id, est)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                        cotizacionDetalle.estado === est
                          ? 'bg-rosa-500 text-white shadow-sm'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {est.replace('_', ' ')}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
