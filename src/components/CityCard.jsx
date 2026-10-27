import { Link } from 'react-router-dom'
import ScoreGauge from './ScoreGauge.jsx'
import RiskBadge from './RiskBadge.jsx'
import SubIndexBar from './SubIndexBar.jsx'
import Panel from './Panel.jsx'
import DashedBtn from './DashedBtn.jsx'
import { getInfraNote } from '../utils/helpers.js'

/**
 * CityCard — full city detail card in game UI style.
 * Props:
 *   city: scored city object
 *   compact: boolean
 */
export default function CityCard({ city, compact = false }) {
  if (!city) return null

  const infraNote = getInfraNote(city.name)

  const stats = [
    { label: 'Pop. Density', value: `${city.population_density.toLocaleString()} /km²`, source: 'Census 2011' },
    { label: 'CGWB Cat.',    value: city.cgwb_category,   source: 'CGWB 2022' },
    { label: 'Grid Zone',    value: city.grid_zone,        source: 'CEA' },
    { label: 'Avg. Temp.',   value: `${city.avg_temp_c}°C`, source: 'IMD Normals' },
    { label: 'Existing DCs', value: city.dc_count === 0 ? 'None known' : `${city.dc_count}`, source: 'NASSCOM 2024' },
    { label: 'State',        value: city.state,            source: 'GOI' },
  ]

  return (
    <Panel className="p-4 w-full">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="font-pixel text-lg text-ink leading-tight">{city.name}</h2>
          <p className="font-mono text-xs text-ink-soft mt-0.5">{city.state}</p>
          <div className="mt-2">
            <RiskBadge score={city.DCEI_score} />
          </div>
        </div>
        <div className="flex-shrink-0">
          <ScoreGauge score={city.DCEI_score} size={compact ? 130 : 160} />
          <p className="text-center text-[10px] font-mono text-ink-soft mt-1">DCEI Score</p>
        </div>
      </div>

      {/* Sub-index bars */}
      <Panel inset className="p-3 mb-4">
        <p className="font-mono text-[10px] text-ink-soft uppercase tracking-widest mb-2">
          Sub-Index Breakdown
        </p>
        <div className="space-y-2">
          <SubIndexBar label="WSI — Water Stress"      value={city.WSI} />
          <SubIndexBar label="CII — Carbon Intensity"  value={city.CII} />
          <SubIndexBar label="CPI — Community Pressure" value={city.CPI} />
          <SubIndexBar label="TLI — Thermal Load"      value={city.TLI} />
        </div>
      </Panel>

      {/* Key stats grid */}
      <div className="dc-table mb-4">
        <table className="w-full border-collapse">
          <tbody>
            {stats.map((s, i) => (
              <tr key={s.label} className={i % 2 === 1 ? 'bg-paper-2' : 'bg-paper'}>
                <td className="font-mono text-[10px] text-ink-soft uppercase tracking-wider px-2 py-1 border border-ink/20 w-1/3">
                  {s.label}
                </td>
                <td className="font-mono text-xs text-ink px-2 py-1 border border-ink/20">
                  {s.value}
                </td>
                <td className="font-mono text-[9px] text-ink-soft px-2 py-1 border border-ink/20 text-right">
                  {s.source}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Infrastructure note */}
      <Panel inset className="p-3 mb-4">
        <p className="font-mono text-[10px] text-ink-soft uppercase tracking-widest mb-1">
          Infrastructure Context
        </p>
        <p className="font-mono text-xs text-ink leading-relaxed">{infraNote}</p>
      </Panel>

      {/* Data confidence */}
      <p className="font-mono text-[10px] text-ink-soft mb-4">
        Confidence: <span className="text-ink capitalize">{city.data_confidence}</span>
        {' · '}CGWB 2022 · CEA CO₂ v17 · IMD 1991–2020 · Census 2011 · NASSCOM 2024
      </p>

      {/* Action buttons */}
      {!compact && (
        <div className="flex flex-wrap gap-3">
          <Link
            to={`/compare?city=${encodeURIComponent(city.name)}`}
            className="no-underline"
          >
            <DashedBtn variant="lavender">Compare with another city</DashedBtn>
          </Link>
          <Link
            to={`/alternatives?city=${encodeURIComponent(city.name)}`}
            className="no-underline"
          >
            <DashedBtn variant="neutral">Find alternatives</DashedBtn>
          </Link>
        </div>
      )}
    </Panel>
  )
}
