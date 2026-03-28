import React, { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'

import { CITIES } from '../data/cities.js'
import { scoreAllCities, normalizeWeights, WEIGHT_SCENARIOS, DEFAULT_WEIGHTS } from '../data/scoring.js'
import { getRiskColor, getRiskCategory, formatScore } from '../utils/helpers.js'

const PAGE_TRANSITION = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.35 },
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const score = payload[0]?.value
  return (
    <div className="glass-dark rounded-xl p-3 border border-white/10 text-sm min-w-[160px]">
      <p className="text-white font-semibold mb-1">{label}</p>
      <p style={{ color: getRiskColor(score) }} className="font-bold text-lg">{formatScore(score)}</p>
      <p className="text-xs text-slate-500">{getRiskCategory(score)} Risk</p>
    </div>
  )
}

// Heatmap color interpolation
function heatmapColor(score) {
  if (score <= 30) return `rgba(16,185,129,${0.3 + score / 100})`
  if (score <= 50) return `rgba(245,158,11,${0.3 + score / 100})`
  if (score <= 70) return `rgba(249,115,22,${0.3 + score / 100})`
  return `rgba(239,68,68,${0.3 + score / 100})`
}

export default function Sensitivity() {
  const [w1, setW1] = useState(35)
  const [w2, setW2] = useState(25)
  const [w3, setW3] = useState(20)
  const [w4, setW4] = useState(20)
  const [activeScenario, setActiveScenario] = useState('default')

  // Auto-normalize weights for scoring
  const rawWeights = { w1: w1 / 100, w2: w2 / 100, w3: w3 / 100, w4: w4 / 100 }
  const normalizedWeights = normalizeWeights(rawWeights)

  const scoredCities = useMemo(
    () => scoreAllCities(CITIES, normalizedWeights),
    [w1, w2, w3, w4]
  )

  // Pre-compute all scenario scores for heatmap
  const heatmapData = useMemo(() => {
    return WEIGHT_SCENARIOS.map(scenario => ({
      ...scenario,
      scores: scoreAllCities(CITIES, scenario.weights),
    }))
  }, [])

  // Sorted cities alphabetically for heatmap rows
  const heatmapCities = useMemo(
    () => [...CITIES].sort((a, b) => a.name.localeCompare(b.name)),
    []
  )

  const sum = w1 + w2 + w3 + w4
  const display = {
    w1: ((w1 / sum) * 100).toFixed(0),
    w2: ((w2 / sum) * 100).toFixed(0),
    w3: ((w3 / sum) * 100).toFixed(0),
    w4: ((w4 / sum) * 100).toFixed(0),
  }

  const handlePreset = (scenario) => {
    setActiveScenario(scenario.name)
    const nw = scenario.weights
    setW1(Math.round(nw.w1 * 100))
    setW2(Math.round(nw.w2 * 100))
    setW3(Math.round(nw.w3 * 100))
    setW4(Math.round(nw.w4 * 100))
  }

  const sliderStyle = "w-full accent-indigo-500"

  return (
    <motion.div className="page-transition pt-20 pb-12 min-h-screen" {...PAGE_TRANSITION}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Sensitivity Analysis</h1>
          <p className="text-slate-400">
            Adjust sub-index weights to see how rankings change. Weights are auto-normalized to sum to 1.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Weight controls */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-24">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Weight Configuration</h3>

              {/* Weight summary */}
              <div className="flex flex-wrap gap-2 mb-5 text-xs font-mono">
                <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400">WSI: {display.w1}%</span>
                <span className="px-2 py-1 rounded bg-purple-500/10 text-purple-400">CII: {display.w2}%</span>
                <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400">CPI: {display.w3}%</span>
                <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-400">TLI: {display.w4}%</span>
              </div>

              {/* Sliders */}
              <div className="space-y-5">
                {[
                  { label: '💧 WSI — Water Stress', val: w1, set: setW1, color: 'text-blue-400' },
                  { label: '⚡ CII — Carbon Intensity', val: w2, set: setW2, color: 'text-purple-400' },
                  { label: '👥 CPI — Community Pressure', val: w3, set: setW3, color: 'text-emerald-400' },
                  { label: '🌡️ TLI — Thermal Load', val: w4, set: setW4, color: 'text-amber-400' },
                ].map(({ label, val, set, color }) => (
                  <div key={label}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs text-slate-400">{label}</span>
                      <span className={`text-sm font-bold font-mono ${color}`}>{val}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={val}
                      onChange={e => {
                        set(Number(e.target.value))
                        setActiveScenario('custom')
                      }}
                      className={sliderStyle}
                    />
                  </div>
                ))}
              </div>

              {/* Sum indicator */}
              <div className={`mt-4 text-xs px-3 py-2 rounded-lg ${
                sum === 100
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'bg-amber-500/10 text-amber-400'
              }`}>
                Raw sum: {sum} {sum !== 100 && '→ auto-normalized'}
              </div>

              {/* Preset buttons */}
              <div className="mt-5">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Presets</p>
                <div className="flex flex-col gap-2">
                  {WEIGHT_SCENARIOS.map(scenario => (
                    <button
                      key={scenario.name}
                      onClick={() => handlePreset(scenario)}
                      className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        activeScenario === scenario.name
                          ? 'bg-indigo-500/20 text-white border border-indigo-500/30'
                          : 'text-slate-400 hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      {scenario.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bar chart */}
          <div className="lg:col-span-2">
            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
                All 50 Cities — Sorted by DCEI Score
              </h3>
              <ResponsiveContainer width="100%" height={420}>
                <BarChart
                  data={scoredCities.map(c => ({ name: c.name, score: c.DCEI_score, risk: c.risk_category }))}
                  layout="vertical"
                  margin={{ left: 80, right: 40, top: 4, bottom: 4 }}
                  barSize={8}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    width={78}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                  <Bar dataKey="score" radius={[0, 3, 3, 0]}>
                    {scoredCities.map((city) => (
                      <Cell key={city.id} fill={getRiskColor(city.DCEI_score)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Heatmap */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-6">
            Scenario Heatmap — DCEI Scores Across All Weight Presets
          </h3>
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full" style={{ minWidth: 700 }}>
              <thead>
                <tr>
                  <th className="text-left text-xs text-slate-500 pb-3 pr-3 font-medium w-32 min-w-[120px]">City</th>
                  {WEIGHT_SCENARIOS.map(s => (
                    <th key={s.name} className="text-center text-[10px] text-slate-400 pb-3 px-1 font-medium whitespace-nowrap">
                      {s.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heatmapCities.map((city) => (
                  <tr key={city.id} className="hover:bg-white/2 transition-colors">
                    <td className="text-xs text-slate-400 py-1 pr-3 font-medium truncate max-w-[120px]">
                      {city.name}
                    </td>
                    {heatmapData.map(scenario => {
                      const scored = scenario.scores.find(c => c.id === city.id)
                      const score = scored?.DCEI_score ?? 0
                      return (
                        <td key={scenario.name} className="px-0.5 py-0.5 text-center">
                          <div
                            className="rounded text-[10px] font-mono font-semibold text-white py-0.5 px-1"
                            style={{
                              background: heatmapColor(score),
                              minWidth: 36,
                            }}
                            title={`${city.name} / ${scenario.label}: ${score.toFixed(1)}`}
                          >
                            {score.toFixed(0)}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <span className="text-xs text-slate-500">Score scale:</span>
            {[
              { label: '≤30 Low', color: 'rgba(16,185,129,0.6)' },
              { label: '≤50 Moderate', color: 'rgba(245,158,11,0.6)' },
              { label: '≤70 High', color: 'rgba(249,115,22,0.6)' },
              { label: '>70 Critical', color: 'rgba(239,68,68,0.6)' },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded" style={{ background: l.color }} />
                <span className="text-xs text-slate-500">{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
