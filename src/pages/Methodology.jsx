import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import PageHeader from '../components/PageHeader.jsx'
import Panel from '../components/Panel.jsx'
import MenuRow from '../components/MenuRow.jsx'
import SegMeter from '../components/SegMeter.jsx'

const PAGE_TRANSITION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit:    { opacity: 0 },
  transition: { duration: 0.16 },
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
  { name: 'CGWB Annual Ground Water Report 2022',             org: 'Central Ground Water Board, Jal Shakti Ministry',   provides: 'Groundwater exploitation categories for all assessed units', confidence: 'Measured', url: 'https://cgwb.gov.in' },
  { name: 'CEA CO₂ Baseline Database v17 (2022)',             org: 'Central Electricity Authority, Government of India', provides: 'Grid-average CO₂ emission factors (tCO₂/MWh) by regional grid zone', confidence: 'Measured', url: 'https://cea.nic.in' },
  { name: 'MNRE State-wise RE Installed Capacity (2023)',     org: 'Ministry of New & Renewable Energy',                provides: 'Renewable energy penetration % by state / grid zone', confidence: 'Measured', url: 'https://mnre.gov.in' },
  { name: 'Census of India 2011 — District Census Handbook',  org: 'Office of the Registrar General & Census Commissioner', provides: 'District-level population density (persons/km²)', confidence: 'Measured', url: 'https://censusindia.gov.in' },
  { name: 'NASSCOM India Data Center Landscape Report 2024',  org: 'National Association of Software & Service Companies', provides: 'Operational data center counts, capacity, and investment pipeline by city', confidence: 'Measured', url: 'https://nasscom.in' },
  { name: 'IMD Climate Normals 1991–2020',                    org: 'India Meteorological Department',                   provides: 'Mean temperature, relative humidity, wet-bulb temperature, rainfall statistics', confidence: 'Measured', url: 'https://imd.gov.in' },
  { name: 'NITI Aayog Composite Water Management Index 2019', org: 'NITI Aayog, Government of India',                   provides: 'State water stress rankings, per-capita availability benchmarks', confidence: 'Measured', url: 'https://niti.gov.in' },
  { name: 'IIT / IISc Urban Heat Island Studies 2021–2023',  org: 'IIT Madras, IIT Delhi, IIT Bombay, IISc Bangalore', provides: 'Urban heat island intensity scores for major Indian cities', confidence: 'Measured', url: '#' },
  { name: 'ULB Annual Water Supply Reports 2022–2023',        org: 'MCGM, CMWSSB, HMWSSB, BWSSB, DJB, PMC, KWA and others', provides: 'City-level per-capita water supply (litres per day)', confidence: 'Measured', url: '#' },
]

function CodeBlock({ children }) {
  return (
    <Panel inset className="p-4 my-4 overflow-x-auto">
      <pre className="font-mono text-xs text-cube leading-relaxed">{children}</pre>
    </Panel>
  )
}

function SectionAnchor({ id }) {
  return <span id={id} className="block" style={{ marginTop: '-52px', paddingTop: '52px' }} />
}

