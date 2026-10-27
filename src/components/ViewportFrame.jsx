/**
 * ViewportFrame — fixed rainbow pixel border around the viewport.
 *
 * Colors are pixel-sampled from reference screenshots and defined in
 * the .viewport-frame CSS class in index.css.
 *
 * Decorative only — pointer-events: none, z-index: 9999.
 */
export default function ViewportFrame() {
  return (
    <div
      aria-hidden="true"
      className="viewport-frame pointer-events-none fixed inset-0 z-[9999]"
    />
  )
}
