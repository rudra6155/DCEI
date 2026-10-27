/**
 * PageHeader — full-width gray title bar (bar color: #7D7D7D).
 *
 * Matches the game's header bars. White text on bar background.
 *
 * Props:
 *   title      — string
 *   subtitle   — optional secondary line
 *   children   — optional right-side content
 *   className
 */
export default function PageHeader({ title = '', subtitle = '', children, className = '' }) {
  return (
    <header
      className={`page-header-bar flex items-center justify-between px-4 py-2 ${className}`}
      style={{ backgroundColor: '#7D7D7D' }}
    >
      <div>
        <h1 className="font-pixel text-white text-sm tracking-widest uppercase leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="font-mono text-xs text-white/70 mt-0.5">{subtitle}</p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-2">{children}</div>
      )}
    </header>
  )
}
