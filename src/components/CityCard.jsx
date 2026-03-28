import React from 'react'
import { Link } from 'react-router-dom'
import ScoreGauge from './ScoreGauge.jsx'
import RiskBadge from './RiskBadge.jsx'
import SubIndexBar from './SubIndexBar.jsx'
import { getInfraNote } from '../utils/helpers.js'

/**
 * CityCard — full city detail card.
 * Props:
 *   city: scored city object (with WSI, CII, CPI, TLI, DCEI_score, etc.)
 *   compact: boolean (optional, for smaller version)
 */
export default function CityCard({ city, compact = false }) {
  if (!city) return null

  const infraNote = getInfraNote(city.name)

  const stats = [
    { label: 'Population Density', value: `${city.population_density.toLocaleString()} /km²`, source: 'Census 2011' },
    { label: 'CGWB Category', value: city.cgwb_category, source: 'CGWB 2022' },
    { label: 'Grid Zone', value: city.grid_zone, source: 'CEA' },
    { label: 'Avg. Temperature', value: `${city.avg_temp_c}°C`, source: 'IMD Normals' },
    { label: 'Existing DCs', value: city.dc_count === 0 ? 'None known' : `${city.dc_count}`, source: 'NASSCOM 2024' },
    { label: 'State', value: city.state, source: 'GOI' },
  ]

  return (
    <div className="glass-card p-6 w-full">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">{city.name}</h2>
          <p className="text-slate-400 text-sm mt-0.5">{city.state}</p>
          <div className="mt-2">
            <RiskBadge score={city.DCEI_score} />
          </div>
        </div>
        <div className="flex-shrink-0">
          <ScoreGauge score={city.DCEI_score} size={compact ? 130 : 160} />
          <p className="text-center text-xs text-slate-500 mt-1">DCEI Score</p>
        </div>
      </div>

      {/* Sub-index bars */}
      <div className="space-y-3 mb-6">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
          Sub-Index Breakdown
        </h3>
        <SubIndexBar label="WSI — Water Stress" value={city.WSI} />
        <SubIndexBar label="CII — Carbon Intensity" value={city.CII} />
        <SubIndexBar label="CPI — Community Pressure" value={city.CPI} />
        <SubIndexBar label="TLI — Thermal Load" value={city.TLI} />
      </div>

      {/* Key stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
        {stats.map((s) => (
          <div key={s.label} className="bg-white/3 rounded-lg p-3 border border-white/5">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{s.label}</p>
            <p className="text-sm font-semibold text-white">{s.value}</p>
            <p className="text-[10px] text-slate-600 mt-0.5">src: {s.source}</p>
          </div>
        ))}
      </div>

      {/* Infrastructure note */}
      <div className="bg-blue-500/5 border border-blue-500/15 rounded-lg p-3 mb-5">
        <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
          Infrastructure Context
        </p>
        <p className="text-xs text-slate-400 leading-relaxed">{infraNote}</p>
      </div>

      {/* Data confidence */}
      <p className="text-[10px] text-slate-600 mb-4">
        Data confidence: <span className="text-slate-500 capitalize">{city.data_confidence}</span>
        {' · '}Sources: CGWB 2022, CEA CO₂ Baseline v17, IMD 1991–2020, Census 2011, NASSCOM 2024
      </p>

      {/* Action buttons */}
      {!compact && (
        <div className="flex flex-wrap gap-3">
          <Link
            to={`/compare?city=${encodeURIComponent(city.name)}`}
            className="btn-primary text-sm py-2 px-4 text-white no-underline"
          >
            Compare with another city →
          </Link>
          <Link
            to={`/alternatives?city=${encodeURIComponent(city.name)}`}
            className="btn-secondary text-sm py-2 px-4 text-slate-300 no-underline"
          >
            Find alternatives →
          </Link>
        </div>
      )}
    </div>
  )
}
