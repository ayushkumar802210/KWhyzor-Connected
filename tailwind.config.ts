import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#edfdfd',
          100: '#d8f9f7',
          300: '#71f1df',
          500: '#10b9b2',
          600: '#0d8b8b',
          700: '#0a6667',
          900: '#052c2d'
        },
        panel: '#0f172a',
        ink: '#0b1120',
        accent: '#f59e0b'
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(16, 185, 178, 0.12), 0 25px 50px -12px rgba(16, 185, 178, 0.25)'
      }
    }
  },
  plugins: []
};

export default config;
