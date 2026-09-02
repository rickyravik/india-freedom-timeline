/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /* Reading surfaces */
        paper: {
          50: '#faf6ec',
          100: '#f5efe0',
          200: '#ece2cb',
          300: '#ddceac',
          400: '#c9b489',
        },
        /* Archive surfaces */
        vault: {
          DEFAULT: '#15120e',
          soft: '#1e1913',
          edge: '#2a231b',
        },
        ink: {
          DEFAULT: '#221c15',
          soft: '#4a4036',
          faint: '#6f6354',
        },
        indigo: {
          deep: '#22304f',
          mid: '#33456e',
          soft: '#5b6c94',
          wash: '#e8ebf2',
        },
        saffron: {
          DEFAULT: '#c07a2c',
          deep: '#9c5f1d',
          bright: '#e0a054',
          wash: '#f6e8d3',
        },
        forest: {
          DEFAULT: '#3d5a3c',
          deep: '#2c452c',
          bright: '#7fa07a',
          wash: '#e5ece3',
        },
        oxide: {
          DEFAULT: '#993527',
          deep: '#7a2a1f',
          bright: '#c9553f',
          wash: '#f3e2dd',
        },
        brass: {
          DEFAULT: '#9c7f3a',
          deep: '#7c6428',
          bright: '#d1b56a',
        },
        sepia: {
          DEFAULT: '#8a6f52',
          deep: '#5f4b36',
        },
      },
      fontFamily: {
        display: ['"Fraunces Variable"', 'Fraunces', 'Georgia', 'serif'],
        body: ['"Inter Variable"', 'system-ui', '-apple-system', 'sans-serif'],
        reading: ['"Crimson Pro"', 'Georgia', 'serif'],
      },
      fontSize: {
        display: ['clamp(2.75rem, 7vw, 6rem)', { lineHeight: '0.98', letterSpacing: '-0.02em' }],
        numeral: ['clamp(5rem, 22vw, 14rem)', { lineHeight: '0.85', letterSpacing: '-0.04em' }],
      },
      transitionTimingFunction: {
        cinematic: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
      },
      transitionDuration: {
        160: '160ms',
        400: '400ms',
        700: '700ms',
      },
      boxShadow: {
        card: '0 1px 2px rgba(34,28,21,0.06), 0 6px 20px -6px rgba(34,28,21,0.14)',
        lifted: '0 2px 4px rgba(34,28,21,0.08), 0 18px 40px -12px rgba(34,28,21,0.28)',
        sheet: '0 -12px 40px rgba(21,18,14,0.35)',
        vault: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 20px 60px -20px rgba(0,0,0,0.6)',
      },
      maxWidth: {
        prose: '66ch',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        maskUp: {
          from: { clipPath: 'inset(100% 0 0 0)', transform: 'translateY(12px)' },
          to: { clipPath: 'inset(0 0 0 0)', transform: 'translateY(0)' },
        },
        sheetUp: {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        pageEnter: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        drawLine: {
          from: { strokeDashoffset: '1' },
          to: { strokeDashoffset: '0' },
        },
        drift: {
          from: { transform: 'translateY(6%)' },
          to: { transform: 'translateY(-6%)' },
        },
        grow: {
          from: { transform: 'scaleY(0)' },
          to: { transform: 'scaleY(1)' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.22,0.61,0.36,1) both',
        'fade-in': 'fadeIn 0.4s ease-out both',
        'mask-up': 'maskUp 0.9s cubic-bezier(0.22,0.61,0.36,1) both',
        'sheet-up': 'sheetUp 0.42s cubic-bezier(0.22,0.61,0.36,1) both',
        'page-enter': 'pageEnter 0.4s cubic-bezier(0.22,0.61,0.36,1) both',
        'draw-line': 'drawLine 1.1s cubic-bezier(0.22,0.61,0.36,1) both',
      },
    },
  },
  plugins: [],
};
