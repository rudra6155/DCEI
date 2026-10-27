import { useMemo, useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

import { CITIES } from '../data/cities.js'
import { scoreAllCities, DEFAULT_WEIGHTS } from '../data/scoring.js'
import { getRiskColor, getRiskCategory, getRiskLevel, formatScore } from '../utils/helpers.js'
import ScoreGauge from '../components/ScoreGauge.jsx'
import RiskBadge from '../components/RiskBadge.jsx'
import SubIndexBar from '../components/SubIndexBar.jsx'
import CityCard from '../components/CityCard.jsx'
import PageHeader from '../components/PageHeader.jsx'
import Panel from '../components/Panel.jsx'
import PixelGlyph from '../components/PixelGlyph.jsx'

const PAGE_TRANSITION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit:    { opacity: 0 },
  transition: { duration: 0.16 },
}

const SORT_FIELDS = [
  { key: 'DCEI_score', label: 'DCEI' },
  { key: 'WSI',        label: 'WSI'  },
  { key: 'CII',        label: 'CII'  },
  { key: 'CPI',        label: 'CPI'  },
  { key: 'TLI',        label: 'TLI'  },
  { key: 'name',       label: 'City' },
]

const RISK_LEGEND = [
  { label: 'Low (≤30)',     color: '#4AB0E8' },
  { label: 'Moderate (≤50)', color: '#60C860' },
  { label: 'High (≤70)',    color: '#F4A020' },
  { label: 'Critical (>70)', color: '#E03838' },
]

