/**
 * Panel — rectangle with 1 px ink border.
 *
 * Props:
 *   inset     — use paper-3 background (recessed well)
 *   className
 *   children
 */
export default function Panel({ inset = false, className = '', children }) {
  const bg = inset ? 'bg-paper-3' : 'bg-paper'
  return (
    <div className={`panel border border-ink ${bg} ${className}`}>
      {children}
    </div>
  )
}
