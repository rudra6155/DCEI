/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    borderRadius: {
      DEFAULT: '0', none: '0', sm: '0', md: '0', lg: '0',
      xl: '0', '2xl': '0', '3xl': '0', full: '0',
    },
    extend: {
      colors: {
        paper:      '#FFFFFF',
        'paper-2':  '#EDEDEB',
        'paper-3':  '#F0F0EE',
        bar:        '#7D7D7D',
        ink:        '#3B3B3B',
        'ink-soft': '#7D7D7D',

        'band-primary': '#D3A9FD',
        'band-focus':   '#5EFB90',
        'band-teal':    '#69EACE',
        select:         '#FFD275',

        cube:        '#9D55FF',
        'cube-dark': '#3901AA',

        well:         '#A9A9A9',
        'tile-light': '#CECECE',
        'panel-grey': '#D2D2D2',
        lime:         '#C7F439',
        'pink-accent': '#FDA9B8',
        's-rank':     '#FEB39C',
        'footer-strip': '#3C3C3C',

        'btn-neutral':  '#EDEDEB',
        'btn-lavender': '#EADFFD',

        'risk-low':      '#4AB0E8',
        'risk-moderate': '#60C860',
        'risk-high':     '#F4A020',
        'risk-critical': '#E03838',
      },

      fontFamily: {
        // Exo 2 — matches EDGE game font exactly: geometric, thin, square, lowercase-forward
        pixel: ['"Exo 2"', 'sans-serif'],
        mono:  ['"Space Mono"', 'ui-monospace', 'monospace'],
        sans:  ['"Exo 2"', 'sans-serif'],
        // 'exo' convenience alias
        exo:   ['"Exo 2"', 'sans-serif'],
      },

      fontSize: {
        // Game-scale sizes — everything reads larger than typical web
        'game-xs':  ['0.75rem',  { lineHeight: '1.2' }],
        'game-sm':  ['0.9375rem',{ lineHeight: '1.3' }],
        'game-md':  ['1.125rem', { lineHeight: '1.4' }],
        'game-lg':  ['1.375rem', { lineHeight: '1.4' }],
        'game-xl':  ['1.75rem',  { lineHeight: '1.3' }],
        'game-2xl': ['2.25rem',  { lineHeight: '1.2' }],
        'game-3xl': ['3rem',     { lineHeight: '1.1' }],
        'game-4xl': ['4rem',     { lineHeight: '1' }],
      },

      animation: {
        'step-blink': 'step-blink 600ms steps(1) infinite',
        'step-tick':  'step-tick 80ms steps(1)',
      },

      keyframes: {
        'step-blink': { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0' } },
        'step-tick':  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
      },

      transitionTimingFunction: {
        'step-1': 'steps(1)',
        'step-4': 'steps(4)',
      },

      transitionDuration: {
        '120': '120ms', '150': '150ms', '160': '160ms', '180': '180ms',
      },
    },
  },
  plugins: [],
}
