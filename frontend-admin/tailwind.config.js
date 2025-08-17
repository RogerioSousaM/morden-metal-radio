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
        'metal-border': '#404040',
        'metal-text': '#ffffff',
        'metal-text-secondary': '#a0a0a0',
        'metal-orange': '#E04E1B',
        'metal-accent': '#00d4ff',
        'metal-red': '#dc2626',
        'metal-green': '#16a34a',
        'metal-blue': '#2563eb',
        'metal-yellow': '#ca8a04'
      },
      fontFamily: {
        'metal': ['Orbitron', 'Courier New', 'monospace'],
        'metal-secondary': ['Rajdhani', 'sans-serif'],
        'display': ['Orbitron', 'Courier New', 'monospace'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.25' }],
        'sm': ['0.875rem', { lineHeight: '1.5' }],
        'base': ['1rem', { lineHeight: '1.5' }],
        'lg': ['1.125rem', { lineHeight: '1.75' }],
        'xl': ['1.25rem', { lineHeight: '1.25' }],
        '2xl': ['1.5rem', { lineHeight: '1.25' }],
        '3xl': ['1.875rem', { lineHeight: '1.25' }],
        '4xl': ['2.25rem', { lineHeight: '1.25' }],
        '5xl': ['3rem', { lineHeight: '1.25' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
      },
      letterSpacing: {
        'tight': '-0.025em',
        'wide': '0.025em',
        'wider': '0.05em',
        'widest': '0.1em',
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