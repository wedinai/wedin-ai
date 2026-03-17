/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FAF7F2',
        navy: '#1C2B3A',
        gold: '#C4922A',
        grey: '#6B6560',
        white: '#FFFFFF',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Type scale from brand kit
        'hero': ['clamp(2.5rem,8vw,5rem)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        'h1':   ['1.75rem',  { lineHeight: '1.2' }],
        'h2':   ['1.25rem',  { lineHeight: '1.3' }],
        'question': ['1.5rem', { lineHeight: '1.4' }],
        'body': ['1rem',    { lineHeight: '1.7' }],
        'label': ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.12em' }],
        'caption': ['0.8125rem', { lineHeight: '1.5' }],
        'btn':  ['0.9375rem', { lineHeight: '1', letterSpacing: '0.01em' }],
      },
      borderRadius: {
        DEFAULT: '8px',
        'card': '16px',
        'pill': '100px',
        'btn': '10px',
      },
      boxShadow: {
        'card': '0 4px 24px rgba(28,43,58,0.07), 0 1px 4px rgba(28,43,58,0.04)',
        'btn':  '0 2px 8px rgba(28,43,58,0.12)',
        'btn-hover': '0 4px 16px rgba(28,43,58,0.18)',
        'chip': '0 1px 4px rgba(28,43,58,0.08)',
        'chip-hover': '0 2px 8px rgba(28,43,58,0.14)',
        'gold-glow': '0 0 0 3px rgba(196,146,42,0.12)',
      },
      spacing: {
        'xs':  '4px',
        'sm':  '8px',
        'md':  '16px',
        'lg':  '24px',
        'xl':  '40px',
        '2xl': '64px',
        '3xl': '96px',
      },
      maxWidth: {
        'reading': '760px',
        'form': '480px',
        'mobile': '430px',
      },
      letterSpacing: {
        'wordmark': '0.04em',
        'label': '0.12em',
      },
    },
  },
  plugins: [],
}
