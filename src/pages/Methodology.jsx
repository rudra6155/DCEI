import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const PAGE_TRANSITION = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.35 },
}

const SECTIONS = [
  { id: 'overview',      label: 'Framework Overview' },
  { id: 'formula',       label: 'DCEI Formula' },
  { id: 'wsi',           label: 'WSI — Water Stress' },
  { id: 'cii',           label: 'CII — Carbon Intensity' },
  { id: 'cpi',           label: 'CPI — Community Impact' },
  { id: 'tli',           label: 'TLI — Thermal Load' },
  { id: 'normalisation', label: 'Normalisation' },
  { id: 'sources',       label: 'Data Sources' },
  { id: 'limitations',   label: 'Limitations' },
  { id: 'citation',      label: 'Citation' },
]

const DATA_SOURCES = [
  {
    name: 'CGWB Annual Ground Water Report 2022',
    org: 'Central Ground Water Board, Jal Shakti Ministry',
    provides: 'Groundwater exploitation categories (Safe / Semi-Critical / Critical / Over-Exploited) for all assessed units',
    confidence: 'Measured',
    url: 'https://cgwb.gov.in',
  },
  {
    name: 'CEA CO₂ Baseline Database for the Indian Power Sector v17 (2022)',
    org: 'Central Electricity Authority, Government of India',
    provides: 'Grid-average CO₂ emission factors (tCO₂/MWh) by regional grid zone',
    confidence: 'Measured',
    url: 'https://cea.nic.in',
  },
  {
    name: 'MNRE State-wise RE Installed Capacity (2023)',
    org: 'Ministry of New & Renewable Energy',
    provides: 'Renewable energy penetration % by state / grid zone',
    confidence: 'Measured',
    url: 'https://mnre.gov.in',
  },
  {
    name: 'Census of India 2011 — District Census Handbook',
    org: 'Office of the Registrar General & Census Commissioner',
    provides: 'District-level population density (persons/km²)',
    confidence: 'Measured',
    url: 'https://censusindia.gov.in',
  },
  {
    name: 'NASSCOM India Data Center Landscape Report 2024',
    org: 'National Association of Software & Service Companies',
    provides: 'Operational data center counts, capacity, and investment pipeline by city',
    confidence: 'Measured',
    url: 'https://nasscom.in',
  },
  {
    name: 'IMD Climate Normals 1991–2020',
    org: 'India Meteorological Department',
    provides: 'Mean temperature, relative humidity, wet-bulb temperature, rainfall statistics',
    confidence: 'Measured',
    url: 'https://imd.gov.in',
  },
  {
    name: 'NITI Aayog Composite Water Management Index 2019',
    org: 'NITI Aayog, Government of India',
    provides: 'State water stress rankings, per-capita availability benchmarks',
    confidence: 'Measured',
    url: 'https://niti.gov.in',
  },
  {
    name: 'IIT / IISc Urban Heat Island Studies 2021–2023',
    org: 'IIT Madras, IIT Delhi, IIT Bombay, IISc Bangalore',
    provides: 'Urban heat island intensity scores for major Indian cities',
    confidence: 'Measured',
    url: '#',
  },
  {
    name: 'ULB Annual Water Supply Reports 2022–2023',
    org: 'MCGM, CMWSSB, HMWSSB, BWSSB, DJB, PMC, KWA and others',
    provides: 'City-level per-capita water supply (litres per day)',
    confidence: 'Measured',
    url: '#',
  },
]

function CodeBlock({ children }) {
  return (
    <pre className="bg-[#0a0f1e] border border-slate-700/60 rounded-xl p-4 text-sm font-mono text-sky-300 overflow-x-auto leading-relaxed my-4">
      {children}
    </pre>
  )
}

function SectionAnchor({ id }) {
  return <span id={id} className="block" style={{ marginTop: '-80px', paddingTop: '80px' }} />
}

