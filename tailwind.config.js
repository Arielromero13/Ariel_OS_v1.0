/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        // Fondo y superficies — grafito frío, no el slate por defecto de Tailwind.
        ink: {
          50: '#F4F5F7',
          100: '#E7E9ED',
          200: '#C7CBD4',
          300: '#9CA3B2',
          400: '#6B7284',
          500: '#4B5165',
          600: '#383D4E',
          700: '#262A38',
          800: '#1A1D28',
          850: '#14161F',
          900: '#0F1119',
          950: '#0A0B10',
        },
        // Acento de firma — teal fósforo, tomado del LCD verde-azulado real de los
        // telurómetros Fluke que este sistema audita. Reemplaza el indigo genérico
        // como color primario de interacción; queda separado del ámbar de 'pending'
        // para no confundir "acción primaria" con "estado pendiente".
        signal: {
          200: '#A9EEDD',
          300: '#7EE0C9',
          400: '#35C4A6',
          500: '#1FA689',
          600: '#167A66',
          700: '#0F5A4B',
          900: '#0C2620',
          950: '#081813',
        },
        // Estados de evaluación técnica — deliberadamente apagados, no neón.
        pass: {
          300: '#9CCDAE',
          400: '#5FAE7E',
          500: '#3F8F63',
          900: '#16271D',
          950: '#0E1A14',
        },
        fail: {
          300: '#E3A3A3',
          400: '#D3695F',
          500: '#B84A42',
          900: '#2C1210',
          950: '#1C0B0A',
        },
        pending: {
          300: '#E4CE87',
          400: '#C9A227',
          500: '#A6841E',
          900: '#241D0A',
          950: '#171304',
        },
        note: {
          300: '#C6B8E8',
          400: '#9B85D6',
          500: '#7C63B8',
          900: '#211A38',
        },
      },
    },
  },
  plugins: [],
};
