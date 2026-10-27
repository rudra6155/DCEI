/**
 * OptionsRow — label/value row, lime band on focus-within.
 *
 * Matches the game's options screen rows.
 *
 * Props:
 *   label     — string
 *   children  — the interactive control (select, range, etc.)
 *   className
 */
export default function OptionsRow({ label = '', children, className = '' }) {
  return (
    <div className={`options-row flex items-center justify-between px-3 py-1.5 border-b border-ink/20 focus-within:bg-band-focus ${className}`}>
      <span className="font-mono text-xs text-ink-soft uppercase tracking-wider">
        {label}
      </span>
      <div className="font-mono text-sm text-ink">
        {children}
      </div>
    </div>
  )
}