function ComponentTable({ rows }) {
  return (
    <div className="overflow-x-auto my-4">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="text-left text-slate-400 font-medium py-2 pr-4">Component</th>
            <th className="text-left text-slate-400 font-medium py-2 pr-4">Variable</th>
            <th className="text-center text-slate-400 font-medium py-2 pr-4">Weight</th>
            <th className="text-left text-slate-400 font-medium py-2">Source</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-slate-800/60 text-slate-300">
              <td className="py-2 pr-4">{r[0]}</td>
              <td className="py-2 pr-4 font-mono text-sky-400 text-xs">{r[1]}</td>
              <td className="py-2 pr-4 text-center font-mono text-amber-400">{r[2]}</td>
              <td className="py-2 text-slate-400 text-xs">{r[3]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function Methodology() {
  const [activeSection, setActiveSection] = useState('overview')
  const observerRef = useRef(null)

  // Scrollspy
  useEffect(() => {
    const options = { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    observerRef.current = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id) })
    }, options)
    SECTIONS.forEach(s => {
      const el = document.getElementById(s.id)
      if (el) observerRef.current.observe(el)
    })
    return () => observerRef.current?.disconnect()
  }, [])

  return (
    <motion.div {...PAGE_TRANSITION} className="min-h-screen bg-[#0a0f1e] pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 flex gap-8">

        {/* Sticky TOC */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-24 bg-[rgba(17,24,39,0.8)] border border-slate-700/50 rounded-2xl p-4 backdrop-blur-xl">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Contents</p>
            <nav className="space-y-0.5">
              {SECTIONS.map(s => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className={`block text-sm px-3 py-1.5 rounded-lg transition-colors ${
                    activeSection === s.id
                      ? 'bg-sky-500/15 text-sky-400 font-medium'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {s.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <article className="flex-1 min-w-0 space-y-12">

          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-white mb-3">
              📐 <span className="bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
                DCEI Methodology
              </span>
            </h1>
            <p className="text-slate-400 leading-relaxed">
              Technical documentation for the Data Center Environmental Impact Index framework.
              This page accompanies the associated research paper.
            </p>
          </div>

          {/* 1. Overview */}
          <section>
            <SectionAnchor id="overview" />
            <h2 className="text-xl font-bold text-white mb-3">1. Framework Overview</h2>
            <div className="prose-dark text-slate-300 leading-relaxed space-y-3 text-sm">
              <p>
                The <strong className="text-white">Data Center Environmental Impact (DCEI) Index</strong> is
                a composite scoring system that quantifies the environmental stress of hosting
                AI data centers at specific locations in India. It synthesises four primary
                dimensions of environmental concern into a single <strong className="text-sky-400">0–100 score</strong>,
                where <strong className="text-red-400">higher scores indicate greater environmental risk</strong>.
              </p>
              <p>
                DCEI addresses a critical gap: while techno-economic factors (land cost, latency,
                power tariff) are well-studied for data center siting, the <em>compound environmental
                footprint</em> — particularly in water-stressed and carbon-intensive regions —
                has received little systematic attention in the Indian context.
              </p>
              <p>
                <strong className="text-white">Scope:</strong> 50 major Indian cities spanning
                all five CEA grid zones and all major geographic and climatic regions, covering
                over 90% of India's current and planned data center capacity.
              </p>
              <p>
                <strong className="text-white">Unit of analysis:</strong> District-level
                administrative boundaries (Census 2011) aligned with CGWB groundwater assessment
                units. All thermal data from IMD station normals for the nearest recording station.
              </p>
            </div>
          </section>

          {/* 2. DCEI Formula */}
          <section>
            <SectionAnchor id="formula" />
            <h2 className="text-xl font-bold text-white mb-3">2. DCEI Formula</h2>
            <CodeBlock>
{`DCEI_Score = (W₁ × WSI) + (W₂ × CII) + (W₃ × CPI) + (W₄ × TLI)

Default weights:
  W₁ = 0.35   Water Stress Index
  W₂ = 0.25   Carbon Intensity Index
  W₃ = 0.20   Community Impact Index
  W₄ = 0.20   Thermal Load Index

Constraint:  W₁ + W₂ + W₃ + W₄ = 1.0
Range:       0 ≤ DCEI_Score ≤ 100`}
            </CodeBlock>
            <div className="text-sm text-slate-300 space-y-2">
              <p>
                <strong className="text-white">Weight rationale:</strong> Water stress (0.35) is
                weighted highest reflecting India's acute groundwater crisis — CGWB classifies
                ~16% of assessed units as Over-Exploited as of 2022. AI data centers typically
                consume 1.8–2.2 litres of water per kWh for evaporative cooling.
              </p>
              <p>
                Carbon intensity (0.25) reflects India's coal-heavy grid mix and the outsized
                energy demand of GPU compute clusters. Community (0.20) and thermal (0.20)
                weights are equal, recognising both as significant but secondary concerns.
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { index: 'WSI', weight: '35%', color: '#0ea5e9', desc: 'Water Stress' },
                { index: 'CII', weight: '25%', color: '#f59e0b', desc: 'Carbon Intensity' },
                { index: 'CPI', weight: '20%', color: '#a78bfa', desc: 'Community Impact' },
                { index: 'TLI', weight: '20%', color: '#f97316', desc: 'Thermal Load' },
              ].map(c => (
                <div key={c.index} className="bg-[rgba(17,24,39,0.6)] border border-slate-700/50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-black font-mono" style={{ color: c.color }}>{c.weight}</div>
                  <div className="font-bold text-white text-sm">{c.index}</div>
                  <div className="text-xs text-slate-400">{c.desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* 3. WSI */}
          <section>
            <SectionAnchor id="wsi" />
            <h2 className="text-xl font-bold text-white mb-3">3. Water Stress Index (WSI)</h2>
            <CodeBlock>
{`WSI = 0.40 × GW_score
     + 0.25 × Norm⁻¹(per_capita_water_lpd)
     + 0.20 × Norm(rainfall_cv)
     + 0.15 × competing_demand_score`}
            </CodeBlock>
            <ComponentTable rows={[
              ['Groundwater exploitation', 'gw_score', '0.40', 'CGWB 2022'],
              ['Per-capita water availability (inverse)', 'per_capita_water_lpd', '0.25', 'ULB / State water boards'],
              ['Rainfall variability (coefficient of variation)', 'rainfall_cv', '0.20', 'IMD Climate Normals'],
              ['Competing sectoral demand', 'competing_demand_score', '0.15', 'NITI Aayog CWMI / Expert'],
            ]} />
            <div className="mt-3 p-4 bg-[rgba(14,165,233,0.06)] border border-sky-500/20 rounded-xl text-sm text-slate-300">
              <strong className="text-sky-400">CGWB Category Mapping:</strong>
              <div className="mt-2 grid grid-cols-4 gap-2 font-mono text-xs">
                {[['Safe','20','#10b981'],['Semi-Critical','45','#f59e0b'],['Critical','70','#f97316'],['Over-Exploited','95','#ef4444']].map(([c,s,col]) => (
                  <div key={c} className="text-center p-2 rounded-lg bg-[rgba(255,255,255,0.03)]">
                    <div style={{ color: col }} className="font-bold">{s}</div>
                    <div className="text-slate-400">{c}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 4. CII */}
          <section>
            <SectionAnchor id="cii" />
            <h2 className="text-xl font-bold text-white mb-3">4. Carbon Intensity Index (CII)</h2>
            <CodeBlock>
{`CII = 0.50 × Norm(grid_emission_factor)
     + 0.30 × Norm(100 − renewable_pct)
     + 0.20 × grid_reliability_score`}
            </CodeBlock>
            <ComponentTable rows={[
              ['Grid CO₂ emission factor', 'grid_emission_factor (tCO₂/MWh)', '0.50', 'CEA CO₂ Baseline v17 2022'],
              ['Renewable penetration (inverse)', 'renewable_pct', '0.30', 'CEA / MNRE 2023'],
              ['Grid reliability / outage risk', 'grid_reliability_score', '0.20', 'CEA Reliability Reports'],
            ]} />
            <div className="mt-3 p-4 bg-[rgba(245,158,11,0.06)] border border-amber-500/20 rounded-xl">
              <p className="text-xs font-semibold text-amber-400 mb-2">CEA Regional Grid Emission Factors (2022)</p>
              <table className="w-full text-xs text-slate-300">
                <thead><tr className="text-slate-400 border-b border-slate-700">
                  <th className="text-left py-1">Zone</th><th className="text-left py-1">States</th>
                  <th className="text-right py-1">tCO₂/MWh</th><th className="text-right py-1">RE%</th>
                </tr></thead>
                <tbody>
                  {[
                    ['Northern (NR)', 'Delhi, UP, Rajasthan, MP, Haryana, Punjab', '0.90', '25%'],
                    ['Western (WR)', 'Maharashtra, Gujarat, Chhattisgarh', '0.82', '30%'],
                    ['Southern (SR)', 'TN, Karnataka, Telangana, AP, Kerala', '0.72', '35%'],
                    ['Eastern (ER)', 'West Bengal, Odisha, Jharkhand, Bihar', '0.92', '15%'],
                    ['Northeastern (NER)', 'Assam and NE states', '0.84', '20%'],
                  ].map(r => (
                    <tr key={r[0]} className="border-b border-slate-800/40">
                      <td className="py-1 font-mono text-sky-400">{r[0]}</td>
                      <td className="py-1">{r[1]}</td>
                      <td className="py-1 text-right font-mono text-amber-400">{r[2]}</td>
                      <td className="py-1 text-right font-mono text-emerald-400">{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 5. CPI */}
          <section>
            <SectionAnchor id="cpi" />
            <h2 className="text-xl font-bold text-white mb-3">5. Community Impact Index (CPI)</h2>
            <CodeBlock>
{`CPI = 0.35 × LogNorm(population_density)
     + 0.25 × Norm(dc_count)
     + 0.20 × noise_sensitivity_score
     + 0.20 × utility_pressure_score`}
            </CodeBlock>
            <ComponentTable rows={[
              ['Population density (log-normalised)', 'population_density (persons/km²)', '0.35', 'Census of India 2011'],
              ['Existing DC concentration', 'dc_count', '0.25', 'NASSCOM 2024'],
              ['Noise sensitivity', 'noise_score', '0.20', 'CPCB / Expert estimate'],
              ['Utility infrastructure pressure', 'utility_pressure', '0.20', 'ULB reports / Expert'],
            ]} />
            <p className="text-sm text-slate-300 mt-3">
              Population density uses <strong className="text-white">log-normalisation</strong> to handle
              the extreme skew in Indian city densities (Chennai: 26,903/km² vs. Naya Raipur: 1,200/km²).
              DC concentration captures cumulative stress on local utility and cooling infrastructure.
            </p>
          </section>

          {/* 6. TLI */}
          <section>
            <SectionAnchor id="tli" />
            <h2 className="text-xl font-bold text-white mb-3">6. Thermal Load Index (TLI)</h2>
            <CodeBlock>
{`TLI = 0.40 × Norm(wet_bulb_temp_c)
     + 0.30 × Norm(cooling_degree_days)
     + 0.20 × Norm(relative_humidity_pct)
     + 0.10 × heat_island_score`}
            </CodeBlock>
            <ComponentTable rows={[
              ['Wet-bulb temperature', 'wet_bulb_temp_c (°C)', '0.40', 'IMD Normals 1991–2020'],
              ['Cooling degree-days (base 18°C)', 'cooling_degree_days', '0.30', 'IMD / Derived'],
              ['Relative humidity', 'relative_humidity_pct (%)', '0.20', 'IMD Normals 1991–2020'],
              ['Urban heat island intensity', 'heat_island_score', '0.10', 'IIT / IISc studies'],
            ]} />
            <p className="text-sm text-slate-300 mt-3">
              Wet-bulb temperature dominates the TLI weight because it governs the efficiency of
              evaporative cooling — the primary mechanism in most Indian data centers.
              A wet-bulb temperature above <strong className="text-amber-400">26°C</strong> effectively
              renders evaporative cooling non-functional, forcing compressor-based cooling with
              significantly higher PUE (Power Usage Effectiveness).
              Bengaluru's wet-bulb of ~19°C is its primary environmental advantage.
            </p>
          </section>

          {/* 7. Normalisation */}
          <section>
            <SectionAnchor id="normalisation" />
            <h2 className="text-xl font-bold text-white mb-3">7. Normalisation Approach</h2>
            <div className="space-y-4 text-sm text-slate-300">
              <div>
                <p className="text-white font-semibold mb-1">Min-Max Normalisation (direct)</p>
                <CodeBlock>{`score = (x − x_min) / (x_max − x_min) × 100`}</CodeBlock>
                <p>Used for: rainfall_cv, grid_emission_factor, renewable_pct (inverse), wet_bulb_temp_c, cooling_degree_days, relative_humidity_pct, dc_count.</p>
              </div>
              <div>
                <p className="text-white font-semibold mb-1">Inverse Normalisation (higher value = lower risk)</p>
                <CodeBlock>{`score = 100 − (x − x_min) / (x_max − x_min) × 100`}</CodeBlock>
                <p>Used for: per_capita_water_lpd (more water = lower stress).</p>
              </div>
              <div>
                <p className="text-white font-semibold mb-1">Log Normalisation (highly skewed distributions)</p>
                <CodeBlock>{`score = (log(x+1) − log(x_min+1)) / (log(x_max+1) − log(x_min+1)) × 100`}</CodeBlock>
                <p>Used for: population_density (range ~1,200 to ~26,903 persons/km²).</p>
              </div>
              <div className="p-4 bg-[rgba(239,68,68,0.06)] border border-red-500/20 rounded-xl">
                <p className="text-amber-400 font-semibold mb-1">⚠ Important: Dataset-Relative Scoring</p>
                <p>All min-max normalisations are computed relative to the 50 cities in this study.
                Adding or removing cities will shift all scores. Absolute values are not comparable
                across different study sets. Future versions will establish fixed reference anchors.</p>
              </div>
            </div>
          </section>

          {/* 8. Data Sources */}
          <section>
            <SectionAnchor id="sources" />
            <h2 className="text-xl font-bold text-white mb-3">8. Data Sources</h2>
            <div className="space-y-3">
              {DATA_SOURCES.map((s, i) => (
                <div key={i} className="bg-[rgba(17,24,39,0.6)] border border-slate-700/40 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-semibold text-white text-sm">{s.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold shrink-0 ${
                      s.confidence === 'Measured' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>{s.confidence}</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-1">{s.org}</p>
                  <p className="text-xs text-slate-300">{s.provides}</p>
                  {s.url !== '#' && (
                    <a href={s.url} target="_blank" rel="noreferrer"
                       className="text-xs text-sky-400 hover:text-sky-300 mt-1 inline-block">{s.url}</a>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* 9. Limitations */}
          <section>
            <SectionAnchor id="limitations" />
            <h2 className="text-xl font-bold text-white mb-3">9. Limitations & Assumptions</h2>
            <ul className="space-y-3 text-sm text-slate-300">
              {[
                ['Static snapshot', 'All data represents a single point in time. CGWB assessments update every 5 years; CEA emission factors update annually. The framework should be re-scored with each data revision.'],
                ['District vs. city granularity', 'CGWB and Census data are at district level, which may not capture intra-urban variation. City-centre and periurban areas within the same district can differ significantly.'],
                ['Grid-average emission factors', 'CII uses regional grid averages from CEA. Individual data centers can procure renewable power via PPAs or green tariffs, potentially achieving near-zero Scope-2 emissions regardless of grid zone.'],
                ['NASSCOM DC counts', 'Operational DC numbers are approximations from published reports. India lacks a centralised DC registry.'],
                ['No disaster risk component', 'Cyclone exposure (Odisha, AP coast), seismic risk (Delhi, North India), and coastal flooding are not captured in DCEI. A future version should incorporate NDMA hazard-zone data.'],
                ['Population density proxy', 'District-level density is a coarse proxy for community sensitivity. Urban microplanning and proximity to residential zones vary significantly within a district.'],
                ['Dataset-relative normalisation', 'Min-max normalisation means that adding or removing cities shifts all scores. Absolute DCEI values are not comparable across different study sets.'],
                ['Estimated data for Tier-2 cities', 'Several smaller cities have components flagged "estimated" due to limited primary data availability. These should be treated with appropriate caution.'],
              ].map(([title, body]) => (
                <li key={title} className="bg-[rgba(17,24,39,0.5)] rounded-xl p-3 border border-slate-800/60">
                  <span className="font-semibold text-white">{title}. </span>
                  {body}
                </li>
              ))}
            </ul>
          </section>

          {/* 10. Citation */}
          <section>
            <SectionAnchor id="citation" />
            <h2 className="text-xl font-bold text-white mb-3">10. Citation</h2>
            <div className="mt-2 p-4 bg-[rgba(14,165,233,0.06)] border border-sky-500/20 rounded-xl text-sm text-slate-300">
              Citation: This framework is a research preview. Formal citation will be available upon preprint publication on Zenodo.
            </div>
            <div className="mt-6 p-4 bg-[rgba(14,165,233,0.06)] border border-sky-500/20 rounded-xl text-sm text-slate-300">
              This dashboard is a research preview. All scores, weights, and methodology are
              subject to revision. Expert feedback from hydrology, electrical engineering, and
              urban planning domains is actively solicited.
              <br /><br />
              <span className="text-slate-400 text-xs">
                DCEI Framework v0.1 · Research by Rudra Singh ·
                Data: CGWB 2022 · CEA CO₂ Baseline v17 · IMD 1991–2020 · Census 2011 · NASSCOM 2024
              </span>
            </div>
          </section>

        </article>
      </div>
    </motion.div>
  )
}
