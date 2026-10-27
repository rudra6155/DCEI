import SegMeter from './SegMeter.jsx'
import { getRiskColor, getRiskLevel } from '../utils/helpers.js'

/**
 * SubIndexBar — label + SegMeter replacing animated gradient bar.
 * Props:
 *   label: string
 *   value: number (0-100)
 *   color: string (optional, auto-computed)
 */
export default function SubIndexBar({ label, value = 0, color }) {
  const safeValue = Math.max(0, Math.min(100, value || 0))
  const level     = getRiskLevel(safeValue)
  const textColor = color || getRiskColor(safeValue)

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-mono text-ink-soft uppercase tracking-wider">
          {label}
        </span>
        <span className="text-xs font-mono tabular-nums" style={{ color: textColor }}>
          {safeValue.toFixed(1)}
        </span>
      </div>
      <SegMeter value={safeValue} riskLevel={level} size={8} gap={1} />
    </div>
  )
}
