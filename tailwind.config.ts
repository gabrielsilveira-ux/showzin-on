import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream:  '#F5F0E8',
        ink:    '#1C1A16',
        accent: '#E8430A',
      },
      fontFamily: {
        display: ["'Playfair Display'", 'serif'],
        mono:    ["'DM Mono'",          'monospace'],
        sans:    ["'DM Sans'",          'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
