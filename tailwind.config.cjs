/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/devtools/**/*.{html,js,svelte,ts}'
  ],
  darkMode: 'class',
  theme: {
    colors: {
      black: '#000000',
      blue: {
        100: '#ededfc',
        200: '#c2c0ff',
        300: '#9893ff',
        400: '#6b65ff',
        500: '#3030fd'
      },
      gray: {
        100: '#dcdee3',
        200: '#a6a9ae',
        300: '#74777d',
        400: '#494c52',
        500: '#1b1e24'
      },
      green: {
        100: '#e1f0eb',
        200: '#b1d9ca',
        300: '#82c1a8',
        400: '#52a985',
        500: '#0f9162'
      },
      red: {
        100: '#f0e1e5',
        200: '#e2b2bd',
        300: '#d28392',
        400: '#be5366',
        500: '#a6163a'
      },
      yellow: {
        100: '#f0ece1',
        200: '#e8dcbb',
        300: '#dfcc96',
        400: '#d6bb71',
        500: '#ccab4b'
      },
      white: '#ffffff'
    },
    extend: {
      height: {
        'event-content-height': 'calc(100vh - 72px)',
      },
    },
  },
  plugins: [],
}
