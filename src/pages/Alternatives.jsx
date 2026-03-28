import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

import { CITIES } from '../data/cities.js'
import { scoreAllCities, DEFAULT_WEIGHTS } from '../data/scoring.js'
import { getRiskColor, getRiskCategory, formatScore, haversineKm, getInfraNote } from '../utils/helpers.js'
import RiskBadge from '../components/RiskBadge.jsx'
import SubIndexBar from '../components/SubIndexBar.jsx'

const PAGE_TRANSITION = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.35 },
}

const TRADE_OFFS = {
  latency: { label: 'Network Latency', tiers: { Tier1: 'Excellent', Tier2: 'Good', Tier3: 'Moderate' } },
  workforce: { label: 'Tech Workforce', tiers: { Tier1: 'Deep pool', Tier2: 'Adequate', Tier3: 'Limited' } },
  landCost: { label: 'Land Cost Index', tiers: { Tier1: 'High (100)', Tier2: 'Medium (55–75)', Tier3: 'Low (25–45)' } },
  dcInfra: { label: 'DC Infrastructure', tiers: { Tier1: 'Mature', Tier2: 'Developing', Tier3: 'Nascent' } },
  disasterRisk: { label: 'Disaster Risk', tiers: { coastal: '⚠ Cyclone/flood', inland: '✓ Lower', hill: '✓ Very low' } },
}

function getCityTier(city) {
  if (['Mumbai', 'Chennai', 'Bengaluru', 'Hyderabad', 'Delhi', 'Kolkata'].includes(city.name)) return 'Tier1'
  if (city.dc_count >= 3) return 'Tier2'
  return 'Tier3'
}

function getDisasterProfile(city) {
  const coastalCities = ['Mumbai', 'Navi Mumbai', 'Chennai', 'Kochi', 'Visakhapatnam', 'Kolkata', 'Mangalore', 'Thiruvananthapuram', 'Bhubaneswar', 'Thane', 'Surat', 'Jamnagar']
  const hillCities = ['Dehradun', 'Chandigarh', 'Shimla']
  if (coastalCities.includes(city.name)) return 'coastal'
  if (hillCities.includes(city.name)) return 'hill'
  return 'inland'
}

function DeltaBadge({ val }) {
  if (val > 2) return <span className="text-green-400 font-mono text-sm">↓ {val.toFixed(1)}</span>
  if (val < -2) return <span className="text-red-400 font-mono text-sm">↑ {Math.abs(val).toFixed(1)}</span>
  return <span className="text-slate-400 font-mono text-sm">≈</span>
}

