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
        // ── Base surfaces (measured from reference screenshots) ──
        paper:      '#FFFFFF',   // page background
        'paper-2':  '#EDEDEB',   // recessed panels, alt table rows
        'paper-3':  '#F0F0EE',   // inset wells
        bar:        '#7D7D7D',   // full-width header bars
        ink:        '#3B3B3B',   // primary text and borders
        'ink-soft': '#818181',   // secondary text, labels

        // ── Accent bands (measured) ──
        'band-primary': '#D3A9FD',   // selected nav/menu row (lavender)
        'band-focus':   '#61F690',   // focused options row (lime)
        select:         '#FFD275',   // selected tile / record band (amber)
        cube:           '#03CDD7',   // the teal cube

        // ── Game accents ──
        'pink-accent':  '#FDA9B6',   // decorative pink
        'btn-neutral':  '#EDEDEB',   // neutral button fill
        'btn-lavender': '#EADFFD',   // secondary button fill

        // ── Risk ramp (cool → warm, all WCAG AA on paper) ──
        'risk-low':      '#4AB0E8',
        'risk-moderate': '#60C860',
        'risk-high':     '#F4A020',
        'risk-critical': '#E03838',
      },

      fontFamily: {
        pixel: ['"Pixelify Sans"', 'monospace'],
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
