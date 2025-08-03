/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'metal-dark': '#000000',
        'metal-card': '#121212',
        'metal-gray': '#1a1a1a',
        'metal-light-gray': '#2a2a2a',
        'metal-text': '#ffffff',
        'metal-text-secondary': '#a0a0a0',
        'metal-orange': '#E04E1B',
        'metal-accent': '#FF5722',
        'metal-red': '#f44336',
      },
      fontFamily: {
        'metal': ['Inter', 'sans-serif'],
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite alternate',
        'micro-pulse': 'micro-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%': {
            boxShadow: '0 0 5px #f44336, 0 0 10px #f44336, 0 0 15px #f44336',
          },
          '100%': {
            boxShadow: '0 0 10px #f44336, 0 0 20px #f44336, 0 0 30px #f44336',
          },
        },
        'micro-pulse': {
          '0%, 100%': {
            transform: 'scale(1)',
            opacity: '1',
          },
          '50%': {
            transform: 'scale(1.05)',
            opacity: '0.8',
          },
        },
      },
    },
  },
  plugins: [],
} 