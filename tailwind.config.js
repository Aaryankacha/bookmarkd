/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Cormorant Garamond', 'DM Serif Display', 'Georgia', 'serif'],
        display: ['Cormorant Garamond', 'serif'],
      },
      colors: {
        background: '#F8F6F2',
        surface: 'rgba(255, 255, 255, 0.75)',
        card: '#FFFFFF',
        surfaceHover: '#F0ECE1',
        primary: '#D4A65A',
        primaryHover: '#C29549',
        secondaryAccent: '#7C5C38',
        text: '#1D1D1F',
        textMuted: '#666666',
        border: 'rgba(0, 0, 0, 0.08)',
        hover: 'rgba(0, 0, 0, 0.04)',
      },
      backgroundImage: {
        'ambient-warm': 'radial-gradient(circle at 50% 20%, rgba(212, 166, 90, 0.08) 0%, transparent 60%)',
        'ambient-soft': 'radial-gradient(circle at 80% 30%, rgba(124, 92, 56, 0.04) 0%, transparent 50%)',
      },
      animation: {
        'pulse-subtle': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
