import { getRiskColor, getRiskBgColor, getRiskCategory, getRiskLevel } from '../utils/helpers.js'

/**
 * RiskBadge — square-corner chip showing risk level.
 * Props:
 *   score: number (0-100) — takes priority
 *   category: string — fallback if score not provided
 */
export default function RiskBadge({ score, category }) {
  let label, color, bg, level

  if (score !== undefined && score !== null) {
    label = getRiskCategory(score)
    color = getRiskColor(score)
    bg    = getRiskBgColor(score)
    level = getRiskLevel(score)
  } else if (category) {
    label = category
    const scoreMap = { Low: 20, Moderate: 40, High: 60, Critical: 80 }
    const fakeScore = scoreMap[category] ?? 50
    color = getRiskColor(fakeScore)
    bg    = getRiskBgColor(fakeScore)
    level = getRiskLevel(fakeScore)
  } else {
    label = 'Unknown'
    color = '#818181'
    bg    = '#EDEDEB'
    level = 'moderate'
  }

  return (
    <span
      className={`risk-chip risk-chip--${level} inline-flex items-center gap-1.5 px-2 py-0.5 font-mono text-xs uppercase tracking-wider border border-ink`}
      style={{ backgroundColor: bg, color }}
    >
      <span
        className="w-1.5 h-1.5 flex-shrink-0"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      {label}
    </span>
  )
}
