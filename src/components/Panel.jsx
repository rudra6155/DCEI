/**
 * Panel — rectangle with 1 px ink border.
 *
 * Props:
 *   inset     — use paper-3 background (recessed well)
 *   className
 *   children
 */
export default function Panel({ inset = false, className = '', children, style }) {
  const bg       = inset ? 'bg-paper-3' : 'bg-paper'
  const insetCls = inset ? 'panel--inset' : ''
  return (
    <div className={`panel border border-ink ${bg} ${insetCls} ${className}`} style={style}>
      {children}
    </div>
  )
}
