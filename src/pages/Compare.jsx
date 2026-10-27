import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts'

import { CITIES } from '../data/cities.js'
import { scoreAllCities, DEFAULT_WEIGHTS } from '../data/scoring.js'
import { getRiskColor, formatScore } from '../utils/helpers.js'
import RiskBadge from '../components/RiskBadge.jsx'
import ScoreGauge from '../components/ScoreGauge.jsx'
import SubIndexBar from '../components/SubIndexBar.jsx'
import PageHeader from '../components/PageHeader.jsx'
import Panel from '../components/Panel.jsx'
import OptionsRow from '../components/OptionsRow.jsx'
import PixelGlyph from '../components/PixelGlyph.jsx'

const PAGE_TRANSITION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit:    { opacity: 0 },
  transition: { duration: 0.16 },
}

// Colors that work on the light paper background
const CITY_COLORS = ['#03CDD7', '#D3A9FD', '#F4A020']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="border border-ink bg-paper p-2 font-mono text-xs text-ink min-w-[120px]">
      <p className="font-pixel text-[10px] mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: <span className="font-bold">{typeof p.value === 'number' ? p.value.toFixed(1) : p.value}</span>
        </p>
      ))}
    </div>
  )
}

export default function Compare() {
  const [searchParams]  = useSearchParams()
  const scoredCities    = useMemo(() => scoreAllCities(CITIES, DEFAULT_WEIGHTS), [])
  const cityNames       = useMemo(() => scoredCities.map(c => c.name).sort(), [scoredCities])

  const [city1Name, setCity1Name] = useState(
    searchParams.get('c1') || searchParams.get('city') || 'Mumbai'
  )
  const [city2Name, setCity2Name] = useState(searchParams.get('c2') || 'Bengaluru')
  const [city3Name, setCity3Name] = useState('None')

  const findCity = (name) => scoredCities.find(c => c.name === name)

  const cities = useMemo(() => {
    const result = [findCity(city1Name), findCity(city2Name)]
    if (city3Name !== 'None') result.push(findCity(city3Name))
    return result.filter(Boolean)
  }, [city1Name, city2Name, city3Name, scoredCities])

  const radarData = [
    { subject: 'WSI' }, { subject: 'CII' }, { subject: 'CPI' },
    { subject: 'TLI' }, { subject: 'DCEI' },
  ].map(item => {
    const obj = { ...item, fullMark: 100 }
    cities.forEach((c, i) => {
      obj[`v${i + 1}`] = c[item.subject === 'DCEI' ? 'DCEI_score' : item.subject]
    })
    return obj
  })

  const barData = ['WSI', 'CII', 'CPI', 'TLI'].map(key => {
    const obj = { name: key }
    cities.forEach((c, i) => { obj[`city${i + 1}`] = c[key] })
    return obj
  })

  const insight = useMemo(() => {
    if (cities.length < 2) return ''
    const sorted = [...cities].sort((a, b) => b.DCEI_score - a.DCEI_score)
    const worst = sorted[0]
    const best  = sorted[sorted.length - 1]
    const diff  = worst.DCEI_score - best.DCEI_score
    const pct   = ((diff / worst.DCEI_score) * 100).toFixed(1)
    const drivers = ['WSI', 'CII', 'CPI', 'TLI']
    const biggestDelta = drivers.reduce((max, d) => {
      const delta = Math.abs(worst[d] - best[d])
      return delta > max.delta ? { key: d, delta } : max
    }, { key: 'WSI', delta: 0 })
    const driverNames = { WSI: 'water stress', CII: 'carbon intensity', CPI: 'community pressure', TLI: 'thermal load' }
    return `Switching from ${worst.name} to ${best.name} reduces environmental risk by ${diff.toFixed(1)} points (${pct}%), primarily driven by lower ${driverNames[biggestDelta.key]} (Δ${biggestDelta.delta.toFixed(1)}).`
  }, [cities])

  const PARAMS = [
    { label: 'DCEI Score',           key: 'DCEI_score',            better: 'lower' },
    { label: 'WSI',                   key: 'WSI',                   better: 'lower' },
    { label: 'CII',                   key: 'CII',                   better: 'lower' },
    { label: 'CPI',                   key: 'CPI',                   better: 'lower' },
    { label: 'TLI',                   key: 'TLI',                   better: 'lower' },
    { label: 'CGWB Category',         key: 'cgwb_category',         better: null    },
    { label: 'Grid Zone',             key: 'grid_zone',             better: null    },
    { label: 'Avg Temp (°C)',         key: 'avg_temp_c',            better: 'lower' },
    { label: 'Wet Bulb (°C)',         key: 'wet_bulb_temp_c',       better: 'lower' },
    { label: 'Humidity (%)',          key: 'relative_humidity_pct', better: 'lower' },
    { label: 'Population Density',    key: 'population_density',    better: 'lower' },
    { label: 'Existing DCs',          key: 'dc_count',              better: 'lower' },
    { label: 'Per Capita Water (lpd)', key: 'per_capita_water_lpd', better: 'higher' },
    { label: 'Renewable %',           key: 'renewable_pct',         better: 'higher' },
    { label: 'Risk Category',         key: 'risk_category',         better: null    },
    { label: 'Data Confidence',       key: 'data_confidence',       better: null    },
  ]

  const getBestIdx = (param) => {
    if (!param.better || cities.length < 2) return -1
    let bestIdx = 0
    cities.forEach((c, i) => {
      const v = c[param.key]; const bv = cities[bestIdx][param.key]
      if (typeof v === 'number' && typeof bv === 'number') {
        if (param.better === 'lower'  && v < bv) bestIdx = i
        if (param.better === 'higher' && v > bv) bestIdx = i
      }
    })
    return bestIdx
  }

  const selectCls = 'w-full bg-paper border border-ink font-mono text-xs text-ink px-2 py-1.5 focus:outline-none focus:border-cube'

  return (
    <motion.div className="page-transition min-h-dvh bg-paper" {...PAGE_TRANSITION}>
      <PageHeader title="City Comparison" subtitle="Up to 3 cities side-by-side" />

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* City selectors */}
        <Panel className="p-0 overflow-hidden">
          <OptionsRow label="City 1">
            <select value={city1Name} onChange={e => setCity1Name(e.target.value)} className={selectCls}>
              {cityNames.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </OptionsRow>
          <OptionsRow label="City 2">
            <select value={city2Name} onChange={e => setCity2Name(e.target.value)} className={selectCls}>
              {cityNames.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </OptionsRow>
          <OptionsRow label="City 3 (optional)">
            <select value={city3Name} onChange={e => setCity3Name(e.target.value)} className={selectCls}>
              <option value="None">— None —</option>
              {cityNames.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </OptionsRow>
        </Panel>

        {/* Score cards */}
        <div className={`grid gap-4 ${cities.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
          {cities.map((city, i) => (
            <Panel key={city.id} className="p-4 text-center">
              <div className="flex justify-center mb-2">
                <ScoreGauge score={city.DCEI_score} size={130} />
              </div>
              <p className="font-pixel text-sm text-ink">{city.name}</p>
              <p className="font-mono text-xs text-ink-soft mb-2">{city.state}</p>
              <RiskBadge score={city.DCEI_score} />
              <div className="mt-3 space-y-2">
                <SubIndexBar label="WSI" value={city.WSI} />
                <SubIndexBar label="CII" value={city.CII} />
                <SubIndexBar label="CPI" value={city.CPI} />
                <SubIndexBar label="TLI" value={city.TLI} />
              </div>
            </Panel>
          ))}
        </div>

        {/* Insight */}
        {insight && (
          <Panel className="p-4">
            <div className="flex items-start gap-3">
              <PixelGlyph name="info" size={12} color="#3B3B3B" className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-mono text-[10px] text-ink-soft uppercase tracking-widest mb-1">Insight</p>
                <p className="font-mono text-xs text-ink leading-relaxed">{insight}</p>
              </div>
            </div>
          </Panel>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Panel className="p-4">
            <p className="font-pixel text-xs text-ink mb-3 uppercase tracking-wider">Radar Comparison</p>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(59,59,59,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#818181', fontSize: 10, fontFamily: 'monospace' }} />
                {cities.map((city, i) => (
                  <Radar
                    key={city.id}
                    name={city.name}
                    dataKey={`v${i + 1}`}
                    stroke={CITY_COLORS[i]}
                    fill={CITY_COLORS[i]}
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                ))}
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={(v) => <span style={{ color: '#3B3B3B', fontSize: 10, fontFamily: 'monospace' }}>{v}</span>}
                />
              </RadarChart>
            </ResponsiveContainer>
          </Panel>

          <Panel className="p-4">
            <p className="font-pixel text-xs text-ink mb-3 uppercase tracking-wider">Sub-Index Comparison</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData} barGap={2}>
                <CartesianGrid strokeDasharray="2 2" stroke="rgba(59,59,59,0.1)" />
                <XAxis dataKey="name" tick={{ fill: '#818181', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: '#818181', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
                <Legend formatter={(v) => <span style={{ color: '#3B3B3B', fontSize: 10, fontFamily: 'monospace' }}>{v}</span>} />
                {cities.map((city, i) => (
                  <Bar key={city.id} dataKey={`city${i + 1}`} name={city.name} fill={CITY_COLORS[i]} radius={[0,0,0,0]} maxBarSize={24} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </Panel>
        </div>

        {/* Parameter table */}
        <Panel className="overflow-hidden">
          <div className="px-4 py-2 border-b border-ink/20" style={{ backgroundColor: '#7D7D7D' }}>
            <p className="font-pixel text-xs text-white uppercase tracking-wider">Detailed Parameter Comparison</p>
          </div>
          <div className="overflow-x-auto">
            <table className="dc-table w-full min-w-[500px] border-collapse">
              <thead>
                <tr className="bg-paper-2">
                  <th className="font-mono text-[10px] text-ink-soft uppercase tracking-wider px-3 py-2 text-left border border-ink/20">Parameter</th>
                  {cities.map((city, i) => (
                    <th key={city.id} className="font-pixel text-[10px] uppercase px-3 py-2 text-left border border-ink/20" style={{ color: CITY_COLORS[i] }}>
                      {city.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PARAMS.map((param, pi) => {
                  const bestIdx = getBestIdx(param)
                  return (
                    <tr key={param.key} className={pi % 2 === 0 ? 'bg-paper' : 'bg-paper-2'}>
                      <td className="font-mono text-xs text-ink-soft px-3 py-1.5 border border-ink/10">{param.label}</td>
                      {cities.map((city, i) => {
                        const val = city[param.key]
                        const isNum  = typeof val === 'number'
                        const isBest = bestIdx === i && param.better !== null
                        return (
                          <td
                            key={city.id}
                            className={`font-mono text-xs px-3 py-1.5 border border-ink/10 ${
                              isBest ? 'font-bold' : ''
                            }`}
                            style={{ color: isBest ? '#60C860' : '#3B3B3B' }}
                          >
                            {isBest && <span className="mr-1">✓</span>}
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
          <div className="px-4 py-2 border-t border-ink/20">
            <p className="font-mono text-[10px] text-ink-soft">
              ✓ Best value among selected cities. Lower DCEI = better suitability. Data: CGWB 2022, CEA, IMD, Census 2011, NASSCOM 2024.
            </p>
          </div>
        </Panel>
      </div>
    </motion.div>
  )
}
