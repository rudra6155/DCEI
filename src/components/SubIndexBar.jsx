import React from 'react'
import { motion } from 'framer-motion'
import { getRiskColor } from '../utils/helpers.js'

/**
 * SubIndexBar — animated horizontal progress bar.
 * Props:
 *   label: string
 *   value: number (0-100)
 *   color: string (optional, auto-computed from value if not provided)
 */
export default function SubIndexBar({ label, value = 0, color }) {
  const barColor = color || getRiskColor(value)
  const safeValue = Math.max(0, Math.min(100, value || 0))

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          {label}
        </span>
        <span
          className="text-xs font-bold tabular-nums"
          style={{ color: barColor }}
        >
          {safeValue.toFixed(1)}
        </span>
      </div>
      <div className="w-full h-2 bg-slate-800/60 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${safeValue}%` }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
          style={{
            background: `linear-gradient(90deg, ${barColor}cc, ${barColor})`,
            boxShadow: `0 0 8px ${barColor}50`,
          }}
        />
      </div>
    </div>
  )
}
