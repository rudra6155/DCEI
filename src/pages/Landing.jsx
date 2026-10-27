import { useState, useEffect, useRef, useCallback, useMemo, forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Panel from '../components/Panel.jsx'
import DashedBtn from '../components/DashedBtn.jsx'
import SegMeter from '../components/SegMeter.jsx'
import PixelGlyph from '../components/PixelGlyph.jsx'
import IsoBlock from '../components/iso/IsoBlock.jsx'
import IsoCube from '../components/iso/IsoCube.jsx'
import { CITIES } from '../data/cities.js'
import { scoreAllCities, DEFAULT_WEIGHTS } from '../data/scoring.js'
import { getRiskColor } from '../utils/helpers.js'

// ─── Scene wrapper ────────────────────────────────────────────
const Scene = forwardRef(function Scene({ children, className = '', id }, ref) {
  return (
    <section id={id} ref={ref} className={`relative overflow-hidden ${className}`}>
      {children}
    </section>
  )
})

// ─── Typing animation ─────────────────────────────────────────
function TypingText({ text, delay = 0, speed = 50, onComplete }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const reduced = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (reduced) {
      setDisplayed(text)
      setDone(true)
      onComplete && setTimeout(onComplete, 100)
      return
    }
    let timeout
    let i = 0
    timeout = setTimeout(() => {
      const interval = setInterval(() => {
        i++
        setDisplayed(text.slice(0, i))
        if (i >= text.length) {
          clearInterval(interval)
          setDone(true)
          onComplete && setTimeout(onComplete, 600)
        }
      }, speed)
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(timeout)
  }, [text, delay, speed, onComplete, reduced])

  return (
    <span>
      {displayed}
      {!done && (
        <span className="block-cursor inline-block w-0.5 h-5 bg-ink ml-0.5 align-middle animate-step-blink" />
      )}
    </span>
  )
}

// ─── Isometric DCEI letter bitmaps: 3 wide × 5 tall, row 0 = top ─
const LETTER_BITS = {
  D: [[1,1,0],[1,0,1],[1,0,1],[1,0,1],[1,1,0]],
  C: [[0,1,1],[1,0,0],[1,0,0],[1,0,0],[0,1,1]],
  E: [[1,1,1],[1,0,0],[1,1,0],[1,0,0],[1,1,1]],
  I: [[1,1,1],[0,1,0],[0,1,0],[0,1,0],[1,1,1]],
}
const LETTER_SEQ = ['D','C','E','I']
const LTR_W   = 3  // columns per letter
const LTR_GAP = 1  // gap columns between letters

function TitleStage() {
  const U      = 10
  const baseCx = 20
  const baseCy = 100

  const blocks = useMemo(() => {
    const result = []
    LETTER_SEQ.forEach((letter, li) => {
      const startGx = li * (LTR_W + LTR_GAP)
      LETTER_BITS[letter].forEach((row, rowIdx) => {
        const gz = 4 - rowIdx  // row 0 = top → gz=4
        row.forEach((filled, colIdx) => {
          if (!filled) return
          const gx = startGx + colIdx
          const cx = baseCx + gx * U
          const cy = baseCy + gx * (U / 2) - gz * U
          result.push({ cx, cy, gx, gz, key: `${letter}-${rowIdx}-${colIdx}` })
        })
      })
    })
    // Painter's algorithm: smaller gx+gz renders first (further back)
    return result.sort((a, b) => (a.gx + a.gz) - (b.gx + b.gz))
  }, [])

  // Purple cube hovers at gx=6 (right edge of C), gz=6 (one above letter tops)
  const cubeCx = baseCx + 6 * U                         // 80
  const cubeCy = baseCy + 6 * (U / 2) - 6 * U           // 70

  return (
    <svg
      viewBox="0 0 200 190"
      className="iso-svg w-full"
      style={{ maxWidth: 280, height: 'auto' }}
      aria-label="DCEI block letters"
    >
      {blocks.map(b => (
        <IsoBlock
          key={b.key}
          cx={b.cx} cy={b.cy}
          size={U}
          topColor="#D2D2D2"
          leftColor="#A9A9A9"
          rightColor="#BCBCBC"
          stroke="#3B3B3B"
          strokeWidth={0.5}
        />
      ))}
      <IsoCube cx={cubeCx} cy={cubeCy} size={U} />
    </svg>
  )
}

// ─── ResultRow — label / value pair ───────────────────────────
function ResultRow({ label, value, highlight = false }) {
  return (
    <div className={`result-row ${highlight ? 'highlight' : ''}`}>
      <span className="result-row__label">{label}</span>
      <span className="result-row__value">{value}</span>
    </div>
  )
}

// ─── Floor header bar ─────────────────────────────────────────
function FloorBar({ children }) {
  return <div className="floor-bar">{children}</div>
}

// ─── Main Landing page ────────────────────────────────────────
export default function Landing() {
  const [chatPhase, setChatPhase] = useState('typing')

  const scoredCities = useMemo(() => scoreAllCities(CITIES, DEFAULT_WEIGHTS), [])

  // Look up DCEI score for India map markers
  const cityScore = useCallback(
    (name) => scoredCities.find(c => c.name === name)?.DCEI_score ?? 50,
    [scoredCities]
  )

  const handleTypingComplete = useCallback(() => {
    setChatPhase('sent')
    setTimeout(() => setChatPhase('subtitle'), 1000)
  }, [])

  return (
    <motion.div
      className="page-transition bg-paper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.16 }}
    >

      {/* ═══════════════════════════════════════════════
          SCENE 1: Title Stage
      ═══════════════════════════════════════════════ */}
      <Scene className="min-h-dvh bg-paper flex flex-col items-center justify-center px-4" id="scene1">
        <div className="flex flex-col items-center gap-6 w-full max-w-lg text-center">

          {/* Isometric DCEI block letters + rolling purple cube */}
          <TitleStage />

          {/* Chat bubble */}
          <div className="relative w-full max-w-lg">
            <AnimatePresence mode="wait">
              {chatPhase === 'typing' && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.16 }}
                >
                  <Panel className="p-4 text-left">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 border border-ink bg-paper-2 flex-shrink-0 flex items-center justify-center font-pixel text-xs text-ink">
                        U
                      </div>
                      <div className="flex-1">
                        <p className="font-mono text-[10px] text-ink-soft mb-1">You · just now</p>
                        <p className="font-mono text-sm text-ink leading-relaxed">
                          <TypingText
                            text="Hey Claude, will AI take my job?"
                            delay={400}
                            speed={55}
                            onComplete={handleTypingComplete}
                          />
                        </p>
                      </div>
                    </div>
                  </Panel>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {chatPhase === 'sent' && (
                <motion.div
                  key="sent"
                  className="flex items-center justify-center gap-2 py-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.16 }}
                >
                  <PixelGlyph name="check" size={12} color="#60C860" />
                  <span className="font-mono text-sm text-ink">Message sent — processing query…</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Subtitle */}
          <AnimatePresence>
            {chatPhase === 'subtitle' && (
              <motion.div
                key="subtitle"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18 }}
                className="space-y-4 w-full"
              >
                <h1 className="font-pixel text-2xl sm:text-3xl text-ink leading-snug">
                  Every AI query has a{' '}
                  <span style={{ color: '#9D55FF' }}>hidden cost.</span>
                  <br />
                  Let us show you.
                </h1>
                <p className="font-mono text-sm text-ink-soft">
                  One message. 1.2 L of water. 4.2 g of CO₂. Multiplied by 8.5 billion queries a day.
                </p>
                <div className="flex flex-wrap gap-3 justify-center mt-4">
                  <Link to="/explorer" className="no-underline">
                    <DashedBtn variant="lavender">Explore DCEI Dashboard</DashedBtn>
                  </Link>
                  <a href="#scene2" className="no-underline">
                    <DashedBtn variant="neutral">See the journey</DashedBtn>
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {chatPhase === 'typing' && (
            <p className="font-mono text-xs text-ink-soft">
              Researching the environmental footprint of India's data center boom
            </p>
          )}

          {/* Scroll hint */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
            <PixelGlyph name="sort" size={12} color="#7D7D7D" />
          </div>
        </div>
      </Scene>

      {/* ═══════════════════════════════════════════════
          SCENE 2: The Journey
      ═══════════════════════════════════════════════ */}
      <Scene className="bg-paper-2" id="scene2">
        <FloorBar>the journey</FloorBar>

        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Pixel path SVG */}
          <div className="mb-6">
            <svg viewBox="0 0 500 120" className="w-full" shapeRendering="crispEdges">
              {Array.from({ length: 11 }).map((_, i) =>
                Array.from({ length: 3 }).map((_, j) => (
                  <rect key={`${i}-${j}`} x={i * 50} y={j * 50} width={2} height={2} fill="#D2D2D2" />
                ))
              )}
              <polyline
                points="20,90 20,60 120,60 120,30 250,30 250,60 380,60 380,20 480,20"
                fill="none"
                stroke="#9D55FF"
                strokeWidth={2}
              />
              {[[20,90],[120,30],[250,30],[380,20],[480,20]].map(([x,y], i) => (
                <rect key={i} x={x-3} y={y-3} width={6} height={6} fill="#3B3B3B" />
              ))}
              {[
                { x: 10,  y: 108, text: 'Your device' },
                { x: 230, y: 48,  text: '1,200 km fiber' },
                { x: 440, y: 36,  text: 'Mumbai DC'   },
              ].map((l, i) => (
                <text key={i} x={l.x} y={l.y} fill="#7D7D7D" fontSize="9" fontFamily="monospace">{l.text}</text>
              ))}
            </svg>
          </div>

          {/* Label / value rows */}
          <Panel className="p-0 overflow-hidden">
            {[
              { label: 'query leaves your device',  value: 'encrypted packet · cell towers or fiber'            },
              { label: '1,200 km of fiber',          value: "Mumbai handles ~38% of India's internet exchange"   },
              { label: 'Mumbai data center',         value: 'power: ~0.007 kWh · water: ~1.2 L via cooling'     },
            ].map((row, i) => (
              <div key={i} className="result-row border-b border-paper-2 last:border-b-0">
                <span className="result-row__label">{row.label}</span>
                <span className="result-row__value text-ink-soft">{row.value}</span>
              </div>
            ))}
          </Panel>
        </div>
      </Scene>

      {/* ═══════════════════════════════════════════════
          SCENE 3: The Cost
      ═══════════════════════════════════════════════ */}
      <Scene className="bg-paper" id="scene3">
        <FloorBar>the cost</FloorBar>

        <div className="max-w-3xl mx-auto px-4 py-8">
          <p className="font-pixel text-lg text-ink mb-4">Per query cost</p>

          <Panel className="p-0 overflow-hidden mb-4">
            <ResultRow label="water consumed"   value="1.2 L"      />
            <ResultRow label="electricity used" value="0.007 kWh"  />
            <ResultRow label="CO₂ emitted"      value="4.2 g"      />
          </Panel>

          {/* Scale-up table — level-done style */}
          <Panel className="p-0 overflow-hidden">
            <ResultRow
              label="× India — 8.5 billion queries per day"
              value="daily totals"
              highlight
            />
            <ResultRow label="water / day"       value="10.2 billion litres"  />
            <ResultRow label="electricity / day"  value="59.5 million kWh"    />
            <ResultRow label="CO₂ / day"          value="35.7 billion grams"  />
          </Panel>

          <p className="font-mono text-[10px] text-ink-soft mt-3">
            Based on India avg. grid intensity · GPU inference + infrastructure overhead · cooling tower evaporation
          </p>
        </div>
      </Scene>

      {/* ═══════════════════════════════════════════════
          SCENE 4: The Impact
      ═══════════════════════════════════════════════ */}
      <Scene className="bg-paper-2" id="scene4">
        <FloorBar>the impact</FloorBar>

        <div className="max-w-5xl mx-auto px-4 py-8">
          <h2 className="font-pixel text-xl text-ink mb-6">India's data center footprint</h2>

          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* India map — colors derived from scoreAllCities */}
            <div className="flex-shrink-0">
              <Panel className="p-2" style={{ width: 260 }}>
                <div className="relative" style={{ height: 340 }}>
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 260 340" shapeRendering="crispEdges">
                    <polygon
                      points="70,20 190,20 230,55 240,95 230,130 220,162 208,192 190,232 170,272 152,312 135,332 115,312 95,280 74,248 54,218 44,190 34,162 24,130 24,95 34,55"
                      fill="#F0F0EE"
                      stroke="#3B3B3B"
                      strokeWidth="1"
                    />
                    {[
                      { x: 78,  y: 192, name: 'Mumbai'    },
                      { x: 122, y: 70,  name: 'Delhi'     },
                      { x: 158, y: 238, name: 'Chennai'   },
                      { x: 133, y: 228, name: 'Bengaluru' },
                      { x: 140, y: 196, name: 'Hyderabad' },
                      { x: 192, y: 142, name: 'Kolkata'   },
                    ].map(({ x, y, name }) => (
                      <g key={name}>
                        <rect
                          x={x-4} y={y-4} width={8} height={8}
                          fill={getRiskColor(cityScore(name))}
                        />
                        <text x={x+7} y={y+3} fill="#3B3B3B" fontSize="6" fontFamily="monospace">{name}</text>
                      </g>
                    ))}
                  </svg>
                  {/* Legend */}
                  <div className="absolute top-1 right-1 space-y-1 bg-paper border border-ink/20 p-1">
                    {[
                      { color: '#E03838', label: 'critical' },
                      { color: '#F4A020', label: 'high'     },
                      { color: '#60C860', label: 'moderate' },
                      { color: '#4AB0E8', label: 'low'      },
                    ].map(l => (
                      <div key={l.label} className="flex items-center gap-1">
                        <div className="w-2 h-2 flex-shrink-0" style={{ background: l.color }} />
                        <span className="font-mono text-[8px] text-ink-soft">{l.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="absolute bottom-1 left-1">
                    <span className="font-mono text-[7px] text-ink-soft">NASSCOM 2024 · DCEI scores</span>
                  </div>
                </div>
              </Panel>
            </div>

            {/* Label / value rows */}
            <div className="flex-1 w-full">
              <Panel className="p-0 overflow-hidden">
                {[
                  { label: 'projected water use by 2030',    value: '358 billion L/year'  },
                  { label: 'DC electricity demand by 2032',  value: '13.6 GW'             },
                  { label: 'DCs in high water stress zones', value: '60–80%'              },
                  { label: 'DCs in water-scarce Mumbai',     value: '70+'                 },
                ].map((row, i) => (
                  <ResultRow key={i} label={row.label} value={row.value} />
                ))}
              </Panel>
              <p className="font-mono text-[10px] text-ink-soft mt-2">
                Equal to 143,000 Olympic pools/year · Capacity of Kerala + Tamil Nadu combined
                · CGWB Semi-Critical classification · 2,700 CDD
              </p>
            </div>
          </div>
        </div>
      </Scene>

      {/* ═══════════════════════════════════════════════
          SCENE 5: The Framework
      ═══════════════════════════════════════════════ */}
      <Scene className="bg-paper" id="scene5">
        <FloorBar>the framework</FloorBar>

        <div className="max-w-3xl mx-auto px-4 py-8">
          <h2 className="font-pixel text-xl text-ink mb-2">
            DCEI measures{' '}
            <span style={{ color: '#9D55FF' }}>what no one is measuring.</span>
          </h2>
          <p className="font-mono text-sm text-ink-soft mb-6 max-w-xl">
            A composite environmental suitability index for data center site selection in India.
          </p>

          {/* Options-screen style rows: label | seg-meter | weight */}
          <Panel className="p-0 overflow-hidden mb-4">
            {[
              {
                label: 'water stress index',
                desc:  'CGWB classification · per-capita availability · seasonal variability',
                weight: 35,
              },
              {
                label: 'carbon intensity',
                desc:  'CEA grid emission factors · renewable penetration · grid reliability',
                weight: 25,
              },
              {
                label: 'community impact',
                desc:  'Population density · utility competition · existing DC load',
                weight: 20,
              },
              {
                label: 'thermal load',
                desc:  'Wet-bulb temp · humidity · cooling degree days · urban heat',
                weight: 20,
              },
            ].map((row, i) => (
              <div
                key={i}
                className="options-row flex-wrap gap-y-2"
                style={{ alignItems: 'flex-start' }}
              >
                <div className="flex-1 min-w-0">
                  <div className="options-row__label">{row.label}</div>
                  <div className="font-mono text-[10px] text-ink-soft mt-0.5">{row.desc}</div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 pt-0.5">
                  <SegMeter value={row.weight} riskLevel="moderate" size={8} gap={1} />
                  <span className="font-mono text-xs text-ink tabular-nums w-8 text-right">{row.weight}%</span>
                </div>
              </div>
            ))}
          </Panel>

          <p className="font-mono text-xs text-ink-soft">
            Scoring <span className="text-ink">50 Indian cities</span> across{' '}
            <span className="text-ink">16+ environmental data points</span> each.
          </p>
        </div>
      </Scene>

      {/* ═══════════════════════════════════════════════
          SCENE 6: Enter the Dashboard
      ═══════════════════════════════════════════════ */}
      <Scene className="bg-paper-2" id="scene6">
        <FloorBar>enter the dashboard</FloorBar>

        <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
          <h2 className="font-pixel text-2xl sm:text-3xl text-ink leading-tight">
            Explore 50 cities.<br />4 indices. Zero greenwashing.
          </h2>
          <p className="font-mono text-sm text-ink-soft">
            Real government data. Transparent methodology. Honest scores.
          </p>

          {/* CTA menu rows */}
          <Panel className="p-0 overflow-hidden">
            <Link to="/explorer" className="menu-row active no-underline" data-active="true">
              <PixelGlyph name="city" size={10} color="#3B3B3B" className="mr-2 flex-shrink-0" />
              launch dcei dashboard →
            </Link>
            <Link to="/methodology" className="menu-row no-underline">
              <PixelGlyph name="chart" size={10} color="#3B3B3B" className="mr-2 flex-shrink-0" />
              read methodology
            </Link>
          </Panel>

          {/* Stats label/value rows */}
          <Panel className="p-0 overflow-hidden">
            {[
              { label: 'cities scored',     value: '50'   },
              { label: 'variables per city', value: '16+'  },
              { label: 'sub-indices',       value: '4'    },
              { label: 'government data',   value: '100%' },
            ].map((row, i) => (
              <ResultRow key={i} label={row.label} value={row.value} />
            ))}
          </Panel>

          {/* Credits */}
          <Panel className="p-3">
            <p className="font-mono text-xs text-ink mb-1">
              DCEI Framework v0.1 · Research by{' '}
              <span className="text-ink font-bold">Rudra Singh</span>
            </p>
            <p className="font-mono text-[10px] text-ink-soft">
              Data: CGWB 2022 · CEA CO₂ Baseline v17 · IMD Normals 1991–2020 · Census 2011 · NASSCOM 2024
            </p>
          </Panel>
        </div>

        {/* Footer strip */}
        <div className="footer-strip">
          DCEI · Data Center Environmental Impact Framework · India · v0.1 · Open Methodology · Zenodo ·
          Water Stress · Carbon Intensity · Community Impact · Thermal Load · 50 Cities · 16+ Variables ·
          DCEI · Data Center Environmental Impact Framework · India · v0.1 ·
        </div>
      </Scene>

    </motion.div>
  )
}
