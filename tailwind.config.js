/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        spy: {
          900: '#0a0a0f',
          800: '#0f1019',
          700: '#161825',
          600: '#1e2035',
          500: '#2a2d45',
          400: '#3d4166',
          300: '#5a5f8a',
          200: '#8388b3',
          100: '#b3b7d6',
        },
        gold: {
          500: '#d4a843',
          400: '#e0be6a',
          300: '#ebd48f',
        },
        neon: {
          purple: '#9E7FFF',
          blue: '#38bdf8',
          pink: '#f472b6',
          green: '#10b981',
          amber: '#f59e0b',
          red: '#ef4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'scan': 'scan 3s ease-in-out infinite',
        'tick': 'tick 1s steps(60) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(158, 127, 255, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(158, 127, 255, 0.6), 0 0 40px rgba(158, 127, 255, 0.2)' },
        },
        scan: {
          '0%, 100%': { opacity: '0.3', transform: 'translateY(-100%)' },
          '50%': { opacity: '0.8', transform: 'translateY(100%)' },
        },
        tick: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(6deg)' },
        },
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(158, 127, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(158, 127, 255, 0.03) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
    },
  },
  plugins: [],
}