export default function Explorer() {
  const scoredCities = useMemo(() => scoreAllCities(CITIES, DEFAULT_WEIGHTS), [])

  const [selectedCity, setSelectedCity] = useState(null)
  const [sortField, setSortField]       = useState('DCEI_score')
  const [sortDir, setSortDir]           = useState('desc')
  const [searchQuery, setSearchQuery]   = useState('')
  const [suggestions, setSuggestions]   = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const detailRef = useRef(null)
  const searchRef = useRef(null)

  const tableData = useMemo(() => {
    let data = [...scoredCities]
    if (searchQuery) {
      data = data.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.state.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    data.sort((a, b) => {
      const aVal = a[sortField]
      const bVal = b[sortField]
      if (typeof aVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      }
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal
    })
    return data
  }, [scoredCities, sortField, sortDir, searchQuery])

  const handleSearch = (val) => {
    setSearchQuery(val)
    if (val.length >= 1) {
      const matches = scoredCities
        .filter(c => c.name.toLowerCase().startsWith(val.toLowerCase()))
        .slice(0, 6)
      setSuggestions(matches)
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const handleSelectSuggestion = (city) => {
    setSearchQuery(city.name)
    setShowSuggestions(false)
    setSelectedCity(city)
    setTimeout(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('desc')
    }
  }

  const handleRowClick = (city) => {
    setSelectedCity(city)
    setTimeout(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  const getMarkerRadius = (dc) => dc === 0 ? 6 : Math.min(6 + dc * 0.5, 20)

  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <motion.div className="page-transition min-h-dvh bg-paper" {...PAGE_TRANSITION}>
      <PageHeader
        title="City Explorer"
        subtitle="50 Indian cities · click any row or map marker for details"
      />

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* Search */}
        <div className="relative max-w-md" ref={searchRef}>
          <Panel className="flex items-center gap-2 px-3 py-2">
            <PixelGlyph name="filter" size={10} color="#818181" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              onFocus={() => searchQuery && setShowSuggestions(true)}
              placeholder="Search cities…"
              className="flex-1 bg-transparent font-mono text-sm text-ink placeholder-ink-soft focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setSuggestions([]); setShowSuggestions(false) }}
                className="text-ink-soft hover:text-ink transition-colors"
                aria-label="Clear search"
              >
                <PixelGlyph name="cross" size={8} color="currentColor" />
              </button>
            )}
          </Panel>
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                className="absolute top-full left-0 right-0 mt-0.5 z-30 border border-ink bg-paper"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
              >
                {suggestions.map(city => (
                  <button
                    key={city.id}
                    onClick={() => handleSelectSuggestion(city)}
                    className="w-full flex items-center justify-between px-3 py-2 font-mono text-sm text-ink hover:bg-paper-2 border-b border-ink/10 last:border-b-0 transition-colors text-left"
                  >
                    <span>
                      {city.name}
                      <span className="text-ink-soft text-xs ml-2">{city.state}</span>
                    </span>
                    <RiskBadge score={city.DCEI_score} />
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Map */}
        <Panel className="overflow-hidden" style={{ height: 480 }}>
          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={5}
            style={{ height: '100%', width: '100%' }}
            zoomControl
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            {scoredCities.map(city => (
              <CircleMarker
                key={city.id}
                center={[city.lat, city.lon]}
                radius={getMarkerRadius(city.dc_count)}
                pathOptions={{
                  fillColor:   getRiskColor(city.DCEI_score),
                  fillOpacity: selectedCity?.id === city.id ? 1 : 0.8,
                  color:       selectedCity?.id === city.id ? '#3B3B3B' : getRiskColor(city.DCEI_score),
                  weight:      selectedCity?.id === city.id ? 2 : 1,
                }}
                eventHandlers={{
                  click: () => {
                    setSelectedCity(city)
                    setTimeout(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150)
                  },
                }}
              >
                <Popup>
                  <div className="font-mono text-xs text-ink">
                    <p className="font-pixel text-sm mb-1">{city.name}</p>
                    <p className="text-ink-soft mb-1">{city.state}</p>
                    <div className="flex items-center gap-1">
                      <span>DCEI:</span>
                      <span className="font-bold" style={{ color: getRiskColor(city.DCEI_score) }}>
                        {formatScore(city.DCEI_score)}
                      </span>
                      <RiskBadge score={city.DCEI_score} />
                    </div>
                    <div className="mt-1 text-ink-soft space-y-0.5">
                      <div>WSI: {formatScore(city.WSI)} · CII: {formatScore(city.CII)}</div>
                      <div>CPI: {formatScore(city.CPI)} · TLI: {formatScore(city.TLI)}</div>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </Panel>

        {/* Map legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-ink-soft">
          <span className="uppercase tracking-wider">Risk:</span>
          {RISK_LEGEND.map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5" style={{ background: l.color }} />
              {l.label}
            </div>
          ))}
          <span className="text-ink-soft/60">· Circle size ∝ existing DC count</span>
        </div>

        {/* City detail */}
        <div ref={detailRef}>
          <AnimatePresence mode="wait">
            {selectedCity && (
              <motion.div
                key={selectedCity.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.14 }}
                className="mb-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-pixel text-sm text-ink">City Detail</p>
                  <button
                    onClick={() => setSelectedCity(null)}
                    className="flex items-center gap-1 font-mono text-xs text-ink-soft hover:text-ink transition-colors"
                    aria-label="Close detail"
                  >
                    <PixelGlyph name="cross" size={8} color="currentColor" />
                    Close
                  </button>
                </div>
                <CityCard city={selectedCity} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Rankings table */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="font-pixel text-sm text-ink">City Rankings</p>
            <span className="font-mono text-xs text-ink-soft">{tableData.length} cities</span>
          </div>
          <Panel className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="dc-table w-full min-w-[600px] border-collapse">
                <thead>
                  <tr style={{ backgroundColor: '#7D7D7D' }}>
                    <th className="font-pixel text-[10px] text-white uppercase tracking-wider px-3 py-2 text-left border border-ink/30 w-8">#</th>
                    {SORT_FIELDS.map(f => (
                      <th
                        key={f.key}
                        className="font-pixel text-[10px] text-white uppercase tracking-wider px-3 py-2 text-left border border-ink/30 cursor-pointer hover:bg-white/10 transition-colors select-none"
                        onClick={() => handleSort(f.key)}
                      >
                        <span className="flex items-center gap-1">
                          {f.label}
                          {sortField === f.key && (
                            <span style={{ color: '#5EFB90' }}>
                              {sortDir === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </span>
                      </th>
                    ))}
                    <th className="font-pixel text-[10px] text-white uppercase tracking-wider px-3 py-2 text-left border border-ink/30">Risk</th>
                    <th className="font-pixel text-[10px] text-white uppercase tracking-wider px-3 py-2 text-left border border-ink/30">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((city, i) => (
                    <tr
                      key={city.id}
                      className={`cursor-pointer transition-colors duration-120 ease-step-1 ${
                        selectedCity?.id === city.id
                          ? 'bg-select'
                          : i % 2 === 0 ? 'bg-paper hover:bg-paper-2' : 'bg-paper-2 hover:bg-paper-3'
                      }`}
                      onClick={() => handleRowClick(city)}
                    >
                      <td className="font-mono text-[10px] text-ink-soft px-3 py-1.5 border border-ink/10">{i + 1}</td>
                      <td className="font-mono text-xs text-ink font-medium px-3 py-1.5 border border-ink/10">{city.name}</td>
                      <td className="font-mono text-xs font-bold px-3 py-1.5 border border-ink/10" style={{ color: getRiskColor(city.DCEI_score) }}>
                        {formatScore(city.DCEI_score)}
                      </td>
                      <td className="font-mono text-xs px-3 py-1.5 border border-ink/10" style={{ color: getRiskColor(city.WSI) }}>
                        {formatScore(city.WSI)}
                      </td>
                      <td className="font-mono text-xs px-3 py-1.5 border border-ink/10" style={{ color: getRiskColor(city.CII) }}>
                        {formatScore(city.CII)}
                      </td>
                      <td className="font-mono text-xs px-3 py-1.5 border border-ink/10" style={{ color: getRiskColor(city.CPI) }}>
                        {formatScore(city.CPI)}
                      </td>
                      <td className="font-mono text-xs px-3 py-1.5 border border-ink/10" style={{ color: getRiskColor(city.TLI) }}>
                        {formatScore(city.TLI)}
                      </td>
                      <td className="px-3 py-1.5 border border-ink/10">
                        <RiskBadge score={city.DCEI_score} />
                      </td>
                      <td className="font-mono text-[10px] px-3 py-1.5 border border-ink/10">
                        <span className={`px-1.5 py-0.5 border ${
                          city.data_confidence === 'measured'
                            ? 'border-risk-moderate text-risk-moderate'
                            : 'border-ink-soft text-ink-soft'
                        }`}>
                          {city.data_confidence}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
          <p className="font-mono text-[10px] text-ink-soft mt-2">
            Click any row to see city detail. Sorted by DCEI score descending by default.
            Sources: CGWB 2022, CEA CO₂ Baseline v17, IMD 1991–2020, Census 2011, NASSCOM 2024.
          </p>
        </div>
      </div>
    </motion.div>
  )
}
