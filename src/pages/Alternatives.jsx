import { useMemo, useState, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

import { CITIES } from '../data/cities.js'
import { scoreAllCities, DEFAULT_WEIGHTS } from '../data/scoring.js'
import { getRiskColor, formatScore, haversineKm, getInfraNote } from '../utils/helpers.js'
import RiskBadge from '../components/RiskBadge.jsx'
import SubIndexBar from '../components/SubIndexBar.jsx'
import PageHeader from '../components/PageHeader.jsx'
import Panel from '../components/Panel.jsx'
import OptionsRow from '../components/OptionsRow.jsx'
import DashedBtn from '../components/DashedBtn.jsx'
import PixelGlyph from '../components/PixelGlyph.jsx'

const PAGE_TRANSITION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit:    { opacity: 0 },
  transition: { duration: 0.16 },
}

function getCityTier(city) {
  if (['Mumbai', 'Chennai', 'Bengaluru', 'Hyderabad', 'Delhi', 'Kolkata'].includes(city.name)) return 'Tier1'
  if (city.dc_count >= 3) return 'Tier2'
  return 'Tier3'
}

function getDisasterProfile(city) {
  const coastal = ['Mumbai', 'Navi Mumbai', 'Chennai', 'Kochi', 'Visakhapatnam', 'Kolkata', 'Mangalore', 'Thiruvananthapuram', 'Bhubaneswar', 'Thane', 'Surat', 'Jamnagar']
  const hill    = ['Dehradun', 'Chandigarh', 'Shimla']
  if (coastal.includes(city.name)) return 'coastal'
  if (hill.includes(city.name))    return 'hill'
  return 'inland'
}

function DeltaBadge({ val }) {
  if (val > 2)  return <span className="font-mono text-xs" style={{ color: '#60C860' }}>↓ {val.toFixed(1)}</span>
  if (val < -2) return <span className="font-mono text-xs" style={{ color: '#E03838' }}>↑ {Math.abs(val).toFixed(1)}</span>
  return <span className="font-mono text-xs text-ink-soft">≈</span>
}

const selectCls = 'w-full bg-paper border border-ink font-mono text-xs text-ink px-2 py-1.5 focus:outline-none focus:border-cube'

