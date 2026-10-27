/**
 * SegMeter — 10-segment bar replacing gradient progress bars.
 *
 * Each segment is a square pixel. Filled segments use the risk color,
 * empty segments use paper-2 (#EDEDEB).
 *
 * Props:
 *   value      — 0-100
 *   riskLevel  — 'low' | 'moderate' | 'high' | 'critical'
 *   size       — segment side length in px (default 10)
 *   gap        — gap between segments in px (default 2)
 *   className
 */
const RISK_FILL = {
  low:      '#4AB0E8',
  moderate: '#60C860',
  high:     '#F4A020',
  critical: '#E03838',
}

export default function SegMeter({
  value     = 0,
  riskLevel = 'moderate',
  size      = 10,
  gap       = 2,
  className = '',
}) {
  const filled = Math.round(Math.min(100, Math.max(0, value)) / 10)
  const fill   = RISK_FILL[riskLevel] || RISK_FILL.moderate
  const empty  = '#EDEDEB'
  const totalW = 10 * size + 9 * gap

  return (
    <svg
      width={totalW}
      height={size}
      aria-label={`Score ${value} out of 100`}
      className={`seg-meter ${className}`}
      shapeRendering="crispEdges"
    >
      {Array.from({ length: 10 }).map((_, i) => (
        <rect
          key={i}
          x={i * (size + gap)}
          y={0}
          width={size}
          height={size}
          fill={i < filled ? fill : empty}
        />
      ))}
    </svg>
  )
}
