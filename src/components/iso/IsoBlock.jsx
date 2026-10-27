/**
 * IsoBlock — single isometric rectangular block (SVG primitive).
 *
 * Geometry: 2:1 dimetric projection.
 *   right  direction: (+U,  +U/2)
 *   depth  direction: (-U,  +U/2)
 *   up     direction: ( 0,  -U  )
 *
 * Props:
 *   cx, cy        — screen position of front-bottom vertex (anchor)
 *   size          — U in pixels (half-width of the top-face diamond)
 *   w, d, h       — block dimensions in tile units (default 1,1,1)
 *   topColor      — fill for top face
 *   leftColor     — fill for left face
 *   rightColor    — fill for right face
 *   stroke        — outline color (default none)
 *   strokeWidth   — (default 0)
 *   className     — extra SVG group class
 */
export default function IsoBlock({
  cx = 0,
  cy = 0,
  size = 16,
  w = 1,
  d = 1,
  h = 1,
  topColor   = '#FFFFFF',
  leftColor  = '#C2C2C2',
  rightColor = '#BCBCBC',
  stroke     = 'none',
  strokeWidth = 0,
  className  = '',
}) {
  const U = size

  // 8 vertices
  const BF = [cx,               cy              ]
  const BR = [cx + w * U,       cy + w * U / 2  ]
  const BB = [cx + (w - d) * U, cy + (w + d) * U / 2]
  const BL = [cx - d * U,       cy + d * U / 2  ]

  const TF = [cx,               cy - h * U      ]
  const TR = [cx + w * U,       cy - h * U + w * U / 2]
  const TB = [cx + (w - d) * U, cy - h * U + (w + d) * U / 2]
  const TL = [cx - d * U,       cy - h * U + d * U / 2]

  const pts = v => v.join(',')

  // Top face
  const topPts    = [TF, TR, TB, TL].map(pts).join(' ')
  // Right face (south-east)
  const rightPts  = [BF, BR, TR, TF].map(pts).join(' ')
  // Left face (south-west)
  const leftPts   = [BF, TF, TL, BL].map(pts).join(' ')

  const sw = strokeWidth
  const strokeProps = stroke !== 'none'
    ? { stroke, strokeWidth: sw, strokeLinejoin: 'miter' }
    : { stroke: 'none' }

  return (
    <g className={className} shapeRendering="crispEdges">
      <polygon points={rightPts}  fill={rightColor} {...strokeProps} />
      <polygon points={leftPts}   fill={leftColor}  {...strokeProps} />
      <polygon points={topPts}    fill={topColor}   {...strokeProps} />
    </g>
  )
}
