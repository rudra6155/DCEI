/**
 * ScoreReadout — stepped numeric score display with step animation.
 *
 * Counts up from 0 to `value` over ~600 ms using steps() timing.
 * When prefers-reduced-motion is set, shows final value immediately.
 *
 * Props:
 *   value      — number 0-100
 *   riskLevel  — 'low' | 'moderate' | 'high' | 'critical'
 *   label      — optional label below the number
 *   size       — 'sm' | 'md' | 'lg' (default 'md')
 *   className
 */
import { useEffect, useRef, useState } from 'react'

const RISK_COLOR = {
  low:      '#4AB0E8',
  moderate: '#60C860',
  high:     '#F4A020',
  critical: '#E03838',
}

const SIZE_CLS = {
  sm: 'text-lg',
  md: 'text-3xl',
  lg: 'text-5xl',
}

export default function ScoreReadout({
  value     = 0,
  riskLevel = 'moderate',
  label     = '',
  size      = 'md',
  className = '',
}) {
  const [displayed, setDisplayed] = useState(0)
  const rafRef = useRef(null)

  const reduced = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (reduced) {
      setDisplayed(value)
      return
    }

    const duration = 600
    const steps    = 20
    const stepMs   = duration / steps
    let step = 0

    function advance() {
      step++
      const v = Math.round((step / steps) * value)
      setDisplayed(v)
      if (step < steps) {
        rafRef.current = setTimeout(advance, stepMs)
      }
    }

    setDisplayed(0)
    rafRef.current = setTimeout(advance, stepMs)

    return () => clearTimeout(rafRef.current)
  }, [value, reduced])

  const color = RISK_COLOR[riskLevel] || RISK_COLOR.moderate

  return (
    <div className={`score-readout font-num leading-none ${SIZE_CLS[size] || SIZE_CLS.md} ${className}`}>
      <span className="text-glow-score" style={{ color }}>{String(displayed).padStart(2, '0')}</span>
      {label && (
        <span className="block text-xs font-mono text-ink-soft mt-1 tracking-widest uppercase">
          {label}
        </span>
      )}
    </div>
  )
}
