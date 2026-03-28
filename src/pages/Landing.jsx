import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useInView } from 'framer-motion'

// ─── useCountUp hook ────────────────────────────────────────────────────────
function useCountUp(target, duration = 2000, trigger = true) {
  const [value, setValue] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    if (!trigger) return
    let start = null
    const animate = (ts) => {
      if (!start) start = ts
      const elapsed = ts - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(eased * target)
      if (progress < 1) rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [target, duration, trigger])

  return value
}

// ─── Scene wrapper ───────────────────────────────────────────────────────────
const Scene = ({ children, className = '', id }) => (
  <section
    id={id}
    className={`relative min-h-screen flex items-center justify-center overflow-hidden ${className}`}
  >
    {children}
  </section>
)

// ─── Typing animation ────────────────────────────────────────────────────────
function TypingText({ text, delay = 0, speed = 50, onComplete }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
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
  }, [text, delay, speed, onComplete])

  return (
    <span>
      {displayed}
      {!done && <span className="inline-block w-0.5 h-5 bg-blue-400 ml-0.5 animate-pulse" />}
    </span>
  )
}

// ─── Pulsing city dot ────────────────────────────────────────────────────────
function CityDot({ x, y, name, color = '#ef4444', delay = 0 }) {
  return (
    <motion.div
      className="absolute"
      style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%,-50%)' }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
    >
      {/* Outer pulse */}
      <motion.div
        className="absolute rounded-full"
        style={{ width: 28, height: 28, background: `${color}20`, top: -10, left: -10 }}
        animate={{ scale: [1, 1.8, 1], opacity: [0.8, 0, 0.8] }}
        transition={{ duration: 2.2, repeat: Infinity, delay }}
      />
      {/* Inner dot */}
      <div
        className="w-2.5 h-2.5 rounded-full relative z-10"
        style={{ background: color, boxShadow: `0 0 8px ${color}` }}
      />
      {/* Label */}
      <div
        className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-semibold whitespace-nowrap"
        style={{ color }}
      >
        {name}
      </div>
    </motion.div>
  )
}

// ─── Stat card ───────────────────────────────────────────────────────────────
function StatCard({ icon, title, value, sub, trigger, delay = 0, targetNum, decimals = 0, suffix = '' }) {
  const count = useCountUp(targetNum, 1800, trigger)
  const displayed = decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString()

  return (
    <motion.div
      className="glass-card p-5 flex flex-col gap-2"
      initial={{ opacity: 0, y: 30 }}
      animate={trigger ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.6 }}
    >
      <div className="text-2xl">{icon}</div>
      <p className="text-xs text-slate-500 uppercase tracking-wider">{title}</p>
      <p className="text-3xl font-bold font-mono text-white">
        {displayed}{suffix}
      </p>
      {sub && <p className="text-xs text-slate-400">{sub}</p>}
    </motion.div>
  )
}

// ─── Framework card ──────────────────────────────────────────────────────────
function FrameworkCard({ icon, title, desc, weight, delay = 0 }) {
  return (
    <motion.div
      className="glass-card p-6 cursor-pointer"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      whileHover={{ y: -6, boxShadow: '0 0 30px rgba(59,130,246,0.2)' }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-base font-bold text-white mb-1">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed mb-3">{desc}</p>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: weight }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: delay + 0.3 }}
          />
        </div>
        <span className="text-xs text-slate-500 font-mono">{weight}</span>
      </div>
    </motion.div>
  )
}

