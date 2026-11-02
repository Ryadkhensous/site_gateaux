/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Nuances Beige Poudré & Lin
        beige: {
          50: '#FDFCF9',
          100: '#F8F4EE',
          200: '#F1E9DE',
          300: '#E7DBC9',
          400: '#D6C2A7',
          500: '#BC9F7D',
          600: '#9F7E5D',
          700: '#7B6046',
          800: '#5A4532',
          900: '#3D2D20',
        },
        // Nuances Rose Pastel, Poudré & Pivoine
        rose: {
          50: '#FDF2F4',
          100: '#FCE7EC',
          200: '#FACDD8',
          300: '#F6A5B9',
          400: '#EE7193',
          500: '#E24A75',
          600: '#CA2D59',
          700: '#A91F44',
          800: '#8C1C3A',
          900: '#521021',
        },
        // Nuances Doré Royal & Or Champêtre
        dore: {
          50: '#FCF9EE',
          100: '#F8F1D2',
          200: '#F0E1A3',
          300: '#E5CD6E',
          400: '#D8B842',
          500: '#C5A028',
          600: '#A88319',
          700: '#876515',
          800: '#674B18',
          900: '#463212',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
