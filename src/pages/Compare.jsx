import React, { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, Cell,
} from 'recharts'

import { CITIES } from '../data/cities.js'
import { scoreAllCities, DEFAULT_WEIGHTS } from '../data/scoring.js'
import { getRiskColor, getRiskCategory, formatScore } from '../utils/helpers.js'
import RiskBadge from '../components/RiskBadge.jsx'
import ScoreGauge from '../components/ScoreGauge.jsx'
import SubIndexBar from '../components/SubIndexBar.jsx'

const PAGE_TRANSITION = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.35 },
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-dark rounded-xl p-3 border border-white/10 text-sm">
      <p className="text-white font-semibold mb-2">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: p.color }} />
          {p.name}: <span className="font-bold ml-1">{typeof p.value === 'number' ? p.value.toFixed(1) : p.value}</span>
        </p>
      ))}
    </div>
  )
}

const CITY_COLORS = ['#60a5fa', '#a78bfa', '#34d399']

export default function Compare() {
  const [searchParams] = useSearchParams()
  const scoredCities = useMemo(() => scoreAllCities(CITIES, DEFAULT_WEIGHTS), [])
  const cityNames = useMemo(() => scoredCities.map(c => c.name).sort(), [scoredCities])

  const initialCity = searchParams.get('city') || ''
  const [city1Name, setCity1Name] = useState(initialCity || 'Mumbai')
  const [city2Name, setCity2Name] = useState('Bengaluru')
  const [city3Name, setCity3Name] = useState('None')

  const findCity = (name) => scoredCities.find(c => c.name === name)

  const cities = useMemo(() => {
    const result = [findCity(city1Name), findCity(city2Name)]
    if (city3Name !== 'None') result.push(findCity(city3Name))
    return result.filter(Boolean)
  }, [city1Name, city2Name, city3Name, scoredCities])

  // Radar data
  const radarData = [
    { subject: 'WSI', fullMark: 100 },
    { subject: 'CII', fullMark: 100 },
    { subject: 'CPI', fullMark: 100 },
    { subject: 'TLI', fullMark: 100 },
    { subject: 'DCEI', fullMark: 100 },
  ].map(item => {
    const obj = { ...item }
    cities.forEach((c, i) => { obj[`v${i + 1}`] = c[item.subject === 'DCEI' ? 'DCEI_score' : item.subject] })
    return obj
  })

  // Bar data
  const barData = ['WSI', 'CII', 'CPI', 'TLI'].map(key => {
    const obj = { name: key }
    cities.forEach((c, i) => { obj[`city${i + 1}`] = c[key] })
    return obj
  })

  // Insight generation
  const insight = useMemo(() => {
    if (cities.length < 2) return ''
    const sorted = [...cities].sort((a, b) => b.DCEI_score - a.DCEI_score)
    const worst = sorted[0]
    const best = sorted[sorted.length - 1]
    const diff = worst.DCEI_score - best.DCEI_score
    const pct = ((diff / worst.DCEI_score) * 100).toFixed(1)
    // Find dominant driver
    const drivers = ['WSI', 'CII', 'CPI', 'TLI']
    const biggestDelta = drivers.reduce((max, d) => {
      const delta = Math.abs(worst[d] - best[d])
      return delta > max.delta ? { key: d, delta } : max
    }, { key: 'WSI', delta: 0 })
    const driverNames = { WSI: 'water stress', CII: 'carbon intensity', CPI: 'community pressure', TLI: 'thermal load' }
    return `Switching from ${worst.name} to ${best.name} reduces environmental risk by ${diff.toFixed(1)} points (${pct}%), primarily driven by lower ${driverNames[biggestDelta.key]} (Δ${biggestDelta.delta.toFixed(1)}).`
  }, [cities])

  // Parameter comparison table
  const PARAMS = [
    { label: 'DCEI Score', key: 'DCEI_score', better: 'lower' },
    { label: 'WSI', key: 'WSI', better: 'lower' },
    { label: 'CII', key: 'CII', better: 'lower' },
    { label: 'CPI', key: 'CPI', better: 'lower' },
    { label: 'TLI', key: 'TLI', better: 'lower' },
    { label: 'CGWB Category', key: 'cgwb_category', better: null },
    { label: 'Grid Zone', key: 'grid_zone', better: null },
    { label: 'Avg Temp (°C)', key: 'avg_temp_c', better: 'lower' },
    { label: 'Wet Bulb (°C)', key: 'wet_bulb_temp_c', better: 'lower' },
    { label: 'Humidity (%)', key: 'relative_humidity_pct', better: 'lower' },
    { label: 'Population Density', key: 'population_density', better: 'lower' },
    { label: 'Existing DCs', key: 'dc_count', better: 'lower' },
    { label: 'Per Capita Water (lpd)', key: 'per_capita_water_lpd', better: 'higher' },
    { label: 'Renewable %', key: 'renewable_pct', better: 'higher' },
    { label: 'Risk Category', key: 'risk_category', better: null },
    { label: 'Data Confidence', key: 'data_confidence', better: null },
  ]

  const getBestIdx = (param) => {
    if (!param.better || cities.length < 2) return -1
    let bestIdx = 0
    cities.forEach((c, i) => {
      const v = c[param.key]
      const bv = cities[bestIdx][param.key]
      if (typeof v === 'number' && typeof bv === 'number') {
        if (param.better === 'lower' && v < bv) bestIdx = i
        if (param.better === 'higher' && v > bv) bestIdx = i
      }
    })
    return bestIdx
  }

  const selectStyle = "w-full bg-slate-800/80 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-colors pr-8"

  return (
    <motion.div className="page-transition pt-20 pb-12 min-h-screen" {...PAGE_TRANSITION}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">City Comparison</h1>
          <p className="text-slate-400">Compare environmental suitability scores side-by-side for up to 3 cities.</p>
        </div>

        {/* City selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div>
            <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">City 1</label>
            <select value={city1Name} onChange={e => setCity1Name(e.target.value)} className={selectStyle}>
              {cityNames.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">City 2</label>
            <select value={city2Name} onChange={e => setCity2Name(e.target.value)} className={selectStyle}>
              {cityNames.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">City 3 (optional)</label>
            <select value={city3Name} onChange={e => setCity3Name(e.target.value)} className={selectStyle}>
              <option value="None">— None —</option>
              {cityNames.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>

        {/* Score cards row */}
        <div className={`grid gap-6 mb-8 ${cities.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
          {cities.map((city, i) => (
            <motion.div
              key={city.id}
              className="glass-card p-5 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex justify-center mb-2">
                <ScoreGauge score={city.DCEI_score} size={130} />
              </div>
              <h3 className="text-lg font-bold text-white">{city.name}</h3>
              <p className="text-xs text-slate-500 mb-2">{city.state}</p>
              <RiskBadge score={city.DCEI_score} />
              <div className="mt-4 space-y-2">
                <SubIndexBar label="WSI" value={city.WSI} />
                <SubIndexBar label="CII" value={city.CII} />
                <SubIndexBar label="CPI" value={city.CPI} />
                <SubIndexBar label="TLI" value={city.TLI} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Insight */}
        {insight && (
          <motion.div
            className="glass-card p-5 mb-8 border border-blue-500/15 bg-blue-500/5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-start gap-3">
              <span className="text-blue-400 text-xl mt-0.5">💡</span>
              <div>
                <p className="text-xs text-blue-400 font-semibold uppercase tracking-wider mb-1">AI-Generated Insight</p>
                <p className="text-sm text-slate-200 leading-relaxed">{insight}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Radar */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">Radar Comparison</h3>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                {cities.map((city, i) => (
                  <Radar
                    key={city.id}
                    name={city.name}
                    dataKey={`v${i + 1}`}
                    stroke={CITY_COLORS[i]}
                    fill={CITY_COLORS[i]}
                    fillOpacity={0.12}
                    strokeWidth={2}
                  />
                ))}
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={(value) => <span style={{ color: '#94a3b8', fontSize: 12 }}>{value}</span>}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Grouped bar */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">Sub-Index Comparison</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Legend formatter={(v) => <span style={{ color: '#94a3b8', fontSize: 12 }}>{v}</span>} />
                {cities.map((city, i) => (
                  <Bar key={city.id} dataKey={`city${i + 1}`} name={city.name} fill={CITY_COLORS[i]} radius={[3, 3, 0, 0]} maxBarSize={28} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed parameter table */}
        <div className="glass-dark rounded-2xl border border-white/5 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Detailed Parameter Comparison</h3>
          </div>
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr>
                  <th className="table-header">Parameter</th>
                  {cities.map((city, i) => (
                    <th key={city.id} className="table-header" style={{ color: CITY_COLORS[i] }}>
                      {city.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PARAMS.map((param, pi) => {
                  const bestIdx = getBestIdx(param)
                  return (
                    <tr key={param.key} className={`table-row ${pi % 2 === 0 ? '' : 'bg-white/1'}`}>
                      <td className="table-cell font-medium text-slate-300">{param.label}</td>
                      {cities.map((city, i) => {
                        const val = city[param.key]
                        const isNum = typeof val === 'number'
                        const isBest = bestIdx === i && param.better !== null
                        return (
                          <td
                            key={city.id}
                            className={`table-cell font-mono ${isBest ? 'text-emerald-400 font-bold' : 'text-slate-300'}`}
                          >
                            {isBest && <span className="text-emerald-500 mr-1">✓</span>}
                            {isNum ? formatScore(val) : val}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-white/5">
            <p className="text-xs text-slate-600">
              ✓ Green = best value among selected cities. Lower DCEI = better suitability. Data sources: CGWB 2022, CEA, IMD, Census 2011, NASSCOM 2024.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
