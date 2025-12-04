/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: '#000000',
        neon: {
          green: '#39ff14', // Neon Green
          blue: '#00ffff',  // Neon Blue
          red: '#ff073a',   // Neon Red
        },
        dark: {
          900: '#0a0a0a',
          800: '#121212',
        }
      },
      fontFamily: {
        mono: ['"Roboto Mono"', '"Fira Code"', '"Courier New"', 'Courier', 'monospace'],
      },
      animation: {
        'glitch': 'glitch 1s linear infinite',
        'scan': 'scan 2s linear infinite',
      },
      keyframes: {
        glitch: {
          '2%, 64%': { transform: 'translate(2px,0) skew(0deg)' },
          '4%, 60%': { transform: 'translate(-2px,0) skew(0deg)' },
          '62%': { transform: 'translate(0,0) skew(5deg)' },
        },
        scan: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '0% 100%' },
        }
      }
    },
  },
  plugins: [],
}
