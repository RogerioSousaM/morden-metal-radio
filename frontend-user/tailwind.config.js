/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Metal Design System Colors
        'metal': {
          'bg': 'var(--metal-bg-900)',
          'bg-900': 'var(--metal-bg-900)',
          'surface': 'var(--metal-surface)',
          'surface-2': 'var(--metal-surface-2)',
          'text': 'var(--metal-text)',
          'text-2': 'var(--metal-text-2)',
          'edge': 'var(--metal-edge)',
          'light-gray': 'rgba(182, 182, 182, 0.14)',
        },
        'accent': {
          'crimson': 'var(--accent-crimson)',
          'amber': 'var(--accent-amber)',
        },
        // Card-specific colors
        'card': {
          'border': 'rgba(255, 255, 255, var(--card-border-opacity))',
          'shadow': 'var(--card-shadow-primary)',
          'shadow-hover': 'var(--card-shadow-hover)',
        },
        // Button-specific colors
        'btn': {
          'crimson': 'var(--btn-accent-crimson)',
          'crimson-hover': 'var(--btn-accent-crimson-hover)',
        }
      },
      fontFamily: {
        'display': ['Orbitron', 'monospace'],
        'body': ['Inter', 'sans-serif'],
        'metal': ['Orbitron', 'monospace'],
      },
      borderRadius: {
        'metal-sm': 'var(--radius-sm)',
        'metal-md': 'var(--radius-md)',
        'metal-lg': 'var(--radius-lg)',
        'metal-xl': 'var(--radius-xl)',
        'xl': 'var(--radius-xl)',
      },
      boxShadow: {
        'metal-sm': 'var(--shadow-metal-sm)',
        'metal-md': 'var(--shadow-metal-md)',
        'metal-lg': 'var(--shadow-metal-lg)',
        'metal-xl': 'var(--shadow-metal-xl)',
        'card': 'var(--card-shadow-primary)',
        'card-hover': 'var(--card-shadow-hover)',
        'btn': 'var(--btn-shadow)',
        'btn-hover': 'var(--btn-shadow-hover)',
      },
      backgroundImage: {
        'metal-edge': 'var(--metal-edge)',
        'metal-bg': 'var(--gradient-metal-bg)',
        'metal-surface': 'var(--gradient-metal-surface)',
      },
      opacity: {
        'grain': 'var(--grain-opacity)',
        'card-border': 'var(--card-border-opacity)',
      },
      transitionDuration: {
        'play-overlay': 'var(--play-overlay-transition)',
      },
      backgroundColor: {
        'play-overlay': 'var(--play-overlay-bg)',
      }
    },
  },
  plugins: [],
} 