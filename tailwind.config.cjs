/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/devtools/**/*.{html,js,svelte,ts}'
  ],
  theme: {
    extend: {
      height: {
        'event-content-height': 'calc(100vh - 72px)',
      },
    },
  },
  plugins: [],
}
