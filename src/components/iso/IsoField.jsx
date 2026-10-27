/**
 * IsoField — isometric city score field.
 *
 * Renders 50 city columns (one per city) as stacked IsoBlock towers.
 * Column height = composite score (0-100), mapped to 1-10 blocks.
 * Tower color = risk color from score.
 *
 * Props:
 *   cities     — array of { name, score, riskLevel } objects
 *   size       — U in px (tile unit, default 8)
 *   originX/Y  — SVG origin
 */
import IsoBlock from './IsoBlock.jsx'

const RISK_COLORS = {
  low:      { top: '#5BC8F0', left: '#3A9ECC', right: '#2E86AD' },
  moderate: { top: '#70D870', left: '#4AB04A', right: '#3A943A' },
  high:     { top: '#F4B030', left: '#D48010', right: '#B86800' },
  critical: { top: '#E85050', left: '#C02828', right: '#A01818' },
}

function riskColors(level) {
  return RISK_COLORS[level] || RISK_COLORS.moderate
}

export default function IsoField({
  cities   = [],
  size     = 8,
  originX  = 0,
  originY  = 0,
}) {
  const U = size
  const COLS_PER_ROW = 10

  return (
    <g shapeRendering="crispEdges">
      {cities.map((city, i) => {
        const col = i % COLS_PER_ROW
        const row = Math.floor(i / COLS_PER_ROW)

        // isometric screen position for base of column
        const sx = originX + (col - row) * U
        const sy = originY + (col + row) * U / 2

        const blocks = Math.max(1, Math.round((city.score || 50) / 10))
        const { top, left, right } = riskColors(city.riskLevel)

        return Array.from({ length: blocks }).map((_, bi) => (
          <IsoBlock
            key={`${i}-${bi}`}
            cx={sx}
            cy={sy - bi * U}
            size={size}
            topColor={bi === blocks - 1 ? top : left}
            leftColor={left}
            rightColor={right}
          />
        ))
      })}
    </g>
  )
}
