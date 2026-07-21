import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0f3d33', // Bedia deep green
          dark: '#0a2b24',
          light: '#e8f0ed',
        },
      },
    },
  },
  plugins: [],
};
export default config;
