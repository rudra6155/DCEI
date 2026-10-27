/**
 * DashedBtn — pastel fill button with rainbow dashed border.
 *
 * Matches the game's action buttons. The dashed border cycles through
 * accent colors via a CSS outline approach (fallback: ink dashes).
 *
 * Props:
 *   variant   — 'neutral' | 'lavender' | 'focus' (default 'neutral')
 *   onClick
 *   children
 *   className
 *   disabled
 *   type
 */
const BG = {
  neutral:  'bg-btn-neutral',
  lavender: 'bg-btn-lavender',
  focus:    'bg-band-focus',
}

export default function DashedBtn({
  variant   = 'neutral',
  onClick,
  children,
  className = '',
  disabled  = false,
  type      = 'button',
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[
        'dashed-btn inline-flex items-center justify-center',
        'px-4 py-1.5 font-pixel text-sm text-ink',
        'border-2 border-dashed border-ink',
        'transition-colors duration-120 ease-step-1',
        BG[variant] || BG.neutral,
        disabled ? 'opacity-40 cursor-not-allowed' : 'hover:border-band-primary active:border-band-focus',
        className,
      ].join(' ')}
    >
      {children}
    </button>
  )
}
