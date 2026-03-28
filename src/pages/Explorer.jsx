import React, { useMemo, useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

import { CITIES } from '../data/cities.js'
import { scoreAllCities, DEFAULT_WEIGHTS } from '../data/scoring.js'
import { getRiskColor, getRiskCategory, formatScore } from '../utils/helpers.js'
import ScoreGauge from '../components/ScoreGauge.jsx'
import RiskBadge from '../components/RiskBadge.jsx'
import SubIndexBar from '../components/SubIndexBar.jsx'
import CityCard from '../components/CityCard.jsx'

const PAGE_TRANSITION = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.35 },
}

const SORT_FIELDS = [
  { key: 'DCEI_score', label: 'DCEI' },
  { key: 'WSI', label: 'WSI' },
  { key: 'CII', label: 'CII' },
  { key: 'CPI', label: 'CPI' },
  { key: 'TLI', label: 'TLI' },
  { key: 'name', label: 'City' },
]

export default function Explorer() {
  const scoredCities = useMemo(() => scoreAllCities(CITIES, DEFAULT_WEIGHTS), [])

  const [selectedCity, setSelectedCity] = useState(null)
  const [sortField, setSortField] = useState('DCEI_score')
  const [sortDir, setSortDir] = useState('desc')
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const detailRef = useRef(null)
  const searchRef = useRef(null)

  // Sorted + filtered table data
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
      const matches = scoredCities.filter(c =>
        c.name.toLowerCase().startsWith(val.toLowerCase())
      ).slice(0, 6)
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

  const getMarkerRadius = (dc) => {
    if (dc === 0) return 6
    return Math.min(6 + dc * 0.5, 20)
  }

  // Close suggestions on outside click
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
    <motion.div className="page-transition pt-20 pb-12 min-h-screen" {...PAGE_TRANSITION}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">City Explorer</h1>
          <p className="text-slate-400">
            Explore environmental suitability scores for 50 Indian cities. Click any city on the map or table for details.
          </p>
        </div>

        {/* Search */}
        <div className="mb-6 relative max-w-md" ref={searchRef}>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              onFocus={() => searchQuery && setShowSuggestions(true)}
              placeholder="Search cities…"
              className="w-full pl-9 pr-4 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>
          {/* Autocomplete */}
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                className="absolute top-full left-0 right-0 mt-1 glass-dark rounded-xl border border-white/10 overflow-hidden z-30"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
              >
                {suggestions.map(city => (
                  <button
                    key={city.id}
                    onClick={() => handleSelectSuggestion(city)}
                    className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/5 transition-colors text-left"
                  >
                    <div>
                      <span className="text-sm text-white">{city.name}</span>
                      <span className="text-xs text-slate-500 ml-2">{city.state}</span>
                    </div>
                    <RiskBadge score={city.DCEI_score} />
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Map */}
        <div className="mb-8 rounded-2xl overflow-hidden border border-white/5 h-[500px]">
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
                  fillColor: getRiskColor(city.DCEI_score),
                  fillOpacity: selectedCity?.id === city.id ? 1 : 0.75,
                  color: selectedCity?.id === city.id ? '#fff' : getRiskColor(city.DCEI_score),
                  weight: selectedCity?.id === city.id ? 2.5 : 1,
                }}
                eventHandlers={{
                  click: () => {
                    setSelectedCity(city)
                    setTimeout(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150)
                  },
                }}
              >
                <Popup>
                  <div className="text-sm">
                    <p className="font-bold text-base mb-1">{city.name}</p>
                    <p className="text-slate-300 mb-2">{city.state}</p>
                    <div className="flex items-center gap-2">
                      <span>DCEI:</span>
                      <span className="font-bold" style={{ color: getRiskColor(city.DCEI_score) }}>
                        {formatScore(city.DCEI_score)}
                      </span>
                      <span style={{ color: getRiskColor(city.DCEI_score) }}>
                        ({getRiskCategory(city.DCEI_score)})
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-slate-400 space-y-0.5">
                      <div>WSI: {formatScore(city.WSI)} · CII: {formatScore(city.CII)}</div>
                      <div>CPI: {formatScore(city.CPI)} · TLI: {formatScore(city.TLI)}</div>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>

        {/* Map legend */}
        <div className="flex flex-wrap items-center gap-4 mb-8 text-xs text-slate-500">
          <span className="font-medium text-slate-400">Risk:</span>
          {[
            { label: 'Low (≤30)', color: '#10b981' },
            { label: 'Moderate (≤50)', color: '#f59e0b' },
            { label: 'High (≤70)', color: '#f97316' },
            { label: 'Critical (>70)', color: '#ef4444' },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: l.color }} />
              {l.label}
            </div>
          ))}
          <span className="ml-2 text-slate-600">Circle size ∝ existing DC count</span>
        </div>

        {/* City detail */}
        <div ref={detailRef}>
          <AnimatePresence mode="wait">
            {selectedCity && (
              <motion.div
                key={selectedCity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="mb-10"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">City Detail</h2>
                  <button
                    onClick={() => setSelectedCity(null)}
                    className="text-slate-500 hover:text-white text-sm transition-colors"
                  >
                    ✕ Close
                  </button>
                </div>
                <CityCard city={selectedCity} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Rankings table */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">City Rankings</h2>
            <span className="text-sm text-slate-500">{tableData.length} cities</span>
          </div>
          <div className="rounded-2xl overflow-hidden border border-white/5 glass-dark">
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr>
                    <th className="table-header w-8 pl-4">#</th>
                    {SORT_FIELDS.map(f => (
                      <th
                        key={f.key}
                        className="table-header cursor-pointer hover:text-white transition-colors select-none"
                        onClick={() => handleSort(f.key)}
                      >
                        <span className="flex items-center gap-1">
                          {f.label}
                          {sortField === f.key && (
                            <span className="text-indigo-400">
                              {sortDir === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </span>
                      </th>
                    ))}
                    <th className="table-header">Risk</th>
                    <th className="table-header">Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((city, i) => (
                    <tr
                      key={city.id}
                      className={`table-row ${selectedCity?.id === city.id ? 'bg-indigo-500/10' : ''}`}
                      onClick={() => handleRowClick(city)}
                    >
                      <td className="table-cell text-slate-600 pl-4">{i + 1}</td>
                      <td className="table-cell font-medium text-white">{city.name}</td>
                      <td className="table-cell font-bold" style={{ color: getRiskColor(city.DCEI_score) }}>
                        {formatScore(city.DCEI_score)}
                      </td>
                      <td className="table-cell" style={{ color: getRiskColor(city.WSI) }}>
                        {formatScore(city.WSI)}
                      </td>
                      <td className="table-cell" style={{ color: getRiskColor(city.CII) }}>
                        {formatScore(city.CII)}
                      </td>
                      <td className="table-cell" style={{ color: getRiskColor(city.CPI) }}>
                        {formatScore(city.CPI)}
                      </td>
                      <td className="table-cell" style={{ color: getRiskColor(city.TLI) }}>
                        {formatScore(city.TLI)}
                      </td>
                      <td className="table-cell">
                        <RiskBadge score={city.DCEI_score} />
                      </td>
                      <td className="table-cell">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          city.data_confidence === 'measured'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-slate-700/50 text-slate-400'
                        }`}>
                          {city.data_confidence}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-3">
            Click any row to see city detail. Sorted by DCEI score descending by default.
            Sources: CGWB 2022, CEA CO₂ Baseline v17, IMD 1991–2020, Census 2011, NASSCOM 2024.
          </p>
        </div>
      </div>
    </motion.div>
  )
}
