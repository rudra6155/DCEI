import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import PixelGlyph from './PixelGlyph.jsx'

const NAV_LINKS = [
  { to: '/explorer',     label: 'Explorer',     glyph: 'city'    },
  { to: '/compare',      label: 'Compare',      glyph: 'compare' },
  { to: '/sensitivity',  label: 'Sensitivity',  glyph: 'filter'  },
  { to: '/alternatives', label: 'Alternatives', glyph: 'sort'    },
  { to: '/methodology',  label: 'Methodology',  glyph: 'chart'   },
]

export default function Navbar() {
  const location   = useLocation()
  const isLanding  = location.pathname === '/'
  const [mobileOpen, setMobileOpen] = useState(false)

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 bg-bar border-b border-ink"
        style={{ height: '40px' }}
      >
        <div className="max-w-7xl mx-auto px-3 flex items-center justify-between h-full">
          {/* Logo */}
          <Link
            to="/"
            className="font-pixel text-white text-sm tracking-widest no-underline hover:text-band-focus transition-colors duration-120 ease-step-1"
          >
            DCEI
          </Link>

          {/* Desktop nav — only shown on dashboard pages */}
          {!isLanding && (
            <div className="hidden md:flex items-center gap-0">
              {NAV_LINKS.map(link => {
                const active = location.pathname.startsWith(link.to)
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={[
                      'flex items-center gap-1.5 px-3 h-[39px] font-mono text-xs no-underline',
                      'border-r border-ink/30 transition-colors duration-120 ease-step-1',
                      active
                        ? 'bg-band-primary text-ink'
                        : 'text-white/80 hover:bg-white/10',
                    ].join(' ')}
                  >
                    <PixelGlyph name={link.glyph} size={8} color={active ? '#3B3B3B' : '#FFFFFF'} />
                    {link.label}
                  </Link>
                )
              })}
            </div>
          )}

          <div className="flex items-center gap-2">
            {isLanding ? (
              <Link
                to="/explorer"
                className="font-pixel text-xs text-white no-underline border border-white/50 px-2 py-1 hover:border-band-focus hover:text-band-focus transition-colors duration-120 ease-step-1"
              >
                Launch
              </Link>
            ) : (
              <Link
                to="/"
                className="font-mono text-xs text-white/60 no-underline hover:text-white transition-colors duration-120 ease-step-1 hidden sm:block"
              >
                ← Home
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-1.5 text-white/70 hover:text-white transition-colors"
              onClick={() => setMobileOpen(v => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              <PixelGlyph name={mobileOpen ? 'cross' : 'menu'} size={12} color="currentColor" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay menu */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-bar flex flex-col border-r border-ink"
          style={{ top: '40px' }}
        >
          <div className="flex flex-col">
            {NAV_LINKS.map(link => {
              const active = location.pathname.startsWith(link.to)
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={[
                    'flex items-center gap-3 px-4 py-3 font-pixel text-sm no-underline',
                    'border-b border-ink/30 transition-colors duration-120 ease-step-1',
                    active ? 'bg-band-primary text-ink' : 'text-white hover:bg-white/10',
                  ].join(' ')}
                >
                  <PixelGlyph name={link.glyph} size={12} color={active ? '#3B3B3B' : '#FFFFFF'} />
                  {link.label}
                </Link>
              )
            })}
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3 font-mono text-sm text-white/60 no-underline border-b border-ink/30 hover:text-white transition-colors"
            >
              ← Home
            </Link>
          </div>
        </div>
      )}

      {/* Spacer so page content clears the fixed nav */}
      <div style={{ height: '40px' }} aria-hidden="true" />
    </>
  )
}
