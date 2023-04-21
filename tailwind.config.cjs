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
        100: '#f1effd',
        200: '#d5c3fd',
        300: '#b79afc',
        400: '#9372fb',
        500: '#6649f8'
      },
      gray: {
        100: '#e1e2ea',
        200: '#aaadc4',
        300: '#74789d;',
        400: '#484a65',
        500: '#313245'
      },
      green: {
        100: '#e1f0eb',
        200: '#b1d9ca',
        300: '#82c1a8',
        400: '#52a985',
        500: '#0f9162'
      },
      pink: {
        100: '#fef6f8',
        200: '#ffcfd5',
        300: '#ffa8b2',
        400: '#fa7f91',
        500: '#f15072'
      },
      red: {
        100: '#f0e1e5',
        200: '#e2b2bd',
        300: '#d28392',
        400: '#be5366',
        500: '#a6163a'
      },
      yellow: {
        100: '#f0ede1',
        200: '#ede1be',
        300: '#e8d49a',
        400: '#e3ca78',
        500: '#dfc334'
      },
      white: '#ffffff'
    },
    fontFamily: {
      mono: ['IBM Plex Mono'],
      sans: ['Apfel Grotezk']
    },
    extend: {
      height: {
        'event-content-height': 'calc(100vh - 72px)',
      },
    },
  },
  plugins: [],
}
