import React from 'react'
import { getRiskColor, getRiskBgColor, getRiskCategory } from '../utils/helpers.js'

/**
 * RiskBadge — displays a colored pill badge for a risk level.
 * Props:
 *   score: number (0-100) — takes priority
 *   category: string — fallback if score not provided
 */
export default function RiskBadge({ score, category }) {
  let label, color, bg

  if (score !== undefined && score !== null) {
    label = getRiskCategory(score)
    color = getRiskColor(score)
    bg = getRiskBgColor(score)
  } else if (category) {
    label = category
    const scoreMap = { Low: 20, Moderate: 40, High: 60, Critical: 80 }
    const fakeScore = scoreMap[category] ?? 50
    color = getRiskColor(fakeScore)
    bg = getRiskBgColor(fakeScore)
  } else {
    label = 'Unknown'
    color = '#94a3b8'
    bg = 'rgba(148, 163, 184, 0.15)'
  }

  const dotColor = color

  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase"
      style={{ backgroundColor: bg, color }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: dotColor }}
      />
      {label}
    </span>
  )
}
