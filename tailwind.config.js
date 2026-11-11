/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
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
        sans: ['Inter', 'Manrope', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'card': '1.25rem',
        'card-lg': '1.5rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(23, 59, 89, 0.06), 0 2px 6px -1px rgba(23, 59, 89, 0.04)',
        'soft-lg': '0 10px 30px -4px rgba(23, 59, 89, 0.09), 0 4px 10px -2px rgba(23, 59, 89, 0.04)',
      }
    },
  },
  plugins: [],
}
