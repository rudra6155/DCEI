/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    // Zero radius everywhere — game UI uses hard corners
    borderRadius: {
      DEFAULT: '0',
      none: '0',
      sm: '0',
      md: '0',
      lg: '0',
      xl: '0',
      '2xl': '0',
      '3xl': '0',
      full: '0',
    },
    extend: {
      colors: {
        // ── Base surfaces ──
        paper:      '#FFFFFF',
        'paper-2':  '#EDEDEB',
        'paper-3':  '#F0F0EE',
        bar:        '#7D7D7D',
        ink:        '#3B3B3B',
        'ink-soft': '#7D7D7D',   // unified with bar measurement

        // ── Accent bands (pixel-sampled) ──
        'band-primary': '#D3A9FD',   // selected nav/menu row (lavender)
        'band-focus':   '#5EFB90',   // focused options row (mint) — corrected from #61F690
        'band-teal':    '#69EACE',   // teal band (bonus level screen)
        select:         '#FFD275',   // selected tile / record band (amber)

        // ── Cube ──
        cube:        '#9D55FF',   // isometric cube top — purple (corrected from teal)
        'cube-dark': '#3901AA',   // cube dark face
        'cube-top':  '#9D55FF',   // alias

        // ── Grey scale tones (pixel-sampled from scores/result screens) ──
        well:         '#A9A9A9',   // scores screen background well
        'tile-light': '#CECECE',   // diagonal-split tile light half
        'panel-grey': '#D2D2D2',   // result screen panel background

        // ── Game accents ──
        lime:         '#C7F439',   // lime rank number (result screen)
        'pink-accent': '#FDA9B8',  // soft pink (viewport frame)
        's-rank':     '#FEB39C',   // salmon rank letter

        // ── Footer ──
        'footer-strip': '#3C3C3C',

        // ── Button fills ──
        'btn-neutral':  '#EDEDEB',
        'btn-lavender': '#EADFFD',

        // ── Risk ramp ──
        'risk-low':      '#4AB0E8',
        'risk-moderate': '#60C860',
        'risk-high':     '#F4A020',
        'risk-critical': '#E03838',
      },

      fontFamily: {
        pixel: ['"Micro 5"', '"Pixelify Sans"', 'monospace'],
        mono:  ['"Space Mono"', 'ui-monospace', 'monospace'],
        sans:  ['"Space Mono"', 'ui-monospace', 'monospace'],
      },

      animation: {
        'step-blink': 'step-blink 600ms steps(1) infinite',
        'step-tick':  'step-tick 80ms steps(1)',
      },

      keyframes: {
        'step-blink': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
        'step-tick': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },

      transitionTimingFunction: {
        'step-1': 'steps(1)',
        'step-4': 'steps(4)',
      },

      transitionDuration: {
        '120': '120ms',
        '150': '150ms',
        '160': '160ms',
        '180': '180ms',
      },
    },
  },
  plugins: [],
}
