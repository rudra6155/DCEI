/**
 * MenuRow — plain text row with lavender band on active state.
 *
 * Matches the game's nav/menu list rows.
 *
 * Props:
 *   active    — boolean (shows band-primary background)
 *   onClick   — handler
 *   children
 *   className
 */
export default function MenuRow({ active = false, onClick, children, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'menu-row w-full text-left px-3 py-1.5 font-pixel text-sm tracking-wide',
        'border-b border-ink/20 transition-colors duration-120 ease-step-1',
        active
          ? 'bg-band-primary text-ink'
          : 'bg-transparent text-ink hover:bg-paper-2',
        className,
      ].join(' ')}
    >
      {children}
    </button>
  )
}
