# Bocaditos Santy - "Momentos felices" 🌸
### Aplicación Web Full Stack • Catálogo Digital Dinámico y Sistema de Cotizaciones

Sistema web profesional desarrollado para el emprendimiento **Bocaditos Santy**, dedicado a la preparación y venta de pasabocas y montajes de mesas temáticas para eventos, celebraciones, cumpleaños, bodas y reuniones empresariales.

Reemplaza el catálogo tradicional en PDF por una plataforma web interactiva, moderna, responsive y autoadministrable, permitiendo a los clientes explorar productos con sus fotografías reales, armar cotizaciones personalizadas y enviarlas directamente por WhatsApp, asegurando la persistencia previa de cada solicitud en base de datos.

---

## 1. Características Principales

- **Identidad Visual y Diseño Exclusivo:** Paleta en tonos rosados suaves (`#FCE8F0`, `#F8D7E5`), acento rosa vibrante (`#D63384`), fondo blanco limpio, tipografía editorial elegante (`Playfair Display` y `Plus Jakarta Sans`), tarjetas suaves y diseño 100% adaptable a celulares, tablets y computadores.
- **Catálogo Digital Completo:** 59 productos catalogados en las 5 categorías oficiales (*Bocaditos, Bocaditos salados, Bocaditos dulces, Bebidas y Servicios para eventos*), vinculados a sus **fotografías reales** extraídas del PDF original.
- **Transparencia en Precios:** Campo `estado_verificacion_precio` (`PENDIENTE`, `CONFIRMADO`, `NO_APLICA`). Los productos con precios preliminares del PDF se muestran con la leyenda *"Sujeto a cotización / Precio por confirmar"* para evitar compromisos inexactos.
- **Múltiples Presentaciones y Variantes:** Soporte dinámico para venta por unidad, paquetes de 20 unidades, combos de 100, y variantes obligatorias u opcionales (sabores de empanadas, postres, cheesecakes, etc.).
- **Persistencia Previa Obligatoria:** Cada solicitud de cotización se guarda en PostgreSQL (con código de seguimiento único `COT-YYYYMM-XXXX` y copias históricas inmutables) **antes** de abrir la API de WhatsApp, garantizando que ninguna solicitud se pierda.
- **Protección Anti-Spam:** Control de frecuencia (*rate limiting* / *throttling*) y campo trampa invisible (*honeypot*).
- **Panel Administrativo Completo:** Autenticación JWT, métricas en tiempo real, bandeja de cotizaciones recibidas con cambio de estados, catálogo de productos y configuración centralizada del número oficial de WhatsApp.
- **Nomenclatura 100% en Español:** Código, variables, funciones, modelos, campos de base de datos y componentes construidos en español bajo buenas prácticas de ingeniería.

---

## 2. Tecnologías Utilizadas

### Frontend
- **React 18** con **TypeScript** y **Vite**.
- **Tailwind CSS** con configuración de paleta de repostería.
- **React Router DOM 6** para navegación SPA.
- **Zustand** para administración global del carrito de cotización con persistencia en `localStorage`.
- **React Hook Form** + **Zod** para validación reactiva de formularios.
- **Axios** con interceptores para consumo de la API REST.
- **Lucide React** para iconografía.

### Backend
- **Python 3.12** y **Django 5.1**.
- **Django REST Framework (DRF)**.
- **SimpleJWT** para autenticación mediante tokens JSON Web Tokens.
- **Django CORS Headers** con restricción estricta de orígenes.
- **Pillow** y módulo de integración **Cloudinary** (con reemplazo seguro de dos fases y fallback local en desarrollo).
- **dj-database-url** y **psycopg2-binary** para conexión a PostgreSQL.
- **Gunicorn** para servidor de aplicaciones en producción.

---

## 3. Estructura del Proyecto

```text
Bocaditos Santi/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── Procfile
│   ├── configuracion/          # Configuración principal, settings, urls, excepciones
│   ├── aplicaciones/
│   │   ├── usuarios/           # Autenticación JWT y permisos
│   │   ├── categorias/         # Modelos y API de categorías
│   │   ├── productos/          # Modelos de productos, presentaciones, variantes y Cloudinary
│   │   ├── cotizaciones/       # Cotizaciones, líneas históricas y generador de WhatsApp
│   │   └── negocio/            # Configuración institucional y WhatsApp del negocio
│   ├── archivos_subidos/       # Almacenamiento local de fotos en desarrollo
│   └── semillas/               # Script de carga inicial del catálogo desde el PDF
│
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── vercel.json
│   └── src/
│       ├── componentes/        # Botones, insignias, modales, navbar, footer
│       ├── paginas/            # Inicio, Catálogo, Cotización, Nosotros, Contacto, Admin
│       ├── contextos/          # Stores de Zustand (cotización y autenticación)
│       ├── servicios/          # Clientes API REST
│       ├── tipos/              # Definiciones TypeScript
│       └── utilidades/         # Formateadores y constantes
│
└── recursos_extraidos/         # 67 fotografías originales extraídas del PDF
```

---

## 4. Instalación y Ejecución Local

### Prerrequisitos
- **Python 3.12+** instalado.
- **Node.js 18+** y **npm** instalados.

---

### Paso 1: Configurar y Ejecutar el Backend

1. **Abrir la terminal en la raíz del proyecto:**
   ```bash
   cd "c:\Users\Sandra Maldonado\Desktop\Bocaditos Santi"
   ```

2. **Crear y activar el entorno virtual (si no existe):**
   ```bash
   # En Windows:
   backend\entorno\Scripts\activate
   ```

3. **Instalar dependencias:**
   ```bash
   pip install -r backend/requirements.txt
   ```

4. **Configurar variables de entorno:**
   Copia el archivo `backend/.env.example` a `backend/.env`:
   ```bash
   cp backend/.env.example backend/.env
   ```

5. **Aplicar migraciones de la base de datos:**
   ```bash
   python backend/manage.py migrate
   ```

6. **Cargar los datos iniciales del catálogo (semillas con fotos del PDF):**
   ```bash
   python backend/semillas/datos_iniciales_catalogo.py
   ```

7. **Ejecutar el servidor de desarrollo de Django:**
   ```bash
   python backend/manage.py runserver
   ```
   *El backend estará disponible en `http://127.0.0.1:8000/`.*

---

### Paso 2: Configurar y Ejecutar el Frontend

1. **En una nueva terminal, ingresar a la carpeta `frontend`:**
   ```bash
   cd frontend
   ```

2. **Instalar dependencias de Node.js:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo de Vite:**
   ```bash
   npm run dev
   ```
   *El frontend estará disponible en `http://localhost:5173/`.*

---

## 5. Credenciales del Panel Administrativo

Para ingresar a gestionar productos, categorías, solicitudes y configuración:

- **Ruta de acceso:** `http://localhost:5173/administracion/iniciar-sesion`
- **Usuario:** `admin`
- **Contraseña:** `BocaditosSanty2026!`

*(Recuerda cambiar la contraseña en producción desde el panel o el administrador de Django en `/admin/`)*.

---

## 6. Pruebas Automatizadas

El proyecto cuenta con una suite completa de pruebas unitarias y de integración en Django:

```bash
# Ejecutar todas las pruebas del backend:
backend\entorno\Scripts\python backend/manage.py test aplicaciones
```

**Validaciones incluidas:**
- Creación y verificación de integridad de precios en presentaciones.
- Desactivación lógica de productos preservando el historial contable (*soft-delete*).
- Generación secuencial de códigos de seguimiento para cotizaciones (`COT-YYYYMM-0001`).
- Validación de fecha de eventos (rechazo de fechas en el pasado).
- Detección y bloqueo de spam mediante campo trampa *honeypot*.
- Protección y restricción de endpoints administrativos mediante JWT.
- Cálculo exacto de unidades totales y subtotales históricos.

---

## 7. Despliegue en Producción

### Frontend en Vercel
1. Conecta el repositorio en [Vercel](https://vercel.com).
2. Configura el **Root Directory** como `frontend`.
3. El archivo `frontend/vercel.json` ya está configurado para el enrutamiento SPA.
4. Define la variable de entorno `VITE_API_BASE_URL` apuntando a tu backend en producción.

### Backend en Render / Railway
1. Crea un servicio web en [Render](https://render.com) apuntando a la carpeta `backend`.
2. Asocia una base de datos PostgreSQL administrada.
3. El archivo `backend/Procfile` ejecutará automáticamente:
   ```bash
   gunicorn configuracion.wsgi:application --bind 0.0.0.0:$PORT
   ```
4. Define las variables de entorno en Render:
   - `SECRET_KEY`: Tu clave secreta generada para producción.
   - `DEBUG`: `False`.
   - `ALLOWED_HOSTS`: Tu dominio en Render y frontend.
   - `CORS_ALLOWED_ORIGINS`: La URL de tu frontend en Vercel (ej. `https://bocaditos-santy.vercel.app`).
   - `DATABASE_URL`: URL de conexión a PostgreSQL.
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Tus credenciales de Cloudinary.

---

## 8. Licencia y Derechos

Desarrollado para **Bocaditos Santy** • *"Momentos felices"* © 2026. Todos los derechos reservados.

