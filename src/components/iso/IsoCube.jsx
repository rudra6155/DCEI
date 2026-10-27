/**
 * IsoCube — animated rolling purple cube.
 *
 * Rolls right by cycling through 4 isometric rotation keyframes at
 * 80 ms per step (steps(1) easing), pausing 800 ms between cycles.
 *
 * Props:
 *   size   — U value (tile unit in px, default 20)
 *   cx, cy — screen anchor of front-bottom vertex
 */
import { useEffect, useRef } from 'react'
import IsoBlock from './IsoBlock.jsx'

const PURPLE       = '#9D55FF'
const PURPLE_MID   = '#7B3FD8'
const PURPLE_DARK  = '#3901AA'

const PURPLE_FRAMES = [
  { topColor: PURPLE,      leftColor: PURPLE_DARK, rightColor: PURPLE_MID  },
  { topColor: PURPLE_MID,  leftColor: PURPLE,      rightColor: PURPLE_DARK },
  { topColor: PURPLE_DARK, leftColor: PURPLE_MID,  rightColor: PURPLE      },
  { topColor: PURPLE,      leftColor: PURPLE_DARK, rightColor: PURPLE_MID  },
]

export default function IsoCube({ size = 20, cx = 0, cy = 0 }) {
  const frameRef  = useRef(0)
  const groupRef  = useRef(null)
  const rafRef    = useRef(null)
  const pausedRef = useRef(false)
  const lastRef   = useRef(null)
  const stepMs    = 80
  const pauseMs   = 800
  const totalMs   = PURPLE_FRAMES.length * stepMs + pauseMs

  const reduced = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (reduced) return

    const el = groupRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => { pausedRef.current = !entry.isIntersecting },
      { threshold: 0 }
    )
    observer.observe(el)

    const onVis = () => { pausedRef.current = document.hidden }
    document.addEventListener('visibilitychange', onVis)

    function tick(now) {
      rafRef.current = requestAnimationFrame(tick)
      if (pausedRef.current) { lastRef.current = null; return }

      if (lastRef.current == null) { lastRef.current = now }
      const elapsed  = (now - lastRef.current) % totalMs
      const frameIdx = elapsed < PURPLE_FRAMES.length * stepMs
        ? Math.floor(elapsed / stepMs)
        : PURPLE_FRAMES.length - 1

      if (frameRef.current !== frameIdx) {
        frameRef.current = frameIdx
        const f    = PURPLE_FRAMES[frameIdx]
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

  const f = PURPLE_FRAMES[0]

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
