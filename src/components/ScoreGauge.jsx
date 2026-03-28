import React, { useEffect, useRef, useState } from 'react'
import { getRiskColor, getRiskCategory, formatScore } from '../utils/helpers.js'

/**
 * ScoreGauge — SVG semicircle gauge with animated count-up.
 * Props:
 *   score: number (0-100)
 *   size: number (default 160)
 */
export default function ScoreGauge({ score = 0, size = 160 }) {
  const [displayScore, setDisplayScore] = useState(0)
  const animRef = useRef(null)
  const startTimeRef = useRef(null)
  const targetScore = score

  useEffect(() => {
    const duration = 1200
    const startVal = 0

    if (animRef.current) cancelAnimationFrame(animRef.current)
    startTimeRef.current = null
    setDisplayScore(startVal)

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayScore(startVal + eased * (targetScore - startVal))
      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate)
      }
    }

    animRef.current = requestAnimationFrame(animate)
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [targetScore])

  const riskColor = getRiskColor(score)
  const riskCategory = getRiskCategory(score)

  // SVG geometry
  const cx = size / 2
  const cy = size / 2
  const r = (size / 2) * 0.72
  const strokeW = size * 0.075

  // Semicircle: from 180° to 0° (left to right across bottom)
  // We'll go from 180° → 0° (top arc) as the "full sweep"
  // start angle: 180deg (left), end angle: 0deg (right) — goes over the top
  // In SVG coords: angle 0 = right, 90 = down
  // We want the arc to go from bottom-left to bottom-right over the top
  // startAngle = 180° (left), endAngle = 0° (right), sweep = 180°

  const startAngleDeg = 180
  const sweepDeg = 180
  const progressAngleDeg = startAngleDeg - (sweepDeg * (displayScore / 100))

  function polarToXY(cx, cy, r, angleDeg) {
    const rad = (angleDeg * Math.PI) / 180
    return {
      x: cx + r * Math.cos(rad),
      y: cy - r * Math.sin(rad),
    }
  }

  // Background arc: from 180° → 0° (full semicircle over top)
  const bgStart = polarToXY(cx, cy, r, 180)
  const bgEnd = polarToXY(cx, cy, r, 0)
  const bgPath = `M ${bgStart.x} ${bgStart.y} A ${r} ${r} 0 0 1 ${bgEnd.x} ${bgEnd.y}`

  // Progress arc: from 180° → progressAngleDeg
  const progEnd = polarToXY(cx, cy, r, progressAngleDeg)
  const largeArc = (180 - progressAngleDeg) >= 180 ? 1 : 0
  const progPath = displayScore <= 0
    ? null
    : `M ${bgStart.x} ${bgStart.y} A ${r} ${r} 0 ${largeArc} 1 ${progEnd.x} ${progEnd.y}`

  const fontSize = size * 0.18
  const labelSize = size * 0.085

  return (
    <div className="relative inline-flex flex-col items-center">
      <svg
        width={size}
        height={size * 0.62}
        viewBox={`0 0 ${size} ${size * 0.62}`}
        className="overflow-visible"
      >
        {/* Background track */}
        <path
          d={bgPath}
          fill="none"
          stroke="rgba(30,41,59,0.8)"
          strokeWidth={strokeW}
          strokeLinecap="round"
        />
        {/* Colored progress arc */}
        {progPath && (
          <path
            d={progPath}
            fill="none"
            stroke={riskColor}
            strokeWidth={strokeW}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 6px ${riskColor}80)`,
            }}
          />
        )}
        {/* Score text */}
        <text
          x={cx}
          y={size * 0.47}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize={fontSize}
          fontWeight="700"
          fontFamily="inherit"
        >
          {formatScore(displayScore)}
        </text>
        {/* Risk category label */}
        <text
          x={cx}
          y={size * 0.58}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={riskColor}
          fontSize={labelSize}
          fontWeight="600"
          fontFamily="inherit"
          letterSpacing="0.05em"
        >
          {riskCategory.toUpperCase()}
        </text>
        {/* Min/Max labels */}
        <text
          x={cx - r - strokeW / 2}
          y={size * 0.575}
          textAnchor="middle"
          fill="rgba(148,163,184,0.6)"
          fontSize={size * 0.065}
          fontFamily="inherit"
        >
          0
        </text>
        <text
          x={cx + r + strokeW / 2}
          y={size * 0.575}
          textAnchor="middle"
          fill="rgba(148,163,184,0.6)"
          fontSize={size * 0.065}
          fontFamily="inherit"
        >
          100
        </text>
      </svg>
    </div>
  )
}
