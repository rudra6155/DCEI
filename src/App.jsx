import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'

import Landing from './pages/Landing.jsx'
import Explorer from './pages/Explorer.jsx'
import Compare from './pages/Compare.jsx'
import Sensitivity from './pages/Sensitivity.jsx'
import Alternatives from './pages/Alternatives.jsx'
import Methodology from './pages/Methodology.jsx'

const DASHBOARD_PATHS = ['/explorer', '/compare', '/sensitivity', '/alternatives', '/methodology']

export default function App() {
  const location = useLocation()
  const isDashboard = DASHBOARD_PATHS.some(p => location.pathname.startsWith(p))

  return (
    <div className="min-h-screen bg-[#050a12]">
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Landing />} />
          <Route path="/explorer" element={<Explorer />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/sensitivity" element={<Sensitivity />} />
          <Route path="/alternatives" element={<Alternatives />} />
          <Route path="/methodology" element={<Methodology />} />
        </Routes>
      </AnimatePresence>
      {isDashboard && <Footer />}
    </div>
  )
}
