/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        // Gold (primary)
        primary: {
          50: '#FFF9E6',
          100: '#FFF5E6',
          200: '#FFEB99',
          300: '#FFE066',
          400: '#FFD633',
          500: '#FDB913', // Dourado principal
          600: '#E6A400',
          700: '#CC9200',
          800: '#B38000',
          900: '#996E00',
        },
        // Marrom (secondary) - Tom rústico e elegante
        secondary: {
          50: '#F5F1ED',   // Creme muito claro
          100: '#E8DFD5',  // Bege claro
          200: '#D4C2B0',  // Bege médio
          300: '#B89F88',  // Bege escuro
          400: '#9C7D5F',  // Marrom claro
          500: '#6B4F3A',  // Marrom médio (texto principal)
          600: '#5A4230',  // Marrom escuro
          700: '#4A3627',  // Marrom muito escuro
          800: '#3A2B1F',  // Quase preto marrom
          900: '#2A1F16',  // Preto marrom
        },
        // Beige - Fundos e superfícies
        beige: {
          50: '#FAF7F4',   // Bege muito claro (fundo geral) - ESCURECIDO
          100: '#F0E8DF',  // Bege claro (cards)
          200: '#E3D5C5',  // Bege médio (bordas)
          300: '#D4C2AD',  // Bege escuro
          400: '#C3AD91',  // Bege muito escuro
          500: '#B09775',  // Tom médio
          600: '#8F7A5E',  // Tom escuro
          700: '#6E5E48',  // Tom muito escuro
          800: '#4E4233',  // Marrom
          900: '#38302A',  // Marrom escuro
        },
        // Keep amber for compatibility but map to primary
        amber: {
          50: '#FFF9E6',
          100: '#FFF5E6',
          200: '#FFEB99',
          300: '#FFE066',
          400: '#FFD633',
          500: '#FDB913',
          600: '#E6A400',
          700: '#CC9200',
          800: '#B38000',
          900: '#996E00',
        },
      },
    },
  },
  plugins: [],
}