function ComponentTable({ rows }) {
  return (
    <div className="overflow-x-auto my-4">
      <table className="dc-table w-full border-collapse">
        <thead>
          <tr className="bg-paper-2">
            <th className="font-mono text-[10px] text-ink-soft uppercase px-3 py-2 text-left border border-ink/20">Component</th>
            <th className="font-mono text-[10px] text-ink-soft uppercase px-3 py-2 text-left border border-ink/20">Variable</th>
            <th className="font-mono text-[10px] text-ink-soft uppercase px-3 py-2 text-center border border-ink/20">Weight</th>
            <th className="font-mono text-[10px] text-ink-soft uppercase px-3 py-2 text-left border border-ink/20">Source</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-paper' : 'bg-paper-2'}>
              <td className="font-mono text-xs text-ink px-3 py-1.5 border border-ink/10">{r[0]}</td>
              <td className="font-mono text-xs text-cube px-3 py-1.5 border border-ink/10">{r[1]}</td>
              <td className="font-pixel text-xs text-center px-3 py-1.5 border border-ink/10" style={{ color: '#F4A020' }}>{r[2]}</td>
              <td className="font-mono text-xs text-ink-soft px-3 py-1.5 border border-ink/10">{r[3]}</td>
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

  useEffect(() => {
    const options = { rootMargin: '-52px 0px -60% 0px', threshold: 0 }
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
    <motion.div className="page-transition min-h-dvh bg-paper" {...PAGE_TRANSITION}>
      <PageHeader title="DCEI Methodology" subtitle="Technical documentation for the DCEI framework" />

      <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">

        {/* Sticky TOC */}
        <aside className="hidden lg:block w-52 shrink-0">
          <Panel className="sticky top-12">
            <div className="px-3 py-2 border-b border-ink/20" style={{ backgroundColor: '#7D7D7D' }}>
              <p className="font-pixel text-[10px] text-white uppercase tracking-widest">Contents</p>
            </div>
            {SECTIONS.map(s => (
              <MenuRow
                key={s.id}
                active={activeSection === s.id}
                onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' })}
              >
                {s.label}
              </MenuRow>
            ))}
          </Panel>
        </aside>

        {/* Main content */}
        <article className="flex-1 min-w-0 space-y-10">

          {/* 1. Overview */}
          <section>
            <SectionAnchor id="overview" />
            <h2 className="font-pixel text-lg text-ink mb-3">1. Framework Overview</h2>
            <div className="font-mono text-sm text-ink space-y-3 leading-relaxed">
              <p>
                The <strong>Data Center Environmental Impact (DCEI) Index</strong> is a composite scoring
                system that quantifies the environmental stress of hosting AI data centers at specific
                locations in India. It synthesises four primary dimensions into a single{' '}
                <span style={{ color: '#03CDD7' }}>0–100 score</span>, where{' '}
                <span style={{ color: '#E03838' }}>higher scores indicate greater environmental risk</span>.
              </p>
              <p>
                DCEI addresses a critical gap: while techno-economic factors are well-studied for data
                center siting, the <em>compound environmental footprint</em> — particularly in
                water-stressed and carbon-intensive regions — has received little systematic attention
                in the Indian context.
              </p>
              <p>
                <strong>Scope:</strong> 50 major Indian cities spanning all five CEA grid zones,
                covering over 90% of India's current and planned data center capacity.
              </p>
              <p>
                <strong>Unit of analysis:</strong> District-level administrative boundaries (Census 2011)
                aligned with CGWB groundwater assessment units.
              </p>
            </div>
          </section>

          {/* 2. DCEI Formula */}
          <section>
            <SectionAnchor id="formula" />
            <h2 className="font-pixel text-lg text-ink mb-3">2. DCEI Formula</h2>
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
            <div className="font-mono text-sm text-ink space-y-2">
              <p>
                <strong>Weight rationale:</strong> Water stress (0.35) is weighted highest reflecting
                India's acute groundwater crisis. AI data centers typically consume 1.8–2.2 litres of
                water per kWh for evaporative cooling.
              </p>
              <p>
                Carbon intensity (0.25) reflects India's coal-heavy grid mix. Community (0.20) and
                thermal (0.20) weights are equal, recognising both as significant but secondary.
              </p>
            </div>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { index: 'WSI', weight: '35%', level: 'high',     desc: 'Water Stress'     },
                { index: 'CII', weight: '25%', level: 'moderate', desc: 'Carbon Intensity'  },
                { index: 'CPI', weight: '20%', level: 'moderate', desc: 'Community Impact'  },
                { index: 'TLI', weight: '20%', level: 'high',     desc: 'Thermal Load'      },
              ].map(c => (
                <Panel key={c.index} inset className="p-3 text-center">
                  <p className="font-pixel text-xl text-ink mb-1">{c.weight}</p>
                  <p className="font-pixel text-sm text-ink">{c.index}</p>
                  <p className="font-mono text-[10px] text-ink-soft">{c.desc}</p>
                  <SegMeter value={parseInt(c.weight)} riskLevel={c.level} size={6} gap={1} className="mt-2" />
                </Panel>
              ))}
            </div>
          </section>

          {/* 3. WSI */}
          <section>
            <SectionAnchor id="wsi" />
            <h2 className="font-pixel text-lg text-ink mb-3">3. Water Stress Index (WSI)</h2>
            <CodeBlock>
{`WSI = 0.40 × GW_score
     + 0.25 × Norm⁻¹(per_capita_water_lpd)
     + 0.20 × Norm(rainfall_cv)
     + 0.15 × competing_demand_score`}
            </CodeBlock>
            <ComponentTable rows={[
              ['Groundwater exploitation',                          'gw_score',                '0.40', 'CGWB 2022'],
              ['Per-capita water availability (inverse)',           'per_capita_water_lpd',    '0.25', 'ULB / State water boards'],
              ['Rainfall variability (coefficient of variation)',   'rainfall_cv',             '0.20', 'IMD Climate Normals'],
              ['Competing sectoral demand',                         'competing_demand_score',  '0.15', 'NITI Aayog CWMI / Expert'],
            ]} />
            <Panel inset className="p-3">
              <p className="font-mono text-xs text-ink-soft mb-2 uppercase tracking-widest">CGWB Category Mapping</p>
              <div className="grid grid-cols-4 gap-2 font-mono text-xs">
                {[['Safe','20','#4AB0E8'],['Semi-Critical','45','#F4A020'],['Critical','70','#E03838'],['Over-Exploited','95','#E03838']].map(([cat,score,color]) => (
                  <div key={cat} className="text-center p-2 border border-ink/10">
                    <div className="font-pixel text-lg" style={{ color }}>{score}</div>
                    <div className="text-ink-soft text-[9px]">{cat}</div>
                  </div>
                ))}
              </div>
            </Panel>
          </section>

          {/* 4. CII */}
          <section>
            <SectionAnchor id="cii" />
            <h2 className="font-pixel text-lg text-ink mb-3">4. Carbon Intensity Index (CII)</h2>
            <CodeBlock>
{`CII = 0.50 × Norm(grid_emission_factor)
     + 0.30 × Norm(100 − renewable_pct)
     + 0.20 × grid_reliability_score`}
            </CodeBlock>
            <ComponentTable rows={[
              ['Grid CO₂ emission factor',         'grid_emission_factor (tCO₂/MWh)', '0.50', 'CEA CO₂ Baseline v17 2022'],
              ['Renewable penetration (inverse)',   'renewable_pct',                   '0.30', 'CEA / MNRE 2023'],
              ['Grid reliability / outage risk',    'grid_reliability_score',          '0.20', 'CEA Reliability Reports'],
            ]} />
            <Panel inset className="p-3">
              <p className="font-mono text-[10px] text-ink-soft mb-2 uppercase tracking-widest">CEA Regional Grid Emission Factors (2022)</p>
              <table className="w-full border-collapse font-mono text-xs">
                <thead>
                  <tr className="bg-paper-2">
                    <th className="text-left px-2 py-1 border border-ink/20 text-ink-soft">Zone</th>
                    <th className="text-left px-2 py-1 border border-ink/20 text-ink-soft">States</th>
                    <th className="text-right px-2 py-1 border border-ink/20 text-ink-soft">tCO₂/MWh</th>
                    <th className="text-right px-2 py-1 border border-ink/20 text-ink-soft">RE%</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Northern (NR)',      'Delhi, UP, Rajasthan, MP, Haryana, Punjab',    '0.90', '25%'],
                    ['Western (WR)',       'Maharashtra, Gujarat, Chhattisgarh',            '0.82', '30%'],
                    ['Southern (SR)',      'TN, Karnataka, Telangana, AP, Kerala',          '0.72', '35%'],
                    ['Eastern (ER)',       'West Bengal, Odisha, Jharkhand, Bihar',         '0.92', '15%'],
                    ['Northeastern (NER)', 'Assam and NE states',                           '0.84', '20%'],
                  ].map((r, i) => (
                    <tr key={r[0]} className={i % 2 === 0 ? 'bg-paper' : 'bg-paper-2'}>
                      <td className="px-2 py-1 border border-ink/10" style={{ color: '#03CDD7' }}>{r[0]}</td>
                      <td className="px-2 py-1 border border-ink/10 text-ink">{r[1]}</td>
                      <td className="px-2 py-1 border border-ink/10 text-right" style={{ color: '#F4A020' }}>{r[2]}</td>
                      <td className="px-2 py-1 border border-ink/10 text-right" style={{ color: '#60C860' }}>{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Panel>
          </section>

          {/* 5. CPI */}
          <section>
            <SectionAnchor id="cpi" />
            <h2 className="font-pixel text-lg text-ink mb-3">5. Community Impact Index (CPI)</h2>
            <CodeBlock>
{`CPI = 0.35 × LogNorm(population_density)
     + 0.25 × Norm(dc_count)
     + 0.20 × noise_sensitivity_score
     + 0.20 × utility_pressure_score`}
            </CodeBlock>
            <ComponentTable rows={[
              ['Population density (log-normalised)', 'population_density (persons/km²)', '0.35', 'Census of India 2011'],
              ['Existing DC concentration',           'dc_count',                         '0.25', 'NASSCOM 2024'],
              ['Noise sensitivity',                   'noise_score',                      '0.20', 'CPCB / Expert estimate'],
              ['Utility infrastructure pressure',     'utility_pressure',                 '0.20', 'ULB reports / Expert'],
            ]} />
            <p className="font-mono text-sm text-ink leading-relaxed">
              Population density uses <strong>log-normalisation</strong> to handle the extreme skew in
              Indian city densities (Chennai: 26,903/km² vs. Naya Raipur: 1,200/km²).
            </p>
          </section>

          {/* 6. TLI */}
          <section>
            <SectionAnchor id="tli" />
            <h2 className="font-pixel text-lg text-ink mb-3">6. Thermal Load Index (TLI)</h2>
            <CodeBlock>
{`TLI = 0.40 × Norm(wet_bulb_temp_c)
     + 0.30 × Norm(cooling_degree_days)
     + 0.20 × Norm(relative_humidity_pct)
     + 0.10 × heat_island_score`}
            </CodeBlock>
            <ComponentTable rows={[
              ['Wet-bulb temperature',           'wet_bulb_temp_c (°C)',      '0.40', 'IMD Normals 1991–2020'],
              ['Cooling degree-days (base 18°C)', 'cooling_degree_days',      '0.30', 'IMD / Derived'],
              ['Relative humidity',               'relative_humidity_pct (%)', '0.20', 'IMD Normals 1991–2020'],
              ['Urban heat island intensity',     'heat_island_score',        '0.10', 'IIT / IISc studies'],
            ]} />
            <p className="font-mono text-sm text-ink leading-relaxed">
              Wet-bulb temperature dominates the TLI weight because it governs the efficiency of evaporative
              cooling. A wet-bulb temperature above{' '}
              <span style={{ color: '#F4A020' }}>26°C</span> effectively renders evaporative cooling
              non-functional. Bengaluru's wet-bulb of ~19°C is its primary environmental advantage.
            </p>
          </section>

          {/* 7. Normalisation */}
          <section>
            <SectionAnchor id="normalisation" />
            <h2 className="font-pixel text-lg text-ink mb-3">7. Normalisation Approach</h2>
            <div className="space-y-4 font-mono text-sm text-ink">
              <div>
                <p className="font-pixel text-xs mb-1">Min-Max Normalisation (direct)</p>
                <CodeBlock>{`score = (x − x_min) / (x_max − x_min) × 100`}</CodeBlock>
                <p className="text-ink-soft">Used for: rainfall_cv, grid_emission_factor, renewable_pct, wet_bulb_temp_c, cooling_degree_days, dc_count.</p>
              </div>
              <div>
                <p className="font-pixel text-xs mb-1">Inverse Normalisation (higher value = lower risk)</p>
                <CodeBlock>{`score = 100 − (x − x_min) / (x_max − x_min) × 100`}</CodeBlock>
                <p className="text-ink-soft">Used for: per_capita_water_lpd (more water = lower stress).</p>
              </div>
              <div>
                <p className="font-pixel text-xs mb-1">Log Normalisation (highly skewed distributions)</p>
                <CodeBlock>{`score = (log(x+1) − log(x_min+1)) / (log(x_max+1) − log(x_min+1)) × 100`}</CodeBlock>
                <p className="text-ink-soft">Used for: population_density (range ~1,200 to ~26,903 persons/km²).</p>
              </div>
              <Panel className="p-3 border-risk-high">
                <p className="font-pixel text-xs mb-1" style={{ color: '#F4A020' }}>Important: Dataset-Relative Scoring</p>
                <p className="text-ink-soft text-xs leading-relaxed">All min-max normalisations are computed relative to the 50 cities in this study.
                Adding or removing cities will shift all scores. Absolute values are not comparable
                across different study sets. Future versions will establish fixed reference anchors.</p>
              </Panel>
            </div>
          </section>

          {/* 8. Data Sources */}
          <section>
            <SectionAnchor id="sources" />
            <h2 className="font-pixel text-lg text-ink mb-3">8. Data Sources</h2>
            <div className="space-y-3">
              {DATA_SOURCES.map((s, i) => (
                <Panel key={i} inset className="p-3">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-pixel text-xs text-ink">{s.name}</span>
                    <span className={`font-mono text-[9px] px-1.5 py-0.5 border shrink-0 ${
                      s.confidence === 'Measured'
                        ? 'border-risk-moderate text-risk-moderate'
                        : 'border-risk-high text-risk-high'
                    }`}>{s.confidence}</span>
                  </div>
                  <p className="font-mono text-[10px] text-ink-soft mb-1">{s.org}</p>
                  <p className="font-mono text-xs text-ink">{s.provides}</p>
                  {s.url !== '#' && (
                    <a href={s.url} target="_blank" rel="noreferrer"
                       className="font-mono text-[10px] text-cube hover:text-ink transition-colors mt-1 inline-block no-underline">{s.url}</a>
                  )}
                </Panel>
              ))}
            </div>
          </section>

          {/* 9. Limitations */}
          <section>
            <SectionAnchor id="limitations" />
            <h2 className="font-pixel text-lg text-ink mb-3">9. Limitations & Assumptions</h2>
            <div className="space-y-3">
              {[
                ['Static snapshot', 'All data represents a single point in time. CGWB assessments update every 5 years; CEA emission factors update annually.'],
                ['District vs. city granularity', 'CGWB and Census data are at district level, which may not capture intra-urban variation.'],
                ['Grid-average emission factors', 'CII uses regional grid averages. Individual data centers can procure renewable power via PPAs or green tariffs.'],
                ['NASSCOM DC counts', 'Operational DC numbers are approximations. India lacks a centralised DC registry.'],
                ['No disaster risk component', 'Cyclone exposure, seismic risk, and coastal flooding are not captured in DCEI v0.1.'],
                ['Population density proxy', 'District-level density is a coarse proxy for community sensitivity.'],
                ['Dataset-relative normalisation', 'Min-max normalisation means adding or removing cities shifts all scores.'],
                ['Estimated data for Tier-2 cities', 'Several smaller cities have components flagged "estimated" due to limited primary data.'],
              ].map(([title, body]) => (
                <Panel key={title} inset className="p-3">
                  <span className="font-pixel text-xs text-ink">{title}. </span>
                  <span className="font-mono text-xs text-ink-soft">{body}</span>
                </Panel>
              ))}
            </div>
          </section>

          {/* 10. Citation */}
          <section>
            <SectionAnchor id="citation" />
            <h2 className="font-pixel text-lg text-ink mb-3">10. Citation</h2>

            <Panel className="p-4 mb-4">
              <p className="font-mono text-[10px] text-ink-soft uppercase tracking-widest mb-3">Published Research · Zenodo</p>
              <Panel inset className="p-4 select-all">
                <p className="font-mono text-sm text-ink leading-relaxed">
                  Singh, R. (2026).{' '}
                  <span style={{ color: '#03CDD7' }}>DCEI: A Data Center Environmental Impact Index for India</span>
                  {' '}— Quantifying Water, Carbon, Community, and Thermal Risk for AI Infrastructure
                  Siting Across 50 Indian Cities.{' '}
                  <span style={{ color: '#60C860' }}>Zenodo</span>.{' '}
                  <a
                    href="https://doi.org/10.5281/zenodo.19298046"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="no-underline"
                    style={{ color: '#F4A020' }}
                  >
                    https://doi.org/10.5281/zenodo.19298046
                  </a>
                </p>
              </Panel>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="font-mono text-[9px] px-2 py-0.5 border border-risk-moderate text-risk-moderate">Published</span>
                <span className="font-mono text-[9px] px-2 py-0.5 border border-cube text-cube">DOI: 10.5281/zenodo.19298046</span>
                <span className="font-mono text-[9px] px-2 py-0.5 border border-band-primary text-ink">Open Access · Zenodo</span>
              </div>
            </Panel>

            <Panel inset className="p-4 mb-4">
              <p className="font-mono text-[10px] text-ink-soft uppercase tracking-widest mb-2">BibTeX</p>
              <pre className="font-mono text-xs text-ink overflow-x-auto leading-relaxed">
{`@misc{singh2026dcei,
  author       = {Singh, Rudra},
  title        = {{DCEI: A Data Center Environmental Impact Index for India}},
  year         = {2026},
  publisher    = {Zenodo},
  doi          = {10.5281/zenodo.19298046},
  url          = {https://doi.org/10.5281/zenodo.19298046}
}`}
              </pre>
            </Panel>

            <Panel inset className="p-3">
              <p className="font-mono text-xs text-ink leading-relaxed">
                This dashboard accompanies the published research. All scores, weights, and methodology
                are subject to revision. Expert feedback from hydrology, electrical engineering, and
                urban planning domains is actively solicited.
              </p>
              <p className="font-mono text-[10px] text-ink-soft mt-2">
                DCEI Framework v0.1 · Research by Rudra Singh ·
                Data: CGWB 2022 · CEA CO₂ Baseline v17 · IMD 1991–2020 · Census 2011 · NASSCOM 2024
              </p>
            </Panel>
          </section>

        </article>
      </div>
    </motion.div>
  )
}
