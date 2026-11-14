/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: '#061523',
        'bone-white': '#ffffff',
        'ash-gray': '#a3c9dc',
        'silver-mist': '#e6f6fa',
        'electric-iris': '#22b8cf',
        'saffron-spark': '#67e8f9',
        'deep-verdant': '#0ea5e9',
        brand: {
          navy: 'var(--color-navy)',
          teal: 'var(--color-teal)',
          soft: 'var(--color-turquoise-soft)',
          bg: 'var(--color-bg-main)',
          white: 'var(--color-white)',
          text: 'var(--color-text-main)',
          muted: 'var(--color-text-secondary)',
          warning: 'var(--color-warning)',
          danger: 'var(--color-danger)',
        }
      },
      fontFamily: {
        sans: ['PPNeueMontreal', 'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'card': '1.25rem',
        'card-lg': '1.5rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 10px 30px -10px rgba(2, 12, 24, 0.6)',
        'soft-lg': '0 18px 40px -12px rgba(2, 12, 24, 0.75)',
      }
    },
  },
  plugins: [],
}
