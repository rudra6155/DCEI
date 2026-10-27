import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'

import { CITIES } from '../data/cities.js'
import { scoreAllCities, normalizeWeights, WEIGHT_SCENARIOS, DEFAULT_WEIGHTS } from '../data/scoring.js'
import { getRiskColor, formatScore, getRiskCategory } from '../utils/helpers.js'
import PageHeader from '../components/PageHeader.jsx'
import Panel from '../components/Panel.jsx'
import OptionsRow from '../components/OptionsRow.jsx'
import MenuRow from '../components/MenuRow.jsx'

const PAGE_TRANSITION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit:    { opacity: 0 },
  transition: { duration: 0.16 },
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const score = payload[0]?.value
  return (
    <div className="border border-ink bg-paper p-2 font-mono text-xs text-ink min-w-[140px]">
      <p className="font-pixel text-[10px] mb-1">{label}</p>
      <p style={{ color: getRiskColor(score) }} className="font-bold">{formatScore(score)}</p>
      <p className="text-ink-soft">{getRiskCategory(score)} Risk</p>
    </div>
  )
}

function heatmapColor(score) {
  if (score <= 30) return `rgba(74,176,232,${0.3 + score / 100})`
  if (score <= 50) return `rgba(96,200,96,${0.3 + score / 100})`
  if (score <= 70) return `rgba(244,160,32,${0.3 + score / 100})`
  return `rgba(224,56,56,${0.3 + score / 100})`
}

