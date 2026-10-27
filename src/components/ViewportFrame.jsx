/**
 * ViewportFrame — fixed rainbow pixel border around the viewport.
 *
 * A 3 px wide frame: outer 2 px = rainbow cycle, inner 1 px = white gap.
 * Uses a CSS gradient outline via inset box-shadow on a fixed div.
 *
 * The rainbow cycles through the measured game frame colors:
 * teal, lime, amber, pink, lavender (repeating).
 *
 * This is decorative only — pointer-events: none, z-index: 9999.
 */
export default function ViewportFrame() {
  return (
    <div
      aria-hidden="true"
      className="viewport-frame pointer-events-none fixed inset-0 z-[9999]"
      style={{
        // Outer rainbow ring + inner white gap
        boxShadow: [
          'inset 0 0 0 1px #FFFFFF',    // inner white gap
          'inset 0 0 0 2px #D3A9FD',    // lavender
          'inset 0 0 0 3px #61F690',    // lime
          // outer glow rings cycling colors
        ].join(', '),
        outline: '2px solid #03CDD7',
        outlineOffset: '-2px',
      }}
    />
  )
}