// ─── Main Landing page ───────────────────────────────────────────────────────
export default function Landing() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [chatPhase, setChatPhase] = useState('typing') // typing | sent | subtitle
  const [particles, setParticles] = useState([])

  // Scene refs for inView detection
  const scene2Ref = useRef(null)
  const scene3Ref = useRef(null)
  const scene4Ref = useRef(null)
  const scene5Ref = useRef(null)

  const scene3InView = useInView(scene3Ref, { once: true, margin: '-100px' })
  const scene4InView = useInView(scene4Ref, { once: true, margin: '-100px' })

  // Mouse glow
  const handleMouseMove = useCallback((e) => {
    setMousePos({ x: e.clientX, y: e.clientY })
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  const handleTypingComplete = () => {
    // Generate particles
    const pts = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 200,
      y: (Math.random() - 0.5) * 180,
      rot: Math.random() * 360,
    }))
    setParticles(pts)
    setChatPhase('sent')
    setTimeout(() => setChatPhase('subtitle'), 1000)
  }

  const CITY_DOTS = [
    { x: 17, y: 62, name: 'Mumbai', color: '#ef4444', delay: 0.2 },
    { x: 32, y: 29, name: 'Delhi', color: '#f97316', delay: 0.4 },
    { x: 55, y: 78, name: 'Chennai', color: '#ef4444', delay: 0.6 },
    { x: 40, y: 75, name: 'Bengaluru', color: '#f59e0b', delay: 0.8 },
    { x: 44, y: 62, name: 'Hyderabad', color: '#f97316', delay: 1.0 },
    { x: 75, y: 46, name: 'Kolkata', color: '#f59e0b', delay: 1.2 },
  ]

  return (
    <motion.div
      className="page-transition"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Cursor glow */}
      <div
        className="fixed pointer-events-none z-0"
        style={{
          left: mousePos.x - 250,
          top: mousePos.y - 250,
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)',
          transition: 'left 0.1s, top 0.1s',
        }}
      />

      {/* ═══════════════════════════════════════════════════
          SCENE 1: The Question
      ═══════════════════════════════════════════════════ */}
      <Scene className="bg-[#050a12]" id="scene1">
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full"
            style={{ background: 'radial-gradient(ellipse, rgba(59,130,246,0.06) 0%, transparent 70%)' }}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-10 px-4 max-w-2xl mx-auto text-center">
          {/* DCEI logo pill */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-xs text-blue-400 font-medium"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            DCEI Framework · Environmental Impact Research
          </motion.div>

          {/* Chat bubble */}
          <div className="relative w-full">
            <AnimatePresence mode="wait">
              {chatPhase === 'typing' && (
                <motion.div
                  key="chat"
                  className="glass-card p-6 text-left relative"
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex-shrink-0 flex items-center justify-center text-xs font-bold">
                      U
                    </div>
                    <div className="flex-1">
                      <p className="text-[11px] text-slate-500 mb-1">You · just now</p>
                      <p className="text-base text-white leading-relaxed">
                        <TypingText
                          text="Hey Claude, will AI take my job? 🤔"
                          delay={400}
                          speed={55}
                          onComplete={handleTypingComplete}
                        />
                      </p>
                    </div>
                  </div>

                  {/* Particles on send */}
                  <AnimatePresence>
                    {particles.map(p => (
                      <motion.div
                        key={p.id}
                        className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full"
                        style={{ background: ['#60a5fa','#a78bfa','#34d399','#f59e0b'][p.id % 4] }}
                        initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                        animate={{ x: p.x, y: p.y, opacity: 0, scale: 0, rotate: p.rot }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sent confirmation */}
            <AnimatePresence>
              {chatPhase === 'sent' && (
                <motion.div
                  key="sent"
                  className="flex items-center justify-center gap-2 py-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-emerald-400 text-sm font-medium">Message sent — processing query…</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Subtitle */}
          <AnimatePresence>
            {chatPhase === 'subtitle' && (
              <motion.div
                key="subtitle"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-4"
              >
                <p className="text-2xl sm:text-3xl font-bold text-white leading-snug">
                  Every AI query has a{' '}
                  <span className="text-gradient">hidden cost.</span>
                  <br />
                  Let us show you.
                </p>
                <p className="text-slate-400 text-base">
                  One message. 1.2 L of water. 4.2 g of CO₂. Multiplied by 8.5 billion queries a day.
                </p>
                <div className="flex flex-wrap gap-3 justify-center mt-6">
                  <Link to="/explorer" className="btn-primary text-white no-underline">
                    Explore DCEI Dashboard →
                  </Link>
                  <a href="#scene2" className="btn-secondary text-slate-300 no-underline">
                    See the journey ↓
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Initial subtitle (before typing completes fully) */}
          {chatPhase === 'typing' && (
            <motion.p
              className="text-slate-500 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              Researching the environmental footprint of India's data center boom
            </motion.p>
          )}
        </div>

        {/* Scroll chevron */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bounce-chevron">
          <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </Scene>

      {/* ═══════════════════════════════════════════════════
          SCENE 2: The Journey
      ═══════════════════════════════════════════════════ */}
      <Scene className="bg-[#050a12] bg-grid" id="scene2" ref={scene2Ref}>
        <div className="relative z-10 max-w-5xl mx-auto px-4 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <p className="text-blue-400 text-sm font-medium uppercase tracking-widest mb-3">The Journey</p>
            <h2 className="text-4xl font-bold text-white">From question to data center</h2>
          </motion.div>

          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* SVG path animation */}
            <div className="flex-1 relative">
              <svg viewBox="0 0 500 200" className="w-full" style={{ overflow: 'visible' }}>
                {/* Grid dots */}
                {Array.from({ length: 6 }).map((_, i) =>
                  Array.from({ length: 3 }).map((_, j) => (
                    <circle
                      key={`${i}-${j}`}
                      cx={i * 100}
                      cy={j * 100}
                      r={1.5}
                      fill="rgba(255,255,255,0.06)"
                    />
                  ))
                )}
                {/* Glowing path */}
                <motion.path
                  d="M 20 150 C 120 150, 150 50, 250 80 C 350 110, 380 40, 480 50"
                  fill="none"
                  stroke="url(#pathGrad)"
                  strokeWidth={2.5}
                  strokeDasharray="600"
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: 600 }}
                  whileInView={{ strokeDashoffset: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 2.5, ease: 'easeInOut' }}
                />
                <defs>
                  <linearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                    <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.9" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                {/* Traveling dots */}
                {[0, 0.33, 0.66].map((phase, i) => (
                  <motion.circle
                    key={i}
                    r={5}
                    fill={['#60a5fa', '#a78bfa', '#34d399'][i]}
                    filter="url(#glow)"
                    style={{
                      offsetPath: "path('M 20 150 C 120 150, 150 50, 250 80 C 350 110, 380 40, 480 50')",
                    }}
                    initial={{ offsetDistance: `${phase * 100}%` }}
                    animate={{ offsetDistance: [`${phase * 100}%`, `${(phase + 1) * 100 % 100}%`, `${phase * 100}%`] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear', delay: i * 1.3 }}
                  />
                ))}
                {/* Labels */}
                {[
                  { x: 20, y: 170, text: 'Your device' },
                  { x: 235, y: 110, text: '1,200 km fiber' },
                  { x: 420, y: 75, text: 'Mumbai DC' },
                ].map((l, i) => (
                  <motion.text
                    key={i}
                    x={l.x}
                    y={l.y}
                    fill="#94a3b8"
                    fontSize="12"
                    textAnchor="middle"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 + i * 0.4 }}
                  >
                    {l.text}
                  </motion.text>
                ))}
              </svg>
            </div>

            {/* Server rack SVG */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex-shrink-0"
            >
              <svg width="140" height="220" viewBox="0 0 140 220">
                {/* Rack frame */}
                <rect x="10" y="10" width="120" height="200" rx="6" fill="rgba(30,41,59,0.9)" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5" />
                {/* Server units */}
                {[30, 85, 140].map((y, i) => (
                  <g key={i}>
                    <rect x="20" y={y} width="100" height="35" rx="3" fill="rgba(15,23,42,0.8)" stroke="rgba(99,102,241,0.2)" strokeWidth="1" />
                    {/* LEDs */}
                    {[0, 1, 2].map(j => (
                      <motion.circle
                        key={j}
                        cx={90 + j * 10}
                        cy={y + 17}
                        r={3}
                        fill={['#10b981', '#3b82f6', '#f59e0b'][j]}
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 + j * 0.2 }}
                      />
                    ))}
                    {/* Drive bays */}
                    {[0, 1, 2, 3].map(j => (
                      <rect key={j} x={25 + j * 14} y={y + 8} width="10" height="20" rx="1" fill="rgba(30,41,59,0.7)" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                    ))}
                  </g>
                ))}
                {/* Label */}
                <text x="70" y="210" textAnchor="middle" fill="#475569" fontSize="9">Mumbai Tier-IV DC</text>
              </svg>
            </motion.div>
          </div>

          {/* Journey steps */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
            {[
              { icon: '📱', title: 'Query leaves your device', desc: 'Encrypted packet traveling through cell towers or fiber' },
              { icon: '🌐', title: '1,200 km of fiber', desc: 'Mumbai handles ~38% of India\'s internet exchange traffic' },
              { icon: '🏭', title: 'Mumbai Data Center', desc: 'Power draw: ~0.007 kWh. Water: ~1.2 L via cooling towers' },
            ].map((step, i) => (
              <motion.div
                key={i}
                className="glass-card p-4 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
              >
                <div className="text-2xl mb-2">{step.icon}</div>
                <p className="text-sm font-semibold text-white mb-1">{step.title}</p>
                <p className="text-xs text-slate-400">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Scene>

      {/* ═══════════════════════════════════════════════════
          SCENE 3: The Cost
      ═══════════════════════════════════════════════════ */}
      <Scene className="bg-[#060b15]" id="scene3" ref={scene3Ref}>
        <div className="relative z-10 max-w-4xl mx-auto px-4 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-10"
          >
            <p className="text-amber-400 text-sm font-medium uppercase tracking-widest mb-3">The Cost</p>
            <h2 className="text-4xl font-bold text-white mb-2">Per Query Cost</h2>
            <p className="text-slate-400">What one AI query costs the planet</p>
          </motion.div>

          {/* Counter cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <StatCard icon="💧" title="Water consumed" targetNum={1.2} decimals={1} suffix=" L" trigger={scene3InView} delay={0} sub="Per AI query via cooling towers" />
            <StatCard icon="⚡" title="Electricity used" targetNum={0.007} decimals={3} suffix=" kWh" trigger={scene3InView} delay={0.2} sub="GPU inference + infrastructure overhead" />
            <StatCard icon="🌫️" title="CO₂ emitted" targetNum={4.2} decimals={1} suffix=" g" trigger={scene3InView} delay={0.4} sub="Based on India avg. grid intensity" />
          </div>

          {/* Scale-up */}
          <motion.div
            className="glass-card p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-slate-300 text-lg font-semibold mb-6">
              India processes <span className="text-amber-400 font-bold">8.5 billion</span> AI queries daily.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: 'Water/day', value: '10.2 B liters', icon: '💧', color: '#3b82f6' },
                { label: 'Electricity/day', value: '59.5M kWh', icon: '⚡', color: '#f59e0b' },
                { label: 'CO₂/day', value: '35.7B grams', icon: '🌫️', color: '#94a3b8' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 + i * 0.15 }}
                  className="text-center"
                >
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <p className="text-2xl font-bold font-mono" style={{ color: item.color }}>{item.value}</p>
                  <p className="text-xs text-slate-500 mt-1">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </Scene>

      {/* ═══════════════════════════════════════════════════
          SCENE 4: The Impact
      ═══════════════════════════════════════════════════ */}
      <Scene className="bg-[#050a12]" id="scene4" ref={scene4Ref}>
        <div className="relative z-10 max-w-6xl mx-auto px-4 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <p className="text-red-400 text-sm font-medium uppercase tracking-widest mb-3">The Impact</p>
            <h2 className="text-4xl font-bold text-white">India's data center footprint</h2>
          </motion.div>

          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* India hotspot map */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex-shrink-0"
            >
              <div
                className="relative rounded-2xl overflow-hidden border border-white/5"
                style={{
                  width: 340,
                  height: 440,
                  background: 'radial-gradient(ellipse at 40% 60%, rgba(30,41,59,0.8) 0%, rgba(5,10,18,1) 100%)',
                }}
              >
                {/* Subtle India outline suggestion */}
                <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 340 440" preserveAspectRatio="none">
                  <path
                    d="M80,20 C120,15 200,25 260,50 C290,65 310,90 315,120 C320,155 300,175 295,200 C290,225 310,240 305,265 C295,295 270,310 255,330 C235,355 220,375 200,395 C185,410 165,420 155,415 C140,408 120,390 105,370 C85,345 70,320 65,295 C55,265 60,240 55,215 C48,185 35,165 30,140 C22,110 30,80 50,55 C60,40 70,22 80,20 Z"
                    fill="rgba(59,130,246,0.15)"
                    stroke="rgba(59,130,246,0.2)"
                    strokeWidth="1.5"
                  />
                </svg>
                {/* City dots */}
                {CITY_DOTS.map((dot, i) => (
                  <CityDot key={dot.name} {...dot} />
                ))}
                {/* Map label */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-xs text-slate-600">India · DC Concentration</span>
                  <span className="text-[10px] text-slate-700">NASSCOM 2024</span>
                </div>
                {/* Legend */}
                <div className="absolute top-3 right-3 space-y-1">
                  {[
                    { color: '#ef4444', label: 'Critical' },
                    { color: '#f97316', label: 'High' },
                    { color: '#f59e0b', label: 'Moderate' },
                  ].map(l => (
                    <div key={l.label} className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                      <span className="text-[10px] text-slate-500">{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Stat cards */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  num: '358B',
                  label: 'litres/year by 2030',
                  desc: 'Projected annual DC water use — equal to 143,000 Olympic pools',
                  bar: 78,
                  color: '#3b82f6',
                  delay: 0,
                },
                {
                  num: '13.6 GW',
                  label: 'electricity demand by 2032',
                  desc: 'Equivalent to the entire installed capacity of Kerala + Tamil Nadu combined',
                  bar: 65,
                  color: '#f59e0b',
                  delay: 0.15,
                },
                {
                  num: '60–80%',
                  label: 'DCs in high water stress zones',
                  desc: 'Indian data centers operating in semi-critical or worse CGWB categories',
                  bar: 70,
                  color: '#f97316',
                  delay: 0.3,
                },
                {
                  num: '70+',
                  label: 'DCs in water-scarce Mumbai',
                  desc: 'Mumbai alone — with Semi-Critical groundwater and 2,700 CDD — hosts India\'s densest DC cluster',
                  bar: 90,
                  color: '#ef4444',
                  delay: 0.45,
                },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  className="glass-card p-5"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: s.delay, duration: 0.6 }}
                >
                  <p className="text-2xl font-bold font-mono mb-1" style={{ color: s.color }}>
                    {s.num}
                  </p>
                  <p className="text-sm font-semibold text-white mb-2">{s.label}</p>
                  <p className="text-xs text-slate-400 mb-3 leading-relaxed">{s.desc}</p>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: s.color }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${s.bar}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: s.delay + 0.3 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Scene>

      {/* ═══════════════════════════════════════════════════
          SCENE 5: The Framework
      ═══════════════════════════════════════════════════ */}
      <Scene className="bg-[#060b15] bg-dots" id="scene5" ref={scene5Ref}>
        <div className="relative z-10 max-w-5xl mx-auto px-4 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <p className="text-violet-400 text-sm font-medium uppercase tracking-widest mb-3">The Framework</p>
            <h2 className="text-4xl font-bold text-white mb-4">
              We built DCEI to measure{' '}
              <span className="text-gradient">what no one is measuring.</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              A composite environmental suitability index for data center site selection in India.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <FrameworkCard
              icon="💧"
              title="Water Stress Index"
              desc="How water-scarce is this location? CGWB groundwater classification, per-capita availability, and seasonal variability."
              weight="35%"
              delay={0}
            />
            <FrameworkCard
              icon="⚡"
              title="Carbon Intensity"
              desc="How dirty is the power grid? CEA grid emission factors, renewable penetration, and reliability metrics."
              weight="25%"
              delay={0.1}
            />
            <FrameworkCard
              icon="👥"
              title="Community Impact"
              desc="Who lives next door? Population density, noise externalities, utility competition, and existing DC load."
              weight="20%"
              delay={0.2}
            />
            <FrameworkCard
              icon="🌡️"
              title="Thermal Load"
              desc="How hard must cooling work? Wet-bulb temperature, humidity, cooling degree days, and urban heat island intensity."
              weight="20%"
              delay={0.3}
            />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <p className="text-slate-400 text-sm">
              Scoring <span className="text-white font-semibold">50 Indian cities</span> across{' '}
              <span className="text-white font-semibold">16+ environmental data points</span> each.
            </p>
          </motion.div>
        </div>
      </Scene>

      {/* ═══════════════════════════════════════════════════
          SCENE 6: Enter the Dashboard (CTA)
      ═══════════════════════════════════════════════════ */}
      <Scene className="bg-[#050a12]" id="scene6">
        {/* Background gradient */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.4) 0%, transparent 70%)' }}
          />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <p className="text-indigo-400 text-sm font-medium uppercase tracking-widest mb-4">Enter the Dashboard</p>
              <h2 className="text-5xl sm:text-6xl font-bold text-gradient leading-tight mb-4">
                Explore 50 cities.<br />4 indices. Zero greenwashing.
              </h2>
              <p className="text-slate-400 text-lg">
                Real government data. Transparent methodology. Honest scores.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/explorer" className="btn-primary text-white text-base py-3 px-8 no-underline">
                Launch DCEI Dashboard →
              </Link>
              <Link to="/methodology" className="btn-secondary text-slate-300 text-base py-3 px-8 no-underline">
                Read Methodology →
              </Link>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap justify-center gap-6 pt-4">
              {[
                { n: '50', label: 'Cities' },
                { n: '16+', label: 'Variables' },
                { n: '4', label: 'Sub-Indices' },
                { n: '100%', label: 'Government Data' },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="text-center"
                >
                  <p className="text-2xl font-bold text-white font-mono">{s.n}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">{s.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Credits */}
            <div className="pt-6 border-t border-white/5">
              <p className="text-sm text-slate-500 mb-2">
                DCEI Framework v0.1 · Research by{' '}
                <span className="text-slate-300 font-medium">Rudra Singh</span>
              </p>
              <p className="text-xs text-slate-700">
                Data: CGWB 2022 · CEA CO₂ Baseline v17 · IMD Normals 1991–2020 · Census 2011 · NASSCOM 2024
              </p>
            </div>
          </motion.div>
        </div>

        {/* Scroll to top */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="absolute bottom-6 right-6 p-2 rounded-full glass text-slate-500 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </Scene>
    </motion.div>
  )
}