export default function Alternatives() {
  const scoredCities = useMemo(() => scoreAllCities(CITIES, DEFAULT_WEIGHTS), [])
  const highRiskCities = useMemo(
    () => scoredCities.filter(c => c.DCEI_score > 50).sort((a, b) => b.DCEI_score - a.DCEI_score),
    [scoredCities]
  )

  const [sourceName, setSourceName] = useState(highRiskCities[0]?.name || '')
  const [maxDist, setMaxDist]       = useState(500)
  const [results, setResults]       = useState([])
  const [searched, setSearched]     = useState(false)

  const sourceCity = useMemo(() => scoredCities.find(c => c.name === sourceName), [scoredCities, sourceName])

  function findAlternatives() {
    if (!sourceCity) return
    const alts = scoredCities
      .filter(c => {
        if (c.name === sourceCity.name) return false
        if (c.DCEI_score >= sourceCity.DCEI_score) return false
        return haversineKm(sourceCity.lat, sourceCity.lon, c.lat, c.lon) <= maxDist
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

  const TRADE_ROWS = [
    { label: 'Network Latency',  getValue: c => getCityTier(c) === 'Tier1' ? 'Excellent' : getCityTier(c) === 'Tier2' ? 'Good' : 'Moderate' },
    { label: 'Tech Workforce',   getValue: c => getCityTier(c) === 'Tier1' ? 'Deep pool' : getCityTier(c) === 'Tier2' ? 'Adequate' : 'Limited' },
    { label: 'Land Cost',        getValue: c => getCityTier(c) === 'Tier1' ? 'High'      : getCityTier(c) === 'Tier2' ? 'Medium' : 'Low' },
    { label: 'DC Infrastructure', getValue: c => c.dc_count >= 15 ? 'Mature'             : c.dc_count >= 3 ? 'Developing' : 'Nascent' },
    { label: 'Disaster Risk',    getValue: c => { const p = getDisasterProfile(c); return p === 'coastal' ? 'Cyclone/flood' : p === 'hill' ? 'Very low' : 'Lower' } },
    { label: 'Submarine Cable',  getValue: c => ['Mumbai','Chennai','Kochi','Thiruvananthapuram','Visakhapatnam'].includes(c.name) ? 'Direct' : c.dc_count > 5 ? 'Regional' : 'Indirect' },
  ]

  return (
    <motion.div className="page-transition min-h-dvh bg-paper" {...PAGE_TRANSITION}>
      <PageHeader title="Alternative Site Recommender" subtitle="Find lower-risk cities within your operational radius" />

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* Controls */}
        <Panel>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-ink/20">
            <div className="p-4">
              <p className="font-mono text-[10px] text-ink-soft uppercase tracking-widest mb-2">Step 1 — Source City</p>
              <select
                value={sourceName}
                onChange={e => { setSourceName(e.target.value); setSearched(false) }}
                className={selectCls}
              >
                {highRiskCities.map(c => (
                  <option key={c.id} value={c.name}>
                    {c.name} — {c.DCEI_score.toFixed(1)} ({c.risk_category})
                  </option>
                ))}
              </select>
            </div>
            <div className="p-4">
              <p className="font-mono text-[10px] text-ink-soft uppercase tracking-widest mb-2">
                Step 2 — Max Distance: <span className="text-ink font-bold">{maxDist} km</span>
              </p>
              <input
                type="range" min={100} max={1000} step={50}
                value={maxDist}
                onChange={e => { setMaxDist(Number(e.target.value)); setSearched(false) }}
                className="w-full"
              />
              <div className="flex justify-between font-mono text-[9px] text-ink-soft mt-1">
                <span>100 km</span><span>1000 km</span>
              </div>
            </div>
            <div className="p-4 flex flex-col justify-end">
              <p className="font-mono text-[10px] text-ink-soft uppercase tracking-widest mb-2">Step 3</p>
              <DashedBtn variant="lavender" onClick={findAlternatives} className="w-full justify-center">
                Find Alternatives
              </DashedBtn>
            </div>
          </div>

          {/* Source summary */}
          {sourceCity && (
            <div className="border-t border-ink/20 px-4 py-2 flex flex-wrap items-center gap-4 bg-paper-2">
              <span className="font-mono text-xs text-ink-soft">Source:</span>
              <span className="font-pixel text-sm text-ink">{sourceCity.name}</span>
              <span className="font-mono text-xs text-ink-soft">{sourceCity.state}</span>
              <RiskBadge score={sourceCity.DCEI_score} />
              <div className="flex gap-3 ml-auto font-mono text-xs text-ink-soft">
                <span style={{ color: getRiskColor(sourceCity.DCEI_score) }}>DCEI {sourceCity.DCEI_score.toFixed(1)}</span>
                <span>WSI {sourceCity.WSI?.toFixed(1)}</span>
                <span>CII {sourceCity.CII?.toFixed(1)}</span>
              </div>
            </div>
          )}
        </Panel>

        {/* Map */}
        {searched && sourceCity && (
          <Panel className="overflow-hidden" style={{ height: 400 }}>
            <MapContainer center={[sourceCity.lat, sourceCity.lon]} zoom={5} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              <CircleMarker
                center={[sourceCity.lat, sourceCity.lon]}
                radius={14}
                fillColor="#E03838"
                color="#3B3B3B"
                weight={2}
                fillOpacity={0.85}
              >
                <Popup>
                  <span className="font-mono text-xs">{sourceCity.name} — Source (DCEI {sourceCity.DCEI_score.toFixed(1)})</span>
                </Popup>
              </CircleMarker>
              {results.map(alt => (
                <Fragment key={alt.id}>
                  <Polyline
                    positions={[[sourceCity.lat, sourceCity.lon], [alt.lat, alt.lon]]}
                    pathOptions={{ color: '#9D55FF', weight: 1.5, dashArray: '6 4', opacity: 0.7 }}
                  />
                  <CircleMarker
                    center={[alt.lat, alt.lon]}
                    radius={10}
                    fillColor={getRiskColor(alt.DCEI_score)}
                    color="#3B3B3B"
                    weight={1.5}
                    fillOpacity={0.85}
                  >
                    <Popup>
                      <span className="font-mono text-xs">{alt.name} — DCEI {alt.DCEI_score.toFixed(1)} ({alt.distance} km away)</span>
                    </Popup>
                  </CircleMarker>
                </Fragment>
              ))}
            </MapContainer>
          </Panel>
        )}

        {/* No results */}
        {searched && results.length === 0 && (
          <Panel className="p-6 text-center">
            <p className="font-mono text-sm text-ink-soft">
              No cities found within {maxDist} km with a lower DCEI score. Try increasing the search radius.
            </p>
          </Panel>
        )}

        {/* Results */}
        {searched && results.length > 0 && (
          <div className="space-y-4">
            <p className="font-pixel text-sm text-ink">
              Top {results.length} Alternatives for {sourceCity?.name}
            </p>
            {results.map((alt, i) => {
              const riskReduction = (sourceCity?.DCEI_score ?? 0) - alt.DCEI_score
              const pct = sourceCity ? ((riskReduction / sourceCity.DCEI_score) * 100).toFixed(0) : 0

              return (
                <Panel key={alt.id} className="p-4">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="font-pixel text-lg text-ink-soft">#{i + 1}</span>
                        <div>
                          <span className="font-pixel text-sm text-ink">{alt.name}</span>
                          <span className="font-mono text-xs text-ink-soft ml-2">{alt.state}</span>
                        </div>
                        <RiskBadge score={alt.DCEI_score} />
                        <span className="font-mono text-xs text-ink-soft ml-auto">{alt.distance} km</span>
                      </div>

                      {/* Score + reduction */}
                      <div className="flex items-center gap-6 mb-3">
                        <div>
                          <p className="font-mono text-[10px] text-ink-soft">DCEI Score</p>
                          <p className="font-pixel text-xl" style={{ color: getRiskColor(alt.DCEI_score) }}>
                            {alt.DCEI_score.toFixed(1)}
                          </p>
                        </div>
                        <div>
                          <p className="font-mono text-[10px] text-ink-soft">Risk Reduction</p>
                          <p className="font-pixel text-xl" style={{ color: '#60C860' }}>
                            ↓ {riskReduction.toFixed(1)} ({pct}%)
                          </p>
                        </div>
                      </div>

                      {/* Sub-index deltas */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                        {['WSI', 'CII', 'CPI', 'TLI'].map(k => (
                          <Panel key={k} inset className="p-2 text-center">
                            <p className="font-mono text-[10px] text-ink-soft mb-0.5">{k}</p>
                            <DeltaBadge val={(sourceCity?.[k] ?? 0) - alt[k]} />
                          </Panel>
                        ))}
                      </div>

                      <div className="space-y-1.5">
                        <SubIndexBar label="WSI" value={alt.WSI} />
                        <SubIndexBar label="CII" value={alt.CII} />
                        <SubIndexBar label="CPI" value={alt.CPI} />
                        <SubIndexBar label="TLI" value={alt.TLI} />
                      </div>
                    </div>

                    {/* Infra note */}
                    <Panel inset className="md:w-64 p-3 flex-shrink-0">
                      <p className="font-mono text-[10px] text-ink-soft uppercase tracking-widest mb-1">Infrastructure</p>
                      <p className="font-mono text-xs text-ink leading-relaxed">{getInfraNote(alt.name)}</p>
                      <div className="mt-2">
                        <Link
                          to={`/compare?c1=${encodeURIComponent(sourceCity?.name ?? '')}&c2=${encodeURIComponent(alt.name)}`}
                          className="no-underline"
                        >
                          <DashedBtn variant="lavender" className="text-[10px] py-0.5">Compare →</DashedBtn>
                        </Link>
                      </div>
                    </Panel>
                  </div>
                </Panel>
              )
            })}
          </div>
        )}

        {/* Trade-off table */}
        {searched && results.length > 0 && (
          <Panel className="overflow-hidden">
            <div className="px-4 py-2 border-b border-ink/20" style={{ backgroundColor: '#7D7D7D' }}>
              <p className="font-pixel text-xs text-white uppercase tracking-wider">Trade-off Considerations</p>
            </div>
            <div className="overflow-x-auto">
              <table className="dc-table w-full border-collapse" style={{ minWidth: 500 }}>
                <thead>
                  <tr className="bg-paper-2">
                    <th className="font-mono text-[10px] text-ink-soft uppercase px-3 py-2 text-left border border-ink/20">Factor</th>
                    <th className="font-pixel text-[10px] px-3 py-2 text-left border border-ink/20" style={{ color: '#E03838' }}>
                      {sourceCity?.name}
                    </th>
                    {results.slice(0, 3).map(a => (
                      <th key={a.id} className="font-pixel text-[10px] px-3 py-2 text-left border border-ink/20" style={{ color: getRiskColor(a.DCEI_score) }}>
                        {a.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TRADE_ROWS.map((row, ri) => (
                    <tr key={row.label} className={ri % 2 === 0 ? 'bg-paper' : 'bg-paper-2'}>
                      <td className="font-mono text-xs text-ink-soft px-3 py-1.5 border border-ink/10">{row.label}</td>
                      <td className="font-mono text-xs text-ink px-3 py-1.5 border border-ink/10">
                        {sourceCity ? row.getValue(sourceCity) : '—'}
                      </td>
                      {results.slice(0, 3).map(a => (
                        <td key={a.id} className="font-mono text-xs text-ink px-3 py-1.5 border border-ink/10">
                          {row.getValue(a)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="font-mono text-[10px] text-ink-soft px-4 py-2 border-t border-ink/10">
              DCEI measures environmental risk only. Site selection requires full techno-economic feasibility analysis.
              Source: NASSCOM 2024, TRAI, NIXI, state IT policy documents.
            </p>
          </Panel>
        )}
      </div>
    </motion.div>
  )
}
