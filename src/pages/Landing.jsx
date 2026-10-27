import { useState, useEffect, useRef, useCallback, forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import Panel from '../components/Panel.jsx'
import PageHeader from '../components/PageHeader.jsx'
import DashedBtn from '../components/DashedBtn.jsx'
import SegMeter from '../components/SegMeter.jsx'
import PixelGlyph from '../components/PixelGlyph.jsx'
import IsoCube from '../components/iso/IsoCube.jsx'

// ─── Scene wrapper — forwardRef fix ─────────────────────────────────────────
const Scene = forwardRef(function Scene({ children, className = '', id }, ref) {
  return (
    <section
      id={id}
      ref={ref}
      className={`relative min-h-dvh flex items-center justify-center overflow-hidden ${className}`}
    >
      {children}
    </section>
  )
})

// ─── Typing animation ────────────────────────────────────────────────────────
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

// ─── StatCard — panel with score counter ─────────────────────────────────────
function StatCard({ glyphName, title, value, suffix, sub, riskLevel = 'moderate' }) {
  const numColor = riskLevel === 'critical' ? '#FF3D8F' : riskLevel === 'high' ? '#F4A020' : '#03CDD7'
  const glowCls  = riskLevel === 'critical' ? 'text-glow-pink' : riskLevel === 'high' ? '' : 'text-glow-cube'
  return (
    <Panel className="p-4 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <PixelGlyph name={glyphName} size={12} color="#3B3B3B" />
        <span className="font-mono text-[10px] text-ink-soft uppercase tracking-wider">{title}</span>
      </div>
      <p className={`font-num text-4xl leading-none ${glowCls}`} style={{ color: numColor }}>
        {value}<span className="font-mono text-sm text-ink-soft ml-1">{suffix}</span>
      </p>
      <SegMeter value={riskLevel === 'high' ? 75 : riskLevel === 'critical' ? 90 : 50} riskLevel={riskLevel} size={8} gap={1} />
      {sub && <p className="font-mono text-[10px] text-ink-soft leading-snug">{sub}</p>}
    </Panel>
  )
}

// ─── FrameworkCard — index card with SegMeter weight bar ──────────────────────
function FrameworkCard({ glyphName, title, desc, weight }) {
  const pct = parseInt(weight, 10)
  return (
    <Panel className="p-4 flex flex-col gap-2">
      <div className="flex items-center gap-2 mb-1">
        <PixelGlyph name={glyphName} size={12} color="#3B3B3B" />
        <span className="font-pixel text-xs text-ink">{title}</span>
      </div>
      <p className="font-mono text-xs text-ink-soft leading-relaxed">{desc}</p>
      <div className="mt-auto pt-2 flex items-center gap-2">
        <SegMeter value={pct} riskLevel="moderate" size={6} gap={1} />
        <span className="font-mono text-[10px] text-ink-soft">{weight}</span>
      </div>
    </Panel>
  )
}

// ─── Main Landing page ────────────────────────────────────────────────────────
export default function Landing() {
  const [chatPhase, setChatPhase] = useState('typing')

  const scene2Ref = useRef(null)
  const scene3Ref = useRef(null)
  const scene4Ref = useRef(null)
  const scene5Ref = useRef(null)

  const scene3InView = useInView(scene3Ref, { once: true, margin: '-100px' })

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

      {/* ═══════════════════════════════════════════════════
          SCENE 1: The Question
      ═══════════════════════════════════════════════════ */}
      <Scene className="bg-paper" id="scene1">
        <div className="relative z-10 flex flex-col items-center gap-8 px-4 max-w-2xl mx-auto text-center w-full">

          {/* Animated teal cube */}
          <svg width="60" height="50" className="mx-auto">
            <IsoCube cx={30} cy={40} size={18} />
          </svg>

          {/* DCEI label */}
          <div className="border border-ink px-3 py-1 font-mono text-xs text-ink-soft uppercase tracking-widest">
            DCEI Framework · Environmental Impact Research
          </div>

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
                  <span className="text-glow-cube" style={{ color: '#03CDD7' }}>hidden cost.</span>
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

          {/* Scroll indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
            <PixelGlyph name="sort" size={12} color="#818181" />
          </div>
        </div>
      </Scene>

      {/* ═══════════════════════════════════════════════════
          SCENE 2: The Journey
      ═══════════════════════════════════════════════════ */}
      <Scene className="bg-paper-2" id="scene2" ref={scene2Ref}>
        <div className="relative z-10 max-w-5xl mx-auto px-4 w-full py-16">
          <div className="mb-8">
            <p className="font-mono text-[10px] text-ink-soft uppercase tracking-widest mb-1">the journey</p>
            <h2 className="font-pixel text-xl text-ink">From question to data center</h2>
          </div>

          {/* Journey flow */}
          <div className="flex flex-col lg:flex-row items-center gap-10 mb-8">
            {/* Pixel path SVG */}
            <div className="flex-1">
              <svg viewBox="0 0 500 160" className="w-full" shapeRendering="crispEdges">
                {/* Dotted grid */}
                {Array.from({ length: 11 }).map((_, i) =>
                  Array.from({ length: 4 }).map((_, j) => (
                    <rect key={`${i}-${j}`} x={i * 50} y={j * 50} width={2} height={2} fill="#EDEDEB" />
                  ))
                )}
                {/* Stepped path (pixel style) */}
                <polyline
                  points="20,130 20,80 120,80 120,50 250,50 250,80 380,80 380,40 480,40"
                  fill="none"
                  stroke="#03CDD7"
                  strokeWidth={2}
                />
                {/* Node squares */}
                {[[20,130],[120,50],[250,50],[380,40],[480,40]].map(([x,y], i) => (
                  <rect key={i} x={x-3} y={y-3} width={6} height={6} fill="#3B3B3B" />
                ))}
                {/* Labels */}
                {[
                  { x: 20, y: 150, text: 'Your device' },
                  { x: 250, y: 68, text: '1,200 km fiber' },
                  { x: 450, y: 58, text: 'Mumbai DC' },
                ].map((l, i) => (
                  <text key={i} x={l.x} y={l.y} fill="#818181" fontSize="9" fontFamily="monospace">
                    {l.text}
                  </text>
                ))}
              </svg>
            </div>

            {/* Server rack — pixel art */}
            <div className="flex-shrink-0">
              <svg width="100" height="160" viewBox="0 0 100 160" shapeRendering="crispEdges">
                {/* Rack outer */}
                <rect x="5" y="5" width="90" height="150" fill="#EDEDEB" stroke="#3B3B3B" strokeWidth="1"/>
                {/* Server units */}
                {[20, 65, 110].map((y, i) => (
                  <g key={i}>
                    <rect x="12" y={y} width="76" height="28" fill="#F0F0EE" stroke="#3B3B3B" strokeWidth="1"/>
                    {/* LEDs */}
                    <rect x={72} y={y+10} width={4} height={4} fill="#60C860"/>
                    <rect x={78} y={y+10} width={4} height={4} fill="#4AB0E8"/>
                    <rect x={84} y={y+10} width={4} height={4} fill="#F4A020"/>
                    {/* Drive bays */}
                    {[0,1,2].map(j => (
                      <rect key={j} x={15+j*14} y={y+6} width={10} height={16} fill="#FFFFFF" stroke="#3B3B3B" strokeWidth="1"/>
                    ))}
                  </g>
                ))}
                <text x="50" y="155" textAnchor="middle" fill="#818181" fontSize="7" fontFamily="monospace">
                  Mumbai Tier-IV DC
                </text>
              </svg>
            </div>
          </div>

          {/* Journey steps */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { glyph: 'city',  title: 'Query leaves your device',  desc: 'Encrypted packet traveling through cell towers or fiber' },
              { glyph: 'bolt',  title: '1,200 km of fiber',         desc: "Mumbai handles ~38% of India's internet exchange traffic" },
              { glyph: 'water', title: 'Mumbai Data Center',        desc: 'Power draw: ~0.007 kWh. Water: ~1.2 L via cooling towers' },
            ].map((step, i) => (
              <Panel key={i} className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <PixelGlyph name={step.glyph} size={12} color="#3B3B3B" />
                  <p className="font-pixel text-xs text-ink">{step.title}</p>
                </div>
                <p className="font-mono text-xs text-ink-soft leading-relaxed">{step.desc}</p>
              </Panel>
            ))}
          </div>
        </div>
      </Scene>

      {/* ═══════════════════════════════════════════════════
          SCENE 3: The Cost
      ═══════════════════════════════════════════════════ */}
      <Scene className="bg-paper" id="scene3" ref={scene3Ref}>
        <div className="relative z-10 max-w-4xl mx-auto px-4 w-full py-16">
          <div className="mb-8">
            <p className="font-mono text-[10px] text-ink-soft uppercase tracking-widest mb-1">the cost</p>
            <h2 className="font-pixel text-xl text-ink mb-1">Per Query Cost</h2>
            <p className="font-mono text-sm text-ink-soft">What one AI query costs the planet</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <StatCard
              glyphName="water"
              title="Water consumed"
              value="1.2"
              suffix="L"
              riskLevel="high"
              sub="Per AI query via cooling towers"
            />
            <StatCard
              glyphName="bolt"
              title="Electricity used"
              value="0.007"
              suffix="kWh"
              riskLevel="moderate"
              sub="GPU inference + infrastructure overhead"
            />
            <StatCard
              glyphName="leaf"
              title="CO₂ emitted"
              value="4.2"
              suffix="g"
              riskLevel="high"
              sub="Based on India avg. grid intensity"
            />
          </div>

          {/* Scale-up panel */}
          <Panel className="p-5">
            <p className="font-pixel text-sm text-ink mb-4">
              India processes <span className="text-glow-pink" style={{ color: '#FF3D8F' }}>8.5 billion</span> AI queries daily.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Water/day',       value: '10.2 Billion L',  level: 'high'     },
                { label: 'Electricity/day', value: '59.5 M kWh',      level: 'moderate' },
                { label: 'CO₂/day',         value: '35.7 Billion g',  level: 'critical' },
              ].map((item) => (
                <div key={item.label}>
                  <p className={`font-num text-3xl leading-none ${item.level === 'critical' ? 'text-glow-pink' : item.level === 'high' ? '' : 'text-glow-cube'}`}
                     style={{ color: item.level === 'critical' ? '#FF3D8F' : item.level === 'high' ? '#F4A020' : '#03CDD7' }}>
                    {item.value}
                  </p>
                  <SegMeter value={item.level === 'critical' ? 95 : item.level === 'high' ? 75 : 55} riskLevel={item.level} size={8} gap={1} className="my-1" />
                  <p className="font-mono text-[10px] text-ink-soft uppercase tracking-wider">{item.label}</p>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </Scene>

      {/* ═══════════════════════════════════════════════════
          SCENE 4: The Impact
      ═══════════════════════════════════════════════════ */}
      <Scene className="bg-paper-2" id="scene4" ref={scene4Ref}>
        <div className="relative z-10 max-w-6xl mx-auto px-4 w-full py-16">
          <div className="mb-8">
            <p className="font-mono text-[10px] text-ink-soft uppercase tracking-widest mb-1">the impact</p>
            <h2 className="font-pixel text-xl text-ink">India's data center footprint</h2>
          </div>

          <div className="flex flex-col lg:flex-row items-start gap-10">
            {/* Pixel India map */}
            <div className="flex-shrink-0">
              <Panel className="p-2" style={{ width: 280 }}>
                <div className="relative" style={{ height: 360 }}>
                  {/* Simple India silhouette hint */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 280 360" shapeRendering="crispEdges">
                    {/* Simplified India polygon */}
                    <polygon
                      points="80,20 200,20 240,60 250,100 240,140 230,170 220,200 200,240 180,280 160,320 140,340 120,320 100,290 80,260 60,230 50,200 40,170 30,140 30,100 40,60"
                      fill="#F0F0EE"
                      stroke="#3B3B3B"
                      strokeWidth="1"
                    />
                    {/* City dot squares */}
                    {[
                      { x: 85,  y: 200, name: 'Mumbai',    level: 'critical' },
                      { x: 130, y: 75,  name: 'Delhi',     level: 'critical' },
                      { x: 165, y: 250, name: 'Chennai',   level: 'high'     },
                      { x: 140, y: 240, name: 'Bengaluru', level: 'high'     },
                      { x: 148, y: 205, name: 'Hyderabad', level: 'high'     },
                      { x: 200, y: 150, name: 'Kolkata',   level: 'moderate' },
                    ].map(({ x, y, name, level }) => {
                      const colors = { critical: '#E03838', high: '#F4A020', moderate: '#60C860', low: '#4AB0E8' }
                      return (
                        <g key={name}>
                          <rect x={x-3} y={y-3} width={6} height={6} fill={colors[level]} />
                          <text x={x+6} y={y+3} fill="#3B3B3B" fontSize="6" fontFamily="monospace">{name}</text>
                        </g>
                      )
                    })}
                  </svg>
                  {/* Legend */}
                  <div className="absolute top-1 right-1 space-y-1">
                    {[
                      { color: '#E03838', label: 'Critical' },
                      { color: '#F4A020', label: 'High'     },
                      { color: '#60C860', label: 'Moderate' },
                    ].map(l => (
                      <div key={l.label} className="flex items-center gap-1">
                        <div className="w-2 h-2" style={{ background: l.color }} />
                        <span className="font-mono text-[8px] text-ink-soft">{l.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="absolute bottom-1 left-1 right-1 flex justify-between">
                    <span className="font-mono text-[8px] text-ink-soft">India · DC Concentration</span>
                    <span className="font-mono text-[8px] text-ink-soft">NASSCOM 2024</span>
                  </div>
                </div>
              </Panel>
            </div>

            {/* Stat cards */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { num: '358 Billion', label: 'litres/year by 2030',       desc: 'Projected annual DC water use — equal to 143,000 Olympic pools',                       bar: 78, level: 'high'     },
                { num: '13.6 GW',    label: 'electricity demand by 2032', desc: 'Equivalent to the entire installed capacity of Kerala + Tamil Nadu combined',           bar: 65, level: 'moderate' },
                { num: '60–80%',     label: 'DCs in high water stress',   desc: 'Indian data centers operating in semi-critical or worse CGWB categories',              bar: 70, level: 'high'     },
                { num: '70+',        label: 'DCs in water-scarce Mumbai', desc: "Mumbai — Semi-Critical groundwater, 2,700 CDD — hosts India's densest DC cluster",     bar: 90, level: 'critical' },
              ].map((s, i) => (
                <Panel key={i} className="p-4">
                  <p className={`font-num text-3xl leading-none mb-1 ${s.level === 'critical' ? 'text-glow-pink' : s.level === 'moderate' ? 'text-glow-cube' : ''}`}
                     style={{ color: s.level === 'critical' ? '#FF3D8F' : s.level === 'high' ? '#F4A020' : '#03CDD7' }}>
                    {s.num}
                  </p>
                  <p className="font-mono text-xs text-ink mb-1">{s.label}</p>
                  <p className="font-mono text-[10px] text-ink-soft mb-2 leading-relaxed">{s.desc}</p>
                  <SegMeter value={s.bar} riskLevel={s.level} size={8} gap={1} />
                </Panel>
              ))}
            </div>
          </div>
        </div>
      </Scene>

      {/* ═══════════════════════════════════════════════════
          SCENE 5: The Framework
      ═══════════════════════════════════════════════════ */}
      <Scene className="bg-paper" id="scene5" ref={scene5Ref}>
        <div className="relative z-10 max-w-5xl mx-auto px-4 w-full py-16">
          <div className="mb-8">
            <p className="font-mono text-[10px] text-ink-soft uppercase tracking-widest mb-1">the framework</p>
            <h2 className="font-pixel text-xl text-ink mb-2">
              DCEI measures{' '}
              <span className="text-glow-cube" style={{ color: '#03CDD7' }}>what no one is measuring.</span>
            </h2>
            <p className="font-mono text-sm text-ink-soft max-w-2xl">
              A composite environmental suitability index for data center site selection in India.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            <FrameworkCard
              glyphName="water"
              title="Water Stress Index"
              desc="How water-scarce is this location? CGWB groundwater classification, per-capita availability, and seasonal variability."
              weight="35%"
            />
            <FrameworkCard
              glyphName="bolt"
              title="Carbon Intensity"
              desc="How dirty is the power grid? CEA grid emission factors, renewable penetration, and reliability metrics."
              weight="25%"
            />
            <FrameworkCard
              glyphName="city"
              title="Community Impact"
              desc="Who lives next door? Population density, noise externalities, utility competition, and existing DC load."
              weight="20%"
            />
            <FrameworkCard
              glyphName="chart"
              title="Thermal Load"
              desc="How hard must cooling work? Wet-bulb temperature, humidity, cooling degree days, and urban heat island intensity."
              weight="20%"
            />
          </div>

          <p className="font-mono text-xs text-ink-soft text-center">
            Scoring <span className="text-ink">50 Indian cities</span> across{' '}
            <span className="text-ink">16+ environmental data points</span> each.
          </p>
        </div>
      </Scene>

      {/* ═══════════════════════════════════════════════════
          SCENE 6: Enter the Dashboard (CTA)
      ═══════════════════════════════════════════════════ */}
      <Scene className="bg-paper-2" id="scene6">
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center py-16">
          <div className="space-y-6">
            <p className="font-mono text-[10px] text-ink-soft uppercase tracking-widest">enter the dashboard</p>

            <h2 className="font-pixel text-3xl sm:text-4xl text-ink leading-tight">
              Explore 50 cities.<br />4 indices. Zero greenwashing.
            </h2>
            <p className="font-mono text-sm text-ink-soft">
              Real government data. Transparent methodology. Honest scores.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/explorer" className="no-underline">
                <DashedBtn variant="lavender">Launch DCEI Dashboard</DashedBtn>
              </Link>
              <Link to="/methodology" className="no-underline">
                <DashedBtn variant="neutral">Read Methodology</DashedBtn>
              </Link>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap justify-center gap-6 pt-4">
              {[
                { n: '50',   label: 'Cities',          color: '#03CDD7', glow: 'text-glow-cube' },
                { n: '16+',  label: 'Variables',       color: '#F4A020', glow: '' },
                { n: '4',    label: 'Sub-Indices',     color: '#FF3D8F', glow: 'text-glow-pink' },
                { n: '100%', label: 'Government Data', color: '#60C860', glow: '' },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <p className={`font-num text-4xl leading-none ${s.glow}`} style={{ color: s.color }}>{s.n}</p>
                  <p className="font-mono text-[10px] text-ink-soft uppercase tracking-wider mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Credits */}
            <Panel className="p-3 inline-block text-left">
              <p className="font-mono text-xs text-ink mb-1">
                DCEI Framework v0.1 · Research by{' '}
                <span className="text-ink font-bold">Rudra Singh</span>
              </p>
              <p className="font-mono text-[10px] text-ink-soft">
                Data: CGWB 2022 · CEA CO₂ Baseline v17 · IMD Normals 1991–2020 · Census 2011 · NASSCOM 2024
              </p>
            </Panel>
          </div>

        </div>
      </Scene>
    </motion.div>
  )
}
