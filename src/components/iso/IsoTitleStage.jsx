/**
 * IsoTitleStage — "DCEI" spelled out as stacked isometric blocks.
 *
 * Each letter is a 5-wide × 7-tall pixel bitmap.
 * Each "pixel" = one IsoBlock at height proportional to
 * a solid fill (height 1) vs blank (no block).
 *
 * The full word sits on a shared baseline in isometric space.
 */
import IsoBlock from './IsoBlock.jsx'

// 5×7 pixel bitmaps — 1 = block, 0 = empty
const GLYPHS = {
  D: [
    [1,1,1,0,0],
    [1,0,0,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,1,0],
    [1,1,1,0,0],
  ],
  C: [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,1],
    [0,1,1,1,0],
  ],
  E: [
    [1,1,1,1,1],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,1],
  ],
  I: [
    [1,1,1,1,1],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [1,1,1,1,1],
  ],
}

const WORD = ['D', 'C', 'E', 'I']

// Letter spacing in tile units (gap between letters)
const LETTER_GAP = 1

export default function IsoTitleStage({
  size       = 10,   // U in px
  originX    = 0,
  originY    = 0,
  topColor   = '#FFFFFF',
  leftColor  = '#C2C2C2',
  rightColor = '#BCBCBC',
}) {
  const U = size
  const blocks = []

  // iso grid: col goes right (+U, +U/2), row goes into depth (-U, +U/2)
  // For the title we lay letters left-to-right along the col axis.
  // Each letter's pixels are placed at row=0, with col incrementing.

  let colOffset = 0

  WORD.forEach((char) => {
    const glyph = GLYPHS[char]
    const glyphW = glyph[0].length
    const glyphH = glyph.length

    glyph.forEach((row, rowIdx) => {
      row.forEach((bit, colIdx) => {
        if (!bit) return
        // pixel position in tile coordinates
        const tileCol = colOffset + colIdx
        const tileRow = 0

        // screen position via isometric projection
        // col axis: right = (+U, +U/2), depth axis: out = (-U, +U/2)
        // For a flat 2-D letter grid we put columns along col axis only
        const sx = originX + tileCol * U
        // cy for each pixel row: letters grow UP, so flip rowIdx
        // y increases downward in SVG, so top row = small y
        const sy = originY + (glyphH - 1 - rowIdx) * U / 2 + tileRow * U / 2

        // we just need the front-bottom anchor (cx,cy) of the block
        const cx = sx
        const cy = sy

        blocks.push({ cx, cy, key: `${char}-${rowIdx}-${colIdx}` })
      })
    })

    colOffset += glyphW + LETTER_GAP
  })

  return (
    <g shapeRendering="crispEdges">
      {blocks.map(({ cx, cy, key }) => (
        <IsoBlock
          key={key}
          cx={cx}
          cy={cy}
          size={size}
          topColor={topColor}
          leftColor={leftColor}
          rightColor={rightColor}
        />
      ))}
    </g>
  )
}
