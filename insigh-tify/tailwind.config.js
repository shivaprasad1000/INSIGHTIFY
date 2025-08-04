/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fuchsia: {
          500: '#d946ef',
          600: '#c026d3',
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
        }
      },
      keyframes: {
        'gradient-pan': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-down': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
         'border-glow': {
          '0%, 100%': { 'border-color': 'rgba(192, 132, 252, 0.5)', 'box-shadow': '0 0 6px rgba(192, 132, 252, 0.4), inset 0 0 6px rgba(192, 132, 252, 0.2)' },
          '50%': { 'border-color': 'rgba(56, 189, 248, 0.5)', 'box-shadow': '0 0 16px rgba(56, 189, 248, 0.4), inset 0 0 16px rgba(56, 189, 248, 0.2)' },
        }
      },
      animation: {
        'gradient-pan': 'gradient-pan 15s ease infinite',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'fade-in-down': 'fade-in-down 0.5s ease-out forwards',
        'border-glow': 'border-glow 6s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
