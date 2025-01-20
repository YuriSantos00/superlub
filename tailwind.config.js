/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    fontFamily:{
      "sans":['Roboto','sans-serif']
    },
    extend: {
      backgroundImage:{
        "home":"url('/assets/bgk.png')"
      }

    },

    colors: {
      'white': '#ffffff',
      'purple': '#3f3cbb',
      'red':'#dc2626',
      'green':'#22c55e',
      'gray':'#4b5563',
      'slate':'#94a3b8',
      'stone':'#0c0a09',
      'slate-light':'#f1f5f9',
    },

  },
  plugins: [],
}

