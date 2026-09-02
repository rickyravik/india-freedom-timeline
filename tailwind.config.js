/** @type {import('tailwindcss').Config} */
/*
  "The Commemorative Sheet" — India Post martyr commemoratives.
  Token names are inherited from the previous system; their values are stamp
  inks. The mapping, so the names read correctly:
    vault  = album page (the dark field stamps are mounted on; the dominant surface)
    paper  = gummed sheet (the mounted sheet — the only place long reading happens)
    oxide  = franking ochre (THE accent ink: primary action, links, hover)
    saffron= carmine        (one era ink)
    brass  = perforation gauge gold (rules, frames, ornament)
    sepia  = plum           (metadata ink, one era ink)
*/
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /* Album page — the dominant field */
        vault: {
          DEFAULT: '#10312b',
          soft: '#16403a',
          edge: '#1d5148',
        },
        /* Gummed sheet — mounted, and the only reading surface */
        paper: {
          50: '#f7f3ea',
          100: '#f2ede2',
          200: '#e6dfcf',
          300: '#d3c9b4',
          400: '#b9ac91',
        },
        ink: {
          DEFAULT: '#17201c',
          soft: '#3d4a44',
          faint: '#5a6861',
        },
        /* Franking ochre — the one accent ink */
        oxide: {
          deep: '#a34e12',
          DEFAULT: '#c4611f',
          bright: '#eda15f',
          wash: '#f7e6d6',
        },
        /* Era inks */
        indigo: {
          deep: '#1a3154',
          mid: '#23406b',
          soft: '#a8b8cd',
          wash: '#e6eaf1',
        },
        forest: {
          deep: '#0e332d',
          DEFAULT: '#14453d',
          bright: '#a8c7bd',
          wash: '#e3ece9',
        },
        saffron: {
          deep: '#6f2420',
          DEFAULT: '#8e2f2a',
          bright: '#d98a80',
          wash: '#f2e2e0',
        },
        sepia: {
          DEFAULT: '#5b2e4a',
          deep: '#452038',
          bright: '#c5a8b7',
        },
        /* Perforation gauge gold — rules, frames, ornament */
        brass: {
          deep: '#7c6428',
          DEFAULT: '#8f7a45',
          bright: '#dcc17f',
        },
      },
      fontFamily: {
        /* Engraved head — a Didone, the way stamp legends were cut */
        display: ['"Bodoni Moda Variable"', '"Bodoni Moda"', 'Georgia', 'serif'],
        /* Denominations, labels, UI — the condensed gothic of a stamp's value */
        body: ['"Archivo Narrow Variable"', '"Archivo Narrow"', 'system-ui', 'sans-serif'],
        /* Long-form reading */
        reading: ['"Faustina Variable"', 'Faustina', 'Georgia', 'serif'],
      },
      /* Role scale — fixed steps, two breakpoints, no fluid clamp */
      fontSize: {
        label: ['0.8125rem', { lineHeight: '1.25rem' }],
        meta: ['0.9375rem', { lineHeight: '1.45' }],
        reading: ['1.0625rem', { lineHeight: '1.62' }],
        /* record title / pull-quote — the step between reading and h3 */
        h4: ['1.1875rem', { lineHeight: '1.3' }],
        h3: ['1.375rem', { lineHeight: '1.2' }],
        h2: ['1.875rem', { lineHeight: '1.12' }],
        h1: ['2.75rem', { lineHeight: '1.05' }],
        /* the hero's phone cut: 4rem breaks the headline over four lines at 390px */
        'hero-sm': ['2.25rem', { lineHeight: '1.06' }],
        hero: ['4rem', { lineHeight: '1.02' }],
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
        sheet: '0 -12px 40px rgba(8,24,20,0.45)',
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