export default function Sensitivity() {
  const [w1, setW1] = useState(35)
  const [w2, setW2] = useState(25)
  const [w3, setW3] = useState(20)
  const [w4, setW4] = useState(20)
  const [activeScenario, setActiveScenario] = useState('default')

  const rawWeights       = { w1: w1 / 100, w2: w2 / 100, w3: w3 / 100, w4: w4 / 100 }
  const normalizedWeights = normalizeWeights(rawWeights)

  const scoredCities = useMemo(
    () => scoreAllCities(CITIES, normalizedWeights),
    [w1, w2, w3, w4]
  )

  const heatmapData = useMemo(() => WEIGHT_SCENARIOS.map(s => ({
    ...s,
    scores: scoreAllCities(CITIES, s.weights),
  })), [])

  const heatmapCities = useMemo(() => [...CITIES].sort((a, b) => a.name.localeCompare(b.name)), [])

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

  return (
    <motion.div className="page-transition min-h-dvh bg-paper" {...PAGE_TRANSITION}>
      <PageHeader title="Sensitivity Analysis" subtitle="Adjust weights · auto-normalized to sum to 1" />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

          {/* Weight controls */}
          <div className="lg:col-span-1">
            <Panel className="sticky top-12">
              <div className="px-3 py-2 border-b border-ink/20" style={{ backgroundColor: '#7D7D7D' }}>
                <p className="font-pixel text-xs text-white uppercase tracking-wider">Weight Configuration</p>
              </div>

              {/* Summary chips */}
              <div className="flex flex-wrap gap-1.5 p-3 border-b border-ink/10">
                {[
                  { label: 'WSI', val: display.w1, color: '#4AB0E8' },
                  { label: 'CII', val: display.w2, color: '#D3A9FD' },
                  { label: 'CPI', val: display.w3, color: '#60C860' },
                  { label: 'TLI', val: display.w4, color: '#F4A020' },
                ].map(({ label, val, color }) => (
                  <span
                    key={label}
                    className="font-mono text-[10px] px-2 py-0.5 border border-ink/30"
                    style={{ color }}
                  >
                    {label}: {val}%
                  </span>
                ))}
              </div>

              {/* Sliders */}
              <div className="divide-y divide-ink/10">
                {[
                  { label: 'WSI — Water Stress',     val: w1, set: setW1, glyph: 'water' },
                  { label: 'CII — Carbon Intensity',  val: w2, set: setW2, glyph: 'bolt'  },
                  { label: 'CPI — Community Pressure', val: w3, set: setW3, glyph: 'city' },
                  { label: 'TLI — Thermal Load',      val: w4, set: setW4, glyph: 'chart' },
                ].map(({ label, val, set }) => (
                  <OptionsRow key={label} label={label}>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={val}
                        onChange={e => {
                          set(Number(e.target.value))
                          setActiveScenario('custom')
                        }}
                        className="w-20"
                      />
                      <span className="font-mono text-xs text-ink w-6 text-right">{val}</span>
                    </div>
                  </OptionsRow>
                ))}
              </div>

              {/* Sum indicator */}
              <div className={`mx-3 my-2 px-2 py-1 border font-mono text-[10px] ${
                sum === 100 ? 'border-risk-moderate text-risk-moderate' : 'border-risk-high text-risk-high'
              }`}>
                Raw sum: {sum}{sum !== 100 && ' → auto-normalized'}
              </div>

              {/* Presets */}
              <div className="border-t border-ink/20">
                <p className="font-mono text-[10px] text-ink-soft uppercase tracking-widest px-3 py-2">Presets</p>
                {WEIGHT_SCENARIOS.map(scenario => (
                  <MenuRow
                    key={scenario.name}
                    active={activeScenario === scenario.name}
                    onClick={() => handlePreset(scenario)}
                  >
                    {scenario.label}
                  </MenuRow>
                ))}
              </div>
            </Panel>
          </div>

          {/* Bar chart */}
          <div className="lg:col-span-2">
            <Panel className="p-4">
              <p className="font-pixel text-xs text-ink mb-3 uppercase tracking-wider">
                All 50 Cities — Sorted by DCEI Score
              </p>
              <ResponsiveContainer width="100%" height={440}>
                <BarChart
                  data={scoredCities.map(c => ({ name: c.name, score: c.DCEI_score }))}
                  layout="vertical"
                  margin={{ left: 80, right: 30, top: 4, bottom: 4 }}
                  barSize={8}
                >
                  <CartesianGrid strokeDasharray="2 2" stroke="rgba(59,59,59,0.08)" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: '#818181', fontSize: 9, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="name" type="category" tick={{ fill: '#818181', fontSize: 9, fontFamily: 'monospace' }} axisLine={false} tickLine={false} width={76} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
                  <Bar dataKey="score" radius={[0, 0, 0, 0]}>
                    {scoredCities.map(city => (
                      <Cell key={city.id} fill={getRiskColor(city.DCEI_score)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
          </div>
        </div>

        {/* Heatmap */}
        <Panel className="overflow-hidden">
          <div className="px-4 py-2 border-b border-ink/20" style={{ backgroundColor: '#7D7D7D' }}>
            <p className="font-pixel text-xs text-white uppercase tracking-wider">
              Scenario Heatmap — DCEI Scores Across All Weight Presets
            </p>
          </div>
          <div className="overflow-x-auto p-3">
            <table className="w-full border-collapse" style={{ minWidth: 700 }}>
              <thead>
                <tr>
                  <th className="text-left font-mono text-[10px] text-ink-soft pb-2 pr-3 w-32 min-w-[120px]">City</th>
                  {WEIGHT_SCENARIOS.map(s => (
                    <th key={s.name} className="text-center font-mono text-[9px] text-ink-soft pb-2 px-0.5 whitespace-nowrap">
                      {s.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heatmapCities.map(city => (
                  <tr key={city.id}>
                    <td className="font-mono text-[10px] text-ink-soft py-0.5 pr-3 truncate max-w-[120px]">
                      {city.name}
                    </td>
                    {heatmapData.map(scenario => {
                      const scored = scenario.scores.find(c => c.id === city.id)
                      const score  = scored?.DCEI_score ?? 0
                      return (
                        <td key={scenario.name} className="px-0.5 py-0.5 text-center">
                          <div
                            className="font-mono text-[9px] py-0.5 px-0.5 text-ink"
                            style={{ background: heatmapColor(score), minWidth: 32 }}
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
          {/* Legend */}
          <div className="flex items-center gap-3 px-3 py-2 border-t border-ink/10">
            <span className="font-mono text-[10px] text-ink-soft">Scale:</span>
            {[
              { label: '≤30 Low',      color: 'rgba(74,176,232,0.6)'  },
              { label: '≤50 Moderate', color: 'rgba(96,200,96,0.6)'   },
              { label: '≤70 High',     color: 'rgba(244,160,32,0.6)'  },
              { label: '>70 Critical', color: 'rgba(224,56,56,0.6)'   },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1">
                <div className="w-3 h-3" style={{ background: l.color }} />
                <span className="font-mono text-[9px] text-ink-soft">{l.label}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </motion.div>
  )
}
