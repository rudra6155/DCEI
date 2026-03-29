import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'

// Animated floating orb
function FloatingOrb({ size, color, x, y, duration, delay }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        top: `${y}%`,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: 'blur(1px)',
      }}
      animate={{
        y: [0, -18, 0],
        opacity: [0.4, 0.7, 0.4],
        scale: [1, 1.08, 1],
      }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

// Particle dot
function Particle({ x, y, delay }) {
  return (
    <motion.div
      className="absolute w-0.5 h-0.5 rounded-full bg-blue-400/30 pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%` }}
      animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
      transition={{ duration: 3 + Math.random() * 2, delay, repeat: Infinity }}
    />
  )
}

// Connect link card with hover glow
function ConnectCard({ href, icon, label, sub, color, external = true }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300 no-underline group cursor-pointer"
      style={{
        borderColor: hovered ? `${color}40` : 'rgba(255,255,255,0.06)',
        background: hovered ? `${color}0d` : 'rgba(255,255,255,0.02)',
        boxShadow: hovered ? `0 0 20px ${color}20` : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <span className="text-xl">{icon}</span>
      <div>
        <p className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">{label}</p>
        {sub && <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">{sub}</p>}
      </div>
      <motion.span
        className="ml-auto text-slate-600 group-hover:text-slate-400 transition-colors text-xs"
        animate={hovered ? { x: 3 } : { x: 0 }}
        transition={{ duration: 0.2 }}
      >
        →
      </motion.span>
    </motion.a>
  )
}

// Pulsing live dot
function PulseDot({ color = '#3b82f6' }) {
  return (
    <span className="relative inline-flex items-center justify-center w-2.5 h-2.5">
      <motion.span
        className="absolute inline-flex rounded-full"
        style={{ width: '100%', height: '100%', background: `${color}40` }}
        animate={{ scale: [1, 2.2, 1], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <span className="relative inline-flex rounded-full w-1.5 h-1.5" style={{ background: color }} />
    </span>
  )
}

const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  x: Math.round((i * 4.7 + 3) % 100),
  y: Math.round((i * 7.3 + 10) % 100),
  delay: i * 0.4,
}))

export default function Footer() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <footer ref={ref} className="relative overflow-hidden border-t border-white/5" style={{ background: '#030710' }}>

      {/* Animated background layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <FloatingOrb size={300} color="rgba(59,130,246,0.07)" x={10}  y={20}  duration={7}   delay={0} />
        <FloatingOrb size={220} color="rgba(139,92,246,0.06)" x={75}  y={10}  duration={9}   delay={1.5} />
        <FloatingOrb size={180} color="rgba(14,165,233,0.05)" x={50}  y={60}  duration={11}  delay={3} />
        <FloatingOrb size={140} color="rgba(16,185,129,0.04)" x={85}  y={70}  duration={8}   delay={2} />
        {PARTICLES.map((p, i) => <Particle key={i} {...p} />)}
        {/* subtle grid */}
        <div className="absolute inset-0 bg-grid opacity-30" />
      </div>

      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.4) 30%, rgba(139,92,246,0.4) 70%, transparent 100%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Col 1: Branding */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-black"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
                whileHover={{ scale: 1.1, rotate: 3 }}
                transition={{ duration: 0.2 }}
              >
                DC
              </motion.div>
              <div>
                <p className="text-sm font-bold text-white">DCEI Framework</p>
                <p className="text-xs text-slate-500">v0.1 · India Data Center Research</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              A composite environmental impact index quantifying water, carbon, community, and
              thermal risk for AI infrastructure siting across 50 Indian cities.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <PulseDot color="#10b981" />
              <span>Published on Zenodo · 2026</span>
            </div>
          </motion.div>

          {/* Col 2: Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Explore</p>
            <div className="space-y-1">
              {[
                { to: '/explorer',     label: '🗺️  Explorer',    sub: 'Interactive city map' },
                { to: '/compare',      label: '⚖️  Compare',     sub: 'Side-by-side analysis' },
                { to: '/sensitivity',  label: '🎚️  Sensitivity',  sub: 'Adjust weights' },
                { to: '/alternatives', label: '🔄  Alternatives', sub: 'Find better sites' },
                { to: '/methodology',  label: '📐  Methodology',  sub: 'How scores are built' },
              ].map(({ to, label, sub }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200 no-underline group"
                >
                  <span>{label}</span>
                  <span className="text-slate-700 group-hover:text-slate-500 transition-colors text-[10px]">{sub}</span>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Col 3: Connect With Us */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Connect</p>
              <motion.span
                className="text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{ background: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)' }}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                open to partnerships
              </motion.span>
            </div>
            <div className="space-y-2">
              <ConnectCard
                href="mailto:rudra@filtree.in"
                icon="✉️"
                label="Email"
                sub="rudra@filtree.in"
                color="#3b82f6"
                external={false}
              />
              <ConnectCard
                href="https://www.linkedin.com/in/rudra-singh-07830233a"
                icon="💼"
                label="LinkedIn"
                sub="Rudra Singh"
                color="#0ea5e9"
              />
              <ConnectCard
                href="https://github.com/rudra6155"
                icon="🐙"
                label="GitHub"
                sub="rudra6155"
                color="#8b5cf6"
              />
            </div>
            <p className="text-[11px] text-slate-600 mt-3 leading-relaxed">
              Open for research collaborations, feedback, partnerships, and data contributions.
            </p>
          </motion.div>

          {/* Col 4: Also Check Out */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Also Check Out</p>
            <motion.a
              href="https://filtree.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-2xl p-4 no-underline group cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, rgba(16,185,129,0.07) 0%, rgba(59,130,246,0.07) 100%)',
                border: '1px solid rgba(16,185,129,0.15)',
              }}
              whileHover={{
                y: -4,
                boxShadow: '0 12px 40px rgba(16,185,129,0.15)',
                borderColor: 'rgba(16,185,129,0.35)',
              }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black"
                  style={{ background: 'linear-gradient(135deg, #10b981, #3b82f6)' }}
                >
                  F
                </div>
                <div>
                  <p className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">Filtree</p>
                  <p className="text-xs text-slate-500">filtree.in</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                Another project by Rudra Singh. Visit to learn more.
              </p>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-400 font-medium group-hover:gap-2.5 transition-all duration-200">
                <span>Visit filtree.in</span>
                <span>→</span>
              </div>
            </motion.a>

            {/* Data sources mini list */}
            <div className="mt-4">
              <p className="text-[10px] text-slate-600 uppercase tracking-widest font-semibold mb-2">Data Sources</p>
              <div className="flex flex-wrap gap-1">
                {['CGWB 2022', 'CEA v17', 'IMD 1991–2020', 'Census 2011', 'NASSCOM 2024'].map(s => (
                  <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-white/4 text-slate-600 border border-white/5">{s}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Bottom bar ── */}
        <motion.div
          className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span>© 2026 Rudra Singh</span>
            <span className="text-slate-800">·</span>
            <a
              href="https://doi.org/10.5281/zenodo.19298046"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-sky-400 transition-colors no-underline"
            >
              DOI: 10.5281/zenodo.19298046
            </a>
          </div>
          <p className="text-[11px] text-slate-700 text-center sm:text-right max-w-sm">
            DCEI scores are research-grade estimates and should not be used as sole decision-making criteria.
          </p>
        </motion.div>

      </div>
    </footer>
  )
}
