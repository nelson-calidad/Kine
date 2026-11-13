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
        void: '#000000',
        'bone-white': '#ffffff',
        'ash-gray': '#9a9a9a',
        'silver-mist': '#bdbdbd',
        'electric-iris': '#8052ff',
        'saffron-spark': '#ffb829',
        'deep-verdant': '#15846e',
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
        'card': '1.5rem',
        'card-lg': '1.5rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': 'none',
        'soft-lg': 'none',
      }
    },
  },
  plugins: [],
}
