import ScoreReadout from './ScoreReadout.jsx'
import SegMeter from './SegMeter.jsx'
import { getRiskCategory, getRiskLevel } from '../utils/helpers.js'

/**
 * ScoreGauge — replaces semicircle with ScoreReadout + SegMeter.
 * Props:
 *   score: number (0-100)
 *   size: number (kept for API compat, controls layout scale)
 */
export default function ScoreGauge({ score = 0, size = 160 }) {
  const level    = getRiskLevel(score)
  const category = getRiskCategory(score)
  const textSize = size >= 140 ? 'lg' : size >= 100 ? 'md' : 'sm'

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <ScoreReadout value={score} riskLevel={level} size={textSize} />
      <SegMeter value={score} riskLevel={level} size={10} gap={2} />
      <span className="font-mono text-xs text-ink-soft uppercase tracking-widest">
        {category}
      </span>
    </div>
  )
}
