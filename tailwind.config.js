/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Define the accent color (pink/red)
        accent: {
          DEFAULT: '#fa586a',
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#ffccd1',
          300: '#ffa3ac',
          400: '#ff6d7a',
          500: '#fa586a',
          600: '#e52d41',
          700: '#c11d31',
          800: '#9f1a2c',
          900: '#851b2c',
          950: '#490a14',
        },
        // Replace primary with accent
        primary: {
          DEFAULT: '#fa586a',
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#ffccd1',
          300: '#ffa3ac',
          400: '#ff6d7a',
          500: '#fa586a',
          600: '#e52d41',
          700: '#c11d31',
          800: '#9f1a2c',
          900: '#851b2c',
          950: '#490a14',
        },
        // Override the gray colors with zinc (true grayscale)
        gray: {
          50: '#fafafa',  // zinc-50
          100: '#f4f4f5', // zinc-100
          200: '#e4e4e7', // zinc-200
          300: '#d4d4d8', // zinc-300
          400: '#a1a1aa', // zinc-400
          500: '#71717a', // zinc-500
          600: '#52525b', // zinc-600
          700: '#3f3f46', // zinc-700
          800: '#27272a', // zinc-800
          900: '#18181b', // zinc-900
          950: '#09090b', // zinc-950
        },
        // Define dark mode colors
        dark: {
          background: '#121212',
          card: '#1e1e1e',
          surface: '#282828',
          text: '#ffffff',
        },
      },
      fontFamily: {
        sans: ['Rubik', 'Helvetica', 'Arial', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 1.5s infinite linear',
      },
    },
  },
  plugins: [],
};