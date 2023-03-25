/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/devtools/**/*.{html,js,svelte,ts}'
  ],
  theme: {
    colors: {
      'black': '#000000',
      'gray': '#4a4c50',
      'gray-dark': '#262626',
      'gray-light': '#c6c6c6',
      'white': '#ffffff'
    },
    extend: {
      height: {
        'event-content-height': 'calc(100vh - 72px)',
      },
    },
  },
  plugins: [],
}
