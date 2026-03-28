import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#030710]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: branding */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
              DC
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-300">
                DCEI Framework <span className="text-pink-400/70 font-normal">v0.1 · Research by Rudra Singh</span>
              </p>
              <p className="text-xs text-pink-400/70">Research by Rudra Singh</p>
            </div>
          </div>

          {/* Center: data sources */}
          <div className="text-center">
            <p className="text-xs text-slate-600">
              Data:{' '}
              <span className="text-slate-500">CGWB 2022</span>
              {' · '}
              <span className="text-slate-500">CEA CO₂ Baseline v17</span>
              {' · '}
              <span className="text-slate-500">IMD Normals 1991–2020</span>
              {' · '}
              <span className="text-slate-500">Census 2011</span>
              {' · '}
              <span className="text-slate-500">NASSCOM 2024</span>
            </p>
          </div>

          {/* Right: links */}
          <div className="flex items-center gap-4">
            <Link
              to="/methodology"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors no-underline"
            >
              Methodology
            </Link>
            <span className="text-slate-700">·</span>
            <Link
              to="/explorer"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors no-underline"
            >
              Explorer
            </Link>
            <span className="text-slate-700">·</span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors no-underline"
            >
              GitHub
            </a>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/3 text-center">
          <p className="text-[11px] text-slate-700">
            DCEI scores are research-grade estimates and should not be used as sole decision-making criteria.
          </p>
        </div>
      </div>
    </footer>
  )
}
