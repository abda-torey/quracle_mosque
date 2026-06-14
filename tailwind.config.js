/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        mosque: {
          green: '#085041',
          mid: '#1D9E75',
          light: '#E1F5EE',
          muted: '#5DCAA5',
        },
      },
    },
  },
  plugins: [],
}
