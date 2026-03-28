import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_LINKS = [
  { to: '/explorer', label: 'Explorer', icon: '🗺️' },
  { to: '/compare', label: 'Compare', icon: '⚖️' },
  { to: '/sensitivity', label: 'Sensitivity', icon: '🎚️' },
  { to: '/alternatives', label: 'Alternatives', icon: '🔄' },
  { to: '/methodology', label: 'Methodology', icon: '📐' },
]

export default function Navbar() {
  const location = useLocation()
  const isLanding = location.pathname === '/'
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const showGlass = !isLanding || scrolled

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: showGlass ? 'rgba(10,15,30,0.85)' : 'transparent',
          backdropFilter: showGlass ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: showGlass ? 'blur(16px)' : 'none',
          borderBottom: showGlass ? '1px solid rgba(255,255,255,0.06)' : 'none',
        }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 no-underline group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                DC
              </div>
              <span className="text-gradient font-bold text-xl tracking-tight">DCEI</span>
              <span className="text-slate-600 text-xs hidden sm:block">Framework</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {!isLanding && NAV_LINKS.map(link => {
                const active = location.pathname === link.to
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`nav-tab no-underline flex items-center gap-1.5 ${active ? 'active' : ''}`}
                  >
                    <span className="text-sm">{link.icon}</span>
                    {link.label}
                  </Link>
                )
              })}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {isLanding ? (
                <Link
                  to="/explorer"
                  className="btn-primary text-sm py-2 text-white no-underline"
                >
                  Launch Dashboard →
                </Link>
              ) : (
                <Link
                  to="/"
                  className="text-xs text-slate-500 hover:text-slate-300 transition-colors no-underline hidden sm:block"
                >
                  ← Home
                </Link>
              )}

              {/* Mobile hamburger */}
              <button
                className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                onClick={() => setMobileOpen(v => !v)}
                aria-label="Toggle menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col"
            style={{ background: 'rgba(5,10,18,0.97)', backdropFilter: 'blur(20px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="h-16" />
            <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
              {NAV_LINKS.map((link, i) => {
                const active = location.pathname === link.to
                return (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="w-full max-w-xs"
                  >
                    <Link
                      to={link.to}
                      className={`flex items-center gap-3 w-full px-6 py-4 rounded-xl no-underline transition-all ${
                        active
                          ? 'bg-indigo-500/20 text-white border border-indigo-500/30'
                          : 'text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      <span className="text-2xl">{link.icon}</span>
                      <span className="text-lg font-medium">{link.label}</span>
                    </Link>
                  </motion.div>
                )
              })}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: NAV_LINKS.length * 0.07 }}
                className="w-full max-w-xs mt-4"
              >
                <Link
                  to="/"
                  className="flex items-center justify-center w-full px-6 py-3 rounded-xl border border-white/10 text-slate-400 no-underline hover:bg-white/5 transition-all"
                >
                  ← Back to Home
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
