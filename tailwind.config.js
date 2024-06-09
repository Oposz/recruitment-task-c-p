/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        cyan: '#00dddd',
        subtle: '#e0e3e2',
        themebg: '#191c1c'
      }
    },
  },
  plugins: [],
}

