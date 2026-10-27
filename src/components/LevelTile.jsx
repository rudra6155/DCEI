/**
 * LevelTile — square city tile for the Explorer grid.
 *
 * - Selected state: amber (select) background
 * - Estimated data: diagonal half-shade (top-right triangle paper-2)
 * - Risk color swatch at bottom edge
 *
 * Props:
 *   number     — display number (1-50)
 *   name       — city name
 *   score      — 0-100
 *   riskLevel  — 'low' | 'moderate' | 'high' | 'critical'
 *   estimated  — boolean (shows diagonal half-shade)
 *   selected   — boolean
 *   onClick
 *   className
 */
const RISK_FILL = {
  low:      '#4AB0E8',
  moderate: '#60C860',
  high:     '#F4A020',
  critical: '#E03838',
}

export default function LevelTile({
  number    = 1,
  name      = '',
  score     = 0,
  riskLevel = 'moderate',
  estimated = false,
  selected  = false,
  onClick,
  className = '',
}) {
  const risk = RISK_FILL[riskLevel] || RISK_FILL.moderate

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'level-tile relative border border-ink font-pixel text-left',
        'w-full aspect-square flex flex-col justify-between p-1',
        'transition-colors duration-120 ease-step-1',
        selected ? 'bg-select' : 'bg-paper hover:bg-paper-2',
        className,
      ].join(' ')}
    >
      {/* Estimated diagonal half-shade */}
      {estimated && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <polygon points="100%,0 100%,50% 50%,0" fill="#EDEDEB" />
        </svg>
      )}

      {/* Level number */}
      <span className="text-[8px] text-ink-soft leading-none z-10">
        {String(number).padStart(2, '0')}
      </span>

      {/* City name */}
      <span className="text-[7px] text-ink leading-tight break-words z-10 line-clamp-2">
        {name}
      </span>

      {/* Risk swatch at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{ backgroundColor: risk }}
        aria-hidden="true"
      />
    </button>
  )
}
