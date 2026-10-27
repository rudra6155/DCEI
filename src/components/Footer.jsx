import { Link } from 'react-router-dom'
import PixelGlyph from './PixelGlyph.jsx'
import Panel from './Panel.jsx'

const NAV_LINKS = [
  { to: '/explorer',     label: 'Explorer'     },
  { to: '/compare',      label: 'Compare'      },
  { to: '/sensitivity',  label: 'Sensitivity'  },
  { to: '/alternatives', label: 'Alternatives' },
  { to: '/methodology',  label: 'Methodology'  },
]

const DATA_SOURCES = ['CGWB 2022', 'CEA v17', 'IMD 1991–2020', 'Census 2011', 'NASSCOM 2024']

export default function Footer() {
  return (
    <footer className="bg-paper border-t border-ink mt-8">
      {/* Header bar */}
      <div
        className="px-4 py-1.5 border-b border-ink"
        style={{ backgroundColor: '#7D7D7D' }}
      >
        <span className="font-pixel text-white text-xs tracking-widest uppercase">
          DCEI Framework — v0.1
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Col 1: Branding */}
        <div>
          <p className="font-pixel text-sm text-ink mb-2">DCEI</p>
          <p className="font-mono text-xs text-ink-soft leading-relaxed mb-3">
            A composite environmental impact index quantifying water, carbon,
            community, and thermal risk for AI infrastructure siting across
            50 Indian cities.
          </p>
          <p className="font-mono text-[10px] text-ink-soft">
            Published on Zenodo · 2026
          </p>
        </div>

        {/* Col 2: Navigation */}
        <div>
          <p className="font-mono text-[10px] text-ink-soft uppercase tracking-widest mb-2">Explore</p>
          <div className="flex flex-col gap-0 border border-ink">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="font-mono text-xs text-ink no-underline px-2 py-1.5 border-b last:border-b-0 border-ink/20 hover:bg-paper-2 transition-colors duration-120 ease-step-1"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Col 3: Connect */}
        <div>
          <p className="font-mono text-[10px] text-ink-soft uppercase tracking-widest mb-2">Connect</p>
          <Panel className="divide-y divide-ink/20">
            <a
              href="mailto:rudra@filtree.in"
              className="flex items-center gap-2 px-2 py-1.5 font-mono text-xs text-ink no-underline hover:bg-paper-2 transition-colors duration-120"
            >
              <PixelGlyph name="external" size={8} color="#3B3B3B" />
              rudra@filtree.in
            </a>
            <a
              href="https://www.linkedin.com/in/rudra-singh-07830233a"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-2 py-1.5 font-mono text-xs text-ink no-underline hover:bg-paper-2 transition-colors duration-120"
            >
              <PixelGlyph name="external" size={8} color="#3B3B3B" />
              LinkedIn
            </a>
            <a
              href="https://github.com/rudra6155"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-2 py-1.5 font-mono text-xs text-ink no-underline hover:bg-paper-2 transition-colors duration-120"
            >
              <PixelGlyph name="external" size={8} color="#3B3B3B" />
              GitHub — rudra6155
            </a>
          </Panel>
          <p className="font-mono text-[10px] text-ink-soft mt-2 leading-relaxed">
            Open for research collaborations, feedback, and data contributions.
          </p>
        </div>

        {/* Col 4: Also Check Out + Data Sources */}
        <div>
          <p className="font-mono text-[10px] text-ink-soft uppercase tracking-widest mb-2">Also</p>
          <Panel className="p-3 mb-3">
            <a
              href="https://filtree.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 no-underline group"
            >
              <span className="font-pixel text-sm text-ink group-hover:text-cube transition-colors duration-120">
                Filtree
              </span>
              <PixelGlyph name="external" size={8} color="#3B3B3B" />
            </a>
            <p className="font-mono text-[10px] text-ink-soft mt-1 leading-relaxed">
              Another project by Rudra Singh. filtree.in
            </p>
          </Panel>

          <p className="font-mono text-[10px] text-ink-soft uppercase tracking-widest mb-1">Data Sources</p>
          <div className="flex flex-wrap gap-1">
            {DATA_SOURCES.map(s => (
              <span
                key={s}
                className="font-mono text-[9px] px-1.5 py-0.5 border border-ink/30 text-ink-soft bg-paper-2"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-ink/20 px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-mono text-[10px] text-ink-soft">
          <span>© 2026 Rudra Singh</span>
          <span>·</span>
          <a
            href="https://doi.org/10.5281/zenodo.19298046"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cube hover:text-ink transition-colors duration-120 no-underline"
          >
            DOI: 10.5281/zenodo.19298046
          </a>
        </div>
        <p className="font-mono text-[10px] text-ink-soft text-center sm:text-right max-w-sm">
          DCEI scores are research-grade estimates — not sole decision-making criteria.
        </p>
      </div>
    </footer>
  )
}
