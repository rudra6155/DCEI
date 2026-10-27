/**
 * PixelGlyph — hand-drawn 8×8 and 12×12 SVG pixel icons.
 *
 * Replaces all emoji and Heroicon usage in the app.
 * Each glyph is a minimal 1-bit pixel bitmap rendered as SVG rects.
 *
 * Usage:
 *   <PixelGlyph name="water" size={12} color="#3B3B3B" />
 *
 * Available names:
 *   water, bolt, leaf, city, chart, arrow-right, arrow-left,
 *   check, cross, info, warning, download, external, menu,
 *   filter, sort, compare, reset
 */

// Pixel bitmaps: each row is an integer, bits read left-to-right (MSB first).
// All are 8×8 unless marked 12 (those entries have 12 rows).
const GLYPHS = {
  // Water drop
  water: {
    size: 8,
    rows: [
      0b00011000,
      0b00111100,
      0b01111110,
      0b11111111,
      0b11111111,
      0b11111111,
      0b01111110,
      0b00111100,
    ],
  },
  // Lightning bolt
  bolt: {
    size: 8,
    rows: [
      0b00001110,
      0b00011100,
      0b00111000,
      0b01111110,
      0b00111100,
      0b00011000,
      0b00110000,
      0b01100000,
    ],
  },
  // Leaf
  leaf: {
    size: 8,
    rows: [
      0b00001100,
      0b00011110,
      0b00111111,
      0b01111110,
      0b11111100,
      0b11111000,
      0b01110000,
      0b00100000,
    ],
  },
  // City / buildings
  city: {
    size: 8,
    rows: [
      0b00100100,
      0b00100100,
      0b01101100,
      0b01101100,
      0b11111110,
      0b10110010,
      0b10110010,
      0b11111111,
    ],
  },
  // Bar chart
  chart: {
    size: 8,
    rows: [
      0b00000010,
      0b00000110,
      0b00001110,
      0b00011110,
      0b00111110,
      0b01111110,
      0b11111110,
      0b11111111,
    ],
  },
  // Arrow right
  'arrow-right': {
    size: 8,
    rows: [
      0b00000000,
      0b00010000,
      0b00001000,
      0b11111111,
      0b11111111,
      0b00001000,
      0b00010000,
      0b00000000,
    ],
  },
  // Arrow left
  'arrow-left': {
    size: 8,
    rows: [
      0b00000000,
      0b00001000,
      0b00010000,
      0b11111111,
      0b11111111,
      0b00010000,
      0b00001000,
      0b00000000,
    ],
  },
  // Checkmark
  check: {
    size: 8,
    rows: [
      0b00000001,
      0b00000011,
      0b00000110,
      0b10001100,
      0b11011000,
      0b01110000,
      0b00100000,
      0b00000000,
    ],
  },
  // Cross / close
  cross: {
    size: 8,
    rows: [
      0b11000011,
      0b01100110,
      0b00111100,
      0b00011000,
      0b00011000,
      0b00111100,
      0b01100110,
      0b11000011,
    ],
  },
  // Info circle
  info: {
    size: 8,
    rows: [
      0b00111100,
      0b01111110,
      0b11011011,
      0b11111111,
      0b11001111,
      0b11001111,
      0b01111110,
      0b00111100,
    ],
  },
  // Warning triangle
  warning: {
    size: 8,
    rows: [
      0b00011000,
      0b00111100,
      0b00111100,
      0b01111110,
      0b01011010,
      0b11111111,
      0b11011011,
      0b11111111,
    ],
  },
  // Download arrow
  download: {
    size: 8,
    rows: [
      0b00011000,
      0b00011000,
      0b00011000,
      0b00011000,
      0b10011001,
      0b01011010,
      0b00111100,
      0b00011000,
    ],
  },
  // External link
  external: {
    size: 8,
    rows: [
      0b00001111,
      0b00011111,
      0b00110001,
      0b01100011,
      0b11000110,
      0b10001100,
      0b11111000,
      0b11110000,
    ],
  },
  // Menu / hamburger
  menu: {
    size: 8,
    rows: [
      0b00000000,
      0b11111111,
      0b00000000,
      0b11111111,
      0b00000000,
      0b11111111,
      0b00000000,
      0b00000000,
    ],
  },
  // Filter funnel
  filter: {
    size: 8,
    rows: [
      0b11111111,
      0b01111110,
      0b00111100,
      0b00011000,
      0b00011000,
      0b00011000,
      0b00011000,
      0b00011000,
    ],
  },
  // Sort arrows
  sort: {
    size: 8,
    rows: [
      0b00010001,
      0b00111011,
      0b01111111,
      0b00010001,
      0b00010001,
      0b01111111,
      0b00111011,
      0b00010001,
    ],
  },
  // Compare / split screen
  compare: {
    size: 8,
    rows: [
      0b11110111,
      0b10010100,
      0b10010100,
      0b11110111,
      0b10010100,
      0b10010100,
      0b11110100,
      0b00000111,
    ],
  },
  // Reset / cycle arrow
  reset: {
    size: 8,
    rows: [
      0b00111100,
      0b01111000,
      0b11000000,
      0b11000000,
      0b11000000,
      0b11000000,
      0b01111110,
      0b00111100,
    ],
  },
}

export default function PixelGlyph({
  name      = 'info',
  size      = 8,
  color     = '#3B3B3B',
  className = '',
  style     = {},
}) {
  const glyph = GLYPHS[name]
  if (!glyph) return null

  const n    = glyph.size    // native pixel grid size
  const rows = glyph.rows
  const scale = size / n     // px per pixel

  const rects = []
  rows.forEach((row, y) => {
    for (let x = 0; x < n; x++) {
      if (row & (1 << (n - 1 - x))) {
        rects.push(
          <rect
            key={`${y}-${x}`}
            x={x * scale}
            y={y * scale}
            width={scale}
            height={scale}
            fill={color}
          />
        )
      }
    }
  })

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
      className={`pixel-glyph inline-block ${className}`}
      style={style}
      shapeRendering="crispEdges"
    >
      {rects}
    </svg>
  )
}
