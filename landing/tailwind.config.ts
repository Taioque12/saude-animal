import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary:     '#13a89e',
          primaryDark: '#0d8d84',
          primarySoft: '#e2f4f1',
          accent:      '#e8743b',
          accentDark:  '#d65f27',
          accentSoft:  '#fdeee6',
        },
        ink: {
          900: '#14302b',
          700: '#2d4038',
          500: '#5f6f69',
          400: '#9fb4ae',
          200: '#e2ebe8',
          100: '#f4f7f6',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        card: '0 4px 24px rgba(20,48,43,.08)',
        glow: '0 0 40px rgba(19,168,158,.25)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up .6s ease both',
      },
    },
  },
  plugins: [],
}

export default config