export default function Alternatives() {
  const scoredCities = useMemo(() => scoreAllCities(CITIES, DEFAULT_WEIGHTS), [])
  const highRiskCities = useMemo(
    () => scoredCities.filter(c => c.DCEI_score > 50).sort((a, b) => b.DCEI_score - a.DCEI_score),
    [scoredCities]
  )

  const [sourceName, setSourceName] = useState(highRiskCities[0]?.name || '')
  const [maxDist, setMaxDist] = useState(500)
  const [results, setResults] = useState([])
  const [searched, setSearched] = useState(false)

  const sourceCity = useMemo(() => scoredCities.find(c => c.name === sourceName), [scoredCities, sourceName])

  function findAlternatives() {
    if (!sourceCity) return
    const alts = scoredCities
      .filter(c => {
        if (c.name === sourceCity.name) return false
        if (c.DCEI_score >= sourceCity.DCEI_score) return false
        const dist = haversineKm(sourceCity.lat, sourceCity.lon, c.lat, c.lon)
        return dist <= maxDist
      })
      .map(c => ({
        ...c,
        distance: Math.round(haversineKm(sourceCity.lat, sourceCity.lon, c.lat, c.lon)),
      }))
      .sort((a, b) => a.DCEI_score - b.DCEI_score)
      .slice(0, 5)
    setResults(alts)
    setSearched(true)
  }

  return (
    <motion.div {...PAGE_TRANSITION} className="min-h-screen bg-[#0a0f1e] pt-20 pb-16 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            📍 <span className="bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
              Alternative Site Recommender
            </span>
          </h1>
          <p className="text-slate-400">
            Select a high-risk city and find lower-risk alternatives within your operational radius.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-[rgba(17,24,39,0.8)] border border-slate-700/50 rounded-2xl p-6 backdrop-blur-xl mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            {/* Step 1 */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                Step 1 — Source City (High / Critical)
              </label>
              <select
                value={sourceName}
                onChange={e => { setSourceName(e.target.value); setSearched(false) }}
                className="w-full bg-[#0a0f1e] border border-slate-700 rounded-lg px-3 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-sky-500"
              >
                {highRiskCities.map(c => (
                  <option key={c.id} value={c.name}>
                    {c.name} — {c.DCEI_score.toFixed(1)} ({c.risk_category})
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2 */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                Step 2 — Max Distance: <span className="text-sky-400 font-mono">{maxDist} km</span>
              </label>
              <input
                type="range" min={100} max={1000} step={50}
                value={maxDist}
                onChange={e => { setMaxDist(Number(e.target.value)); setSearched(false) }}
                className="w-full accent-sky-500"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>100 km</span><span>1000 km</span>
              </div>
            </div>

            {/* Step 3 */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                Step 3 — Find
              </label>
              <button
                onClick={findAlternatives}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Find Alternatives →
              </button>
            </div>
          </div>

          {/* Source summary */}
          {sourceCity && (
            <div className="mt-4 p-3 rounded-lg bg-[rgba(239,68,68,0.08)] border border-red-500/20 flex items-center gap-4">
              <div>
                <span className="text-xs text-slate-400">Selected source: </span>
                <span className="text-white font-semibold">{sourceCity.name}</span>
                <span className="text-slate-400 text-xs ml-2">{sourceCity.state}</span>
              </div>
              <div className="flex gap-4 ml-auto text-sm font-mono">
                <span style={{ color: sourceCity.risk_color }}>DCEI {sourceCity.DCEI_score.toFixed(1)}</span>
                <span className="text-slate-400">WSI {sourceCity.WSI}</span>
                <span className="text-slate-400">CII {sourceCity.CII}</span>
              </div>
            </div>
          )}
        </div>

        {/* Map */}
        {searched && sourceCity && (
          <div className="mb-6 rounded-2xl overflow-hidden border border-slate-700/50" style={{ height: 400 }}>
            <MapContainer
              center={[sourceCity.lat, sourceCity.lon]}
              zoom={5}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; OpenStreetMap &copy; CARTO'
              />
              {/* Source city */}
              <CircleMarker
                center={[sourceCity.lat, sourceCity.lon]}
                radius={14}
                fillColor="#ef4444"
                color="#fff"
                weight={2}
                fillOpacity={0.85}
              >
                <Popup>{sourceCity.name} — Source (DCEI {sourceCity.DCEI_score.toFixed(1)})</Popup>
              </CircleMarker>

              {/* Alternatives */}
              {results.map(alt => (
                <React.Fragment key={alt.id}>
                  <Polyline
                    positions={[[sourceCity.lat, sourceCity.lon], [alt.lat, alt.lon]]}
                    pathOptions={{ color: '#0ea5e9', weight: 1.5, dashArray: '6 4', opacity: 0.6 }}
                  />
                  <CircleMarker
                    center={[alt.lat, alt.lon]}
                    radius={10}
                    fillColor={alt.risk_color}
                    color="#fff"
                    weight={1.5}
                    fillOpacity={0.85}
                  >
                    <Popup>{alt.name} — DCEI {alt.DCEI_score.toFixed(1)} ({alt.distance} km away)</Popup>
                  </CircleMarker>
                </React.Fragment>
              ))}
            </MapContainer>
          </div>
        )}

        {/* Results */}
        {searched && results.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            No cities found within {maxDist} km with a lower DCEI score. Try increasing the search radius.
          </div>
        )}

        {searched && results.length > 0 && (
          <div className="space-y-4 mb-10">
            <h2 className="text-lg font-semibold text-white">
              Top {results.length} Alternatives for {sourceCity.name}
            </h2>
            {results.map((alt, i) => {
              const riskReduction = sourceCity.DCEI_score - alt.DCEI_score
              const pct = ((riskReduction / sourceCity.DCEI_score) * 100).toFixed(0)
              const tier = getCityTier(alt)
              const disasterProfile = getDisasterProfile(alt)

              return (
                <motion.div
                  key={alt.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-[rgba(17,24,39,0.8)] border border-slate-700/50 rounded-2xl p-5 backdrop-blur-xl"
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* Rank + name */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl font-black font-mono text-slate-500">#{i + 1}</span>
                        <div>
                          <span className="text-white font-bold text-lg">{alt.name}</span>
                          <span className="text-slate-400 text-sm ml-2">{alt.state}</span>
                        </div>
                        <RiskBadge score={alt.DCEI_score} />
                        <span className="text-slate-500 text-sm ml-auto">{alt.distance} km away</span>
                      </div>

                      {/* Score summary */}
                      <div className="flex items-center gap-6 mb-3">
                        <div>
                          <span className="text-xs text-slate-400">DCEI Score</span>
                          <div className="font-mono font-bold text-xl" style={{ color: alt.risk_color }}>
                            {alt.DCEI_score.toFixed(1)}
                          </div>
                        </div>
                        <div className="text-center">
                          <span className="text-xs text-slate-400">Risk Reduction</span>
                          <div className="font-mono font-bold text-xl text-emerald-400">
                            ↓ {riskReduction.toFixed(1)} pts ({pct}%)
                          </div>
                        </div>
                      </div>

                      {/* Sub-index deltas */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                        {[['WSI','💧'],['CII','⚡'],['CPI','👥'],['TLI','🌡️']].map(([k, icon]) => (
                          <div key={k} className="bg-[rgba(255,255,255,0.03)] rounded-lg p-2 text-center">
                            <div className="text-xs text-slate-400 mb-0.5">{icon} {k}</div>
                            <DeltaBadge val={sourceCity[k] - alt[k]} />
                          </div>
                        ))}
                      </div>

                      {/* Sub-index bars */}
                      <div className="space-y-1.5">
                        <SubIndexBar label="WSI" value={alt.WSI} />
                        <SubIndexBar label="CII" value={alt.CII} />
                        <SubIndexBar label="CPI" value={alt.CPI} />
                        <SubIndexBar label="TLI" value={alt.TLI} />
                      </div>
                    </div>

                    {/* Infra note */}
                    <div className="md:w-64 bg-[rgba(14,165,233,0.05)] border border-sky-500/20 rounded-xl p-3">
                      <div className="text-xs font-semibold text-sky-400 mb-1">Infrastructure Note</div>
                      <p className="text-xs text-slate-300 leading-relaxed">{getInfraNote(alt.name)}</p>
                      <div className="mt-2 flex gap-2">
                        <Link
                          to={`/compare?c1=${encodeURIComponent(sourceCity.name)}&c2=${encodeURIComponent(alt.name)}`}
                          className="text-xs text-sky-400 hover:text-sky-300 underline"
                        >
                          Compare →
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Trade-offs table */}
        {searched && results.length > 0 && (
          <div className="bg-[rgba(17,24,39,0.8)] border border-slate-700/50 rounded-2xl p-6 backdrop-blur-xl">
            <h2 className="text-lg font-semibold text-white mb-4">⚠️ Trade-off Considerations</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left text-slate-400 font-medium py-2 pr-4">Factor</th>
                    <th className="text-center text-red-400 font-medium py-2 px-2">{sourceCity.name}</th>
                    {results.slice(0, 3).map(a => (
                      <th key={a.id} className="text-center font-medium py-2 px-2" style={{ color: a.risk_color }}>{a.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  {[
                    {
                      label: 'Network Latency',
                      getValue: c => getCityTier(c) === 'Tier1' ? '🟢 Excellent' : getCityTier(c) === 'Tier2' ? '🟡 Good' : '🟠 Moderate',
                    },
                    {
                      label: 'Tech Workforce',
                      getValue: c => getCityTier(c) === 'Tier1' ? '🟢 Deep pool' : getCityTier(c) === 'Tier2' ? '🟡 Adequate' : '🟠 Limited',
                    },
                    {
                      label: 'Land Cost',
                      getValue: c => getCityTier(c) === 'Tier1' ? '🔴 High' : getCityTier(c) === 'Tier2' ? '🟡 Medium' : '🟢 Low',
                    },
                    {
                      label: 'DC Infrastructure',
                      getValue: c => c.dc_count >= 15 ? '🟢 Mature' : c.dc_count >= 3 ? '🟡 Developing' : '🟠 Nascent',
                    },
                    {
                      label: 'Disaster Risk',
                      getValue: c => {
                        const p = getDisasterProfile(c)
                        return p === 'coastal' ? '⚠️ Cyclone/flood' : p === 'hill' ? '🟢 Very low' : '🟢 Lower'
                      },
                    },
                    {
                      label: 'Submarine Cable',
                      getValue: c => ['Mumbai','Chennai','Kochi','Thiruvananthapuram','Visakhapatnam'].includes(c.name)
                        ? '🟢 Direct access' : c.dc_count > 5 ? '🟡 Regional access' : '🟠 Indirect',
                    },
                  ].map(row => (
                    <tr key={row.label} className="border-b border-slate-800/60">
                      <td className="py-2.5 pr-4 text-slate-400 font-medium">{row.label}</td>
                      <td className="py-2.5 px-2 text-center text-xs">{row.getValue(sourceCity)}</td>
                      {results.slice(0, 3).map(a => (
                        <td key={a.id} className="py-2.5 px-2 text-center text-xs">{row.getValue(a)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-500 mt-4">
              * DCEI measures environmental risk only. Site selection requires full techno-economic feasibility analysis.
              Network latency, talent availability, and regulatory incentives are not captured in DCEI scores.
              Source: NASSCOM 2024, TRAI, NIXI, state IT policy documents.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
