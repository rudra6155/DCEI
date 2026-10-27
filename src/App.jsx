import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'

// Code-split all 5 dashboard routes
const Landing      = lazy(() => import('./pages/Landing.jsx'))
const Explorer     = lazy(() => import('./pages/Explorer.jsx'))
const Compare      = lazy(() => import('./pages/Compare.jsx'))
const Sensitivity  = lazy(() => import('./pages/Sensitivity.jsx'))
const Alternatives = lazy(() => import('./pages/Alternatives.jsx'))
const Methodology  = lazy(() => import('./pages/Methodology.jsx'))

const DASHBOARD_PATHS = ['/explorer', '/compare', '/sensitivity', '/alternatives', '/methodology']

function Fallback() {
  return (
    <div className="min-h-dvh bg-paper flex items-center justify-center">
      <span className="font-pixel text-xs text-ink-soft uppercase tracking-widest animate-step-blink">
        Loading…
      </span>
    </div>
  )
}

export default function App() {
  const location  = useLocation()
  const isDashboard = DASHBOARD_PATHS.some(p => location.pathname.startsWith(p))

  return (
    <div className="min-h-screen bg-paper text-ink font-mono">
      <Navbar />
      <Suspense fallback={<Fallback />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/"              element={<Landing />}      />
            <Route path="/explorer"      element={<Explorer />}     />
            <Route path="/compare"       element={<Compare />}      />
            <Route path="/sensitivity"   element={<Sensitivity />}  />
            <Route path="/alternatives"  element={<Alternatives />} />
            <Route path="/methodology"   element={<Methodology />}  />
          </Routes>
        </AnimatePresence>
      </Suspense>
      {isDashboard && <Footer />}
    </div>
  )
}
