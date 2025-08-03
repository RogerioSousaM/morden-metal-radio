/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'metal-dark': '#0a0a0a',
        'metal-card': '#1a1a1a',
        'metal-gray': '#2a2a2a',
        'metal-light-gray': '#3a3a3a',
        'metal-text': '#ffffff',
        'metal-text-secondary': '#a0a0a0',
        'metal-orange': '#E04E1B',
        'metal-red': '#dc2626',
        'metal-green': '#16a34a',
        'metal-blue': '#2563eb',
        'metal-yellow': '#ca8a04'
      },
      fontFamily: {
        'metal': ['Orbitron', 'monospace'],
        'metal-secondary': ['Rajdhani', 'sans-serif']
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite'
      },
      backgroundImage: {
        'metal-gradient': 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
        'orange-gradient': 'linear-gradient(135deg, #E04E1B 0%, #ff6b35 100%)'
      }
    },
  },
  plugins: [],
} 