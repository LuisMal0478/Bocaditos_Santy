/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta de marca dinámica vinculada a variables CSS
        rosa: {
          50: '#FFF9F3',
          100: 'var(--color-secundario, #FFF5EA)', // Crema cálido
          200: 'var(--color-acento, #FFE4CC)', // Melocotón suave
          300: '#FED0A3',
          400: '#FFA053',
          500: 'var(--color-principal, #FF6B00)', // Naranja vibrante oficial
          600: 'var(--color-principal-oscuro, #E65100)', // Hover naranja intenso
          700: '#C43E00',
          800: '#9C3100',
          900: '#541A00',
        },
        naranja: {
          50: '#FFF9F3',
          100: '#FFF5EA',
          200: '#FFE4CC',
          300: '#FED0A3',
          400: '#FFA053',
          500: '#FF6B00',
          600: '#E65100',
          700: '#C43E00',
          800: '#9C3100',
          900: '#541A00',
        },
        whatsapp: {
          500: '#25D366',
          600: '#20BD5A',
          700: '#128C7E',
        },
        texto: {
          principal: 'var(--color-texto, #331B0B)',
          secundario: '#6D5B50',
          claro: '#9A8C83',
        },
        borde: {
          suave: 'var(--color-acento, #FFE4CC)',
        }
      },
      fontFamily: {
        serif: ['var(--fuente-titulos)', 'Plus Jakarta Sans', 'Playfair Display', 'serif'],
        sans: ['var(--fuente-cuerpo)', 'Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'tarjeta': '0 4px 20px -2px rgba(255, 107, 0, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'elevada': '0 10px 30px -4px rgba(255, 107, 0, 0.16), 0 4px 10px -2px rgba(0, 0, 0, 0.05)',
        'calida': '0 12px 32px -4px rgba(255, 107, 0, 0.22)',
      }
    },
  },
  plugins: [],
}


