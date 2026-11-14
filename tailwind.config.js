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
        void: '#061522',
        'bone-white': '#F1F7FA',
        'ash-gray': '#A7B9C6',
        'silver-mist': '#E2EEF4',
        'electric-iris': '#25C8CC',
        'saffron-spark': '#82E5E4',
        'deep-verdant': '#10283A',
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
        'card': '1rem',
        'card-lg': '1.25rem',
        '3xl': '1.25rem',
      },
      boxShadow: {
        'soft': '0 10px 28px -12px rgba(2, 10, 18, 0.55)',
        'soft-lg': '0 16px 36px -14px rgba(2, 10, 18, 0.65)',
      }
    },
  },
  plugins: [],
}
