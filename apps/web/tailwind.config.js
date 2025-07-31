/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        neonCyan: '#00FFFF',
        neonMagenta: '#FF00FF',
        neonRed: '#FF5555'
      }
    }
  },
  plugins: []
}; 