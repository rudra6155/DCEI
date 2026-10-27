/**
 * IsoCube — animated rolling teal cube.
 *
 * The cube "rolls" right by cycling through 4 isometric rotation
 * keyframes at 80 ms per step (steps(1) easing), then pausing for
 * 800 ms before the next roll cycle.
 *
 * Pauses when:
 *   - IntersectionObserver reports the element is off-screen
 *   - document.visibilityState === 'hidden'
 *   - prefers-reduced-motion (shows final position, no animation)
 *
 * Props:
 *   size   — U value (tile unit in px, default 20)
 *   cx, cy — screen anchor of front-bottom vertex
 */
import { useEffect, useRef } from 'react'
import IsoBlock from './IsoBlock.jsx'

// 4 rotation frames for a cube rolling one step to the right.
// Each frame is a different face color arrangement.
const FRAMES = [
  { topColor: '#FFFFFF', leftColor: '#C2C2C2', rightColor: '#BCBCBC' },
  { topColor: '#BCBCBC', leftColor: '#FFFFFF', rightColor: '#C2C2C2' },
  { topColor: '#C2C2C2', leftColor: '#BCBCBC', rightColor: '#FFFFFF' },
  { topColor: '#FFFFFF', leftColor: '#C2C2C2', rightColor: '#BCBCBC' },
]

const TEAL = '#03CDD7'
const TEAL_DARK  = '#029BA3'
const TEAL_MID   = '#02B8C1'

const TEAL_FRAMES = [
  { topColor: TEAL,      leftColor: TEAL_DARK, rightColor: TEAL_MID  },
  { topColor: TEAL_MID,  leftColor: TEAL,      rightColor: TEAL_DARK },
  { topColor: TEAL_DARK, leftColor: TEAL_MID,  rightColor: TEAL      },
  { topColor: TEAL,      leftColor: TEAL_DARK, rightColor: TEAL_MID  },
]

export default function IsoCube({ size = 20, cx = 0, cy = 0 }) {
  const frameRef = useRef(0)
  const groupRef = useRef(null)
  const rafRef   = useRef(null)
  const pausedRef = useRef(false)
  const lastRef  = useRef(null)
  const stepMs   = 80
  const pauseMs  = 800
  const totalMs  = TEAL_FRAMES.length * stepMs + pauseMs

  // check reduced motion once
  const reduced = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (reduced) return

    const el = groupRef.current
    if (!el) return

    // IntersectionObserver
    const observer = new IntersectionObserver(
      ([entry]) => { pausedRef.current = !entry.isIntersecting },
      { threshold: 0 }
    )
    observer.observe(el)

    // visibility
    const onVis = () => { pausedRef.current = document.hidden }
    document.addEventListener('visibilitychange', onVis)

    function tick(now) {
      rafRef.current = requestAnimationFrame(tick)
      if (pausedRef.current) { lastRef.current = null; return }

      if (lastRef.current == null) { lastRef.current = now }
      const elapsed = (now - lastRef.current) % totalMs
      const frameIdx = elapsed < TEAL_FRAMES.length * stepMs
        ? Math.floor(elapsed / stepMs)
        : TEAL_FRAMES.length - 1

      if (frameRef.current !== frameIdx) {
        frameRef.current = frameIdx
        const f = TEAL_FRAMES[frameIdx]
        // update the polygon fills directly for perf (no React re-render)
        const polys = el.querySelectorAll('polygon')
        if (polys.length >= 3) {
          polys[0].setAttribute('fill', f.rightColor)
          polys[1].setAttribute('fill', f.leftColor)
          polys[2].setAttribute('fill', f.topColor)
        }
      }
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafRef.current)
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [reduced, totalMs])

  const f = TEAL_FRAMES[0]

  return (
    <g ref={groupRef}>
      <IsoBlock
        cx={cx} cy={cy} size={size}
        topColor={f.topColor}
        leftColor={f.leftColor}
        rightColor={f.rightColor}
      />
    </g>
  )
}
