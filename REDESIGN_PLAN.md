# REDESIGN PLAN — DCEI → isometric game UI

Phase 1 document. Do not begin code until this is approved.

---

## 0. Reference screenshots

Seven screenshots were analysed (all from `design-ref/edge game designs/`):

| Filename | Content |
|---|---|
| `WhatsApp Image 2026-10-27 at 9.32.36 PM (1).jpeg` | **Title screen** — isometric letters, menu rows, lavender selected band |
| `WhatsApp Image 2026-10-27 at 9.32.36 PM.jpeg` | **Scores / level select grid** — 7×7 tile grid, teal cube on selected tile |
| `WhatsApp Image 2026-10-27 at 9.32.35 PM (1).jpeg` | **Options screen** — lime focused row, options rows, button style |
| `WhatsApp Image 2026-10-27 at 9.32.35 PM (2).jpeg` | **Bonus level menu** — teal "new game" selected band, plain menu rows |
| `WhatsApp Image 2026-10-27 at 9.32.35 PM (3).jpeg` | **Instructions screen** — instructions text, info band, button style |
| `WhatsApp Image 2026-10-27 at 9.32.35 PM.jpeg` | **Credits screen** — typographic layout, two-level text hierarchy |
| `WhatsApp Image 2026-10-27 at 9.32.34 PM.jpeg` | **Level 01 results** — dark header, yellow record band, pink accent text |

---

## 1. Measured token table

All values measured by `measure_palette.py` and `measure_palette2.py` from the JPEG screenshots. JPEG compression may slightly lighten pure whites; values represent the average of multiple samples.

### Base surfaces

| Token | Hex | Source | Role |
|---|---|---|---|
| `paper` | `#FFFFFF` | options/bonus/instructions bg | page background — pure white (screenshots show white, not bone) |
| `paper-2` | `#EDEDEB` | options "back" button fill | recessed panels, alternate table rows |
| `paper-3` | `#F0F0EE` | between paper and paper-2 | subtle inset wells |
| `bar` | `#7D7D7D` | options header bar measured directly | page-title header bars |
| `ink` | `#3B3B3B` | results header, footer text | primary text, borders |
| `ink-soft` | `#818181` | options body text | secondary text, labels |

### Accent bands

| Token | Hex | Source | Role |
|---|---|---|---|
| `band-primary` | `#D3A9FD` | title screen lavender band (y=1040–1096 at x=300) | selected nav item, primary CTA |
| `band-focus` | `#61F690` | options screen lime row (y=352 at x=150) | focused options row, keyboard focus |
| `select` | `#FFD275` | results screen yellow record band (y=304) | selected tile, record highlight |
| `band-ink` | `#3B3B3B` | results dark header | dark info bands, contrast text rows |

### Game accents

| Token | Hex | Source | Role |
|---|---|---|---|
| `cube` | `#03CDD7` | scores-grid teal cube on tile (y=176, x=110) | the traveling teal cube in all scenes |
| `pink-accent` | `#FDA9B6` | results "prism" pink text | decorative pink, matches game aesthetic |
| `btn-neutral` | `#EDEDEB` | options "back" fill | neutral button background |
| `btn-lavender` | `#EADFFD` | options "credits" fill | secondary button background |

### Screen frame rainbow

The 1–2 px rainbow frame border is pixel-noise, varying by position. Measured positions:

| Position | Hex | Notes |
|---|---|---|
| Top-left corner | `#FCD8BE` | salmon/peach |
| Top edge | `#BEB8FE` | blue-lavender |
| Top (options) | `#EDB6FF` | purple/pink |
| Left (title at y=83%) | `#75FFFE` | teal |
| Left (options) | `#E5EB95` | yellow-green |
| Right (options) | `#C3F69A` | lime-green |
| Right (title) | `#F8D7DE` | pink/rose |
| Bottom | `#3B3B3B` | dark (footer bleed) |

Implementation: A fixed `box-shadow` or SVG border cycling through these colours in 2px steps around the entire viewport.

### Risk ramp

Derived from the game's warm-to-cool progress-square aesthetic, shifted so Critical does not clash with `band-primary` (#D3A9FD):

| Token | Hex | Risk level | Rationale |
|---|---|---|---|
| `risk-low` | `#4AB0E8` | Low (≤30) | Blue end of spectrum |
| `risk-moderate` | `#60C860` | Moderate (31–50) | Green mid |
| `risk-high` | `#F4A020` | High (51–70) | Amber |
| `risk-critical` | `#E03838` | Critical (>70) | Red (shifted from pink to avoid clash with band-primary #D3A9FD) |

All four are distinguishable from each other and from `band-primary`. Risk is NEVER shown by color alone — always paired with the category word.

### Isometric letter face tones (for SVG block primitive)

| Face | Hex | Measured from |
|---|---|---|
| Top (lightest) | `#FFFFFF` | iso_letter_top_face |
| Left (mid) | `#C2C2C2` | iso_letter_left_face / title screen y=528 |
| Right (darkest) | `#BCBCBC` | iso_letter_right_face |
| Shadow polygon | `#3B3B3B` at 15% opacity | estimated; cast lower-right |

### WCAG AA check

- `ink` (#3B3B3B) on `paper` (#FFFFFF): contrast ratio ≈ 10.5:1 ✓
- `ink` (#3B3B3B) on `paper-2` (#EDEDEB): contrast ratio ≈ 9.2:1 ✓
- `ink` (#3B3B3B) on `band-focus` (#61F690): contrast ratio ≈ 5.2:1 ✓ (AA)
- `ink` (#3B3B3B) on `select` (#FFD275): contrast ratio ≈ 7.1:1 ✓
- `ink` (#3B3B3B) on `band-primary` (#D3A9FD): contrast ratio ≈ 5.8:1 ✓ (AA)
- `paper` (#FFFFFF) on `bar` (#7D7D7D): contrast ratio ≈ 4.7:1 ✓ (AA for large text/UI)

---

## 2. Font decision

### Candidates compared against screenshots

The game's font is wide, geometric, lowercase-biased, chunky, with flat terminal cuts and a slightly monospaced feel. None of the five candidates is a perfect match (the game font appears custom), but ranked by closeness:

| Font | Result at 14–20px | Match quality | Notes |
|---|---|---|---|
| **Pixelify Sans** | Chunky, pixel-inspired, multiple weights | **Best match** | Broad strokes, rectangular construction, scales well from 12–24px, 4 weights available |
| Jersey 10 | 10px grid, similar aesthetic | Good | Very small baseline; loses quality at display sizes |
| Silkscreen | Classic 8px bitmap | Moderate | Clean at tiny sizes but too retro/cramped for headers |
| Tiny5 | 5px grid | Poor | Too small; unreadable at display sizes |
| Micro 5 | 5px grid, condensed | Poor | Same issue as Tiny5 |

**Decision: Pixelify Sans** (Regular 400 + Bold 700)

Justification: The game font has chunky, clearly pixel-pixel-inspired letterforms with square construction. Pixelify Sans matches the wide proportions, the rectangular "o" shape, the flat terminal cuts, and the bold stroke weight seen in "options", "scores", "back" etc. It is the only candidate that works at both small (12px nav items) and large (hero heading) sizes while maintaining crispness.

**Pixel font usage rules:**
- Minimum size: 12px (below this, letters blur due to sub-pixel rendering)
- Use for: navbar wordmark, page-title header bars, tile numbers, button labels, level-select numbers
- Never for: body copy, long descriptions, table data, formula text

**Body / data font: Space Mono** (Regular 400 + Bold 700)

Justification: Tabular numbers by default, true monospace, clean at 12–16px, good at rendering data with consistent column widths. Used for all body text, table cells, formulas, sub-index values, counter readouts.

**Fonts to add to `index.html`:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="preload" as="style"
  href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400;700&family=Space+Mono:wght@400;700&display=swap" />
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400;700&family=Space+Mono:wght@400;700&display=swap" />
```

**Remove:** `Inter` and `JetBrains Mono` links from `index.html`.

---

## 3. Tailwind token mapping

New `tailwind.config.js` color keys (replacing the existing dark palette):

```js
colors: {
  paper:    '#FFFFFF',
  'paper-2':'#EDEDEB',
  'paper-3':'#F0F0EE',
  bar:      '#7D7D7D',
  ink:      '#3B3B3B',
  'ink-soft':'#818181',
  'band-primary': '#D3A9FD',
  'band-focus':   '#61F690',
  select:   '#FFD275',
  cube:     '#03CDD7',
  'pink-accent': '#FDA9B6',
  'risk-low':      '#4AB0E8',
  'risk-moderate': '#60C860',
  'risk-high':     '#F4A020',
  'risk-critical': '#E03838',
}
fontFamily: {
  pixel: ['Pixelify Sans', 'monospace'],
  mono:  ['Space Mono', 'monospace'],
}
borderRadius: { DEFAULT: '0', none: '0' }   // override all radius to 0
```

---

## 4. index.css changes

**Remove entirely:**
- `.glass`, `.glass-dark`, `.glass-card`
- `.glow-blue`, `.glow-green`, `.glow-orange`, `.glow-red`
- `.text-gradient`, `.text-gradient-blue`
- `.btn-primary` and `.btn-secondary` with translateY/gradient/shadow
- `.bg-grid`, `.bg-dots`
- `.pulse-dot` and `@keyframes pulse-dot`
- `.bounce-chevron` and `@keyframes bounce-chevron`
- `.gradient-border` and `::before`
- Leaflet dark popup styling (`.leaflet-popup-content-wrapper` dark colors)
- `.leaflet-tile-pane` filter (brightness/hue-rotate)
- `.typing-cursor::after` with blue pipe cursor

**Add:**
- CSS custom properties for all tokens
- `.page-header-bar` — the gray full-width title strip
- `.menu-row` — a plain text row with ink padding  
- `.menu-row.active` — `band-primary` full-bleed background
- `.options-row` — label-left value-right with ink border bottom
- `.options-row:focus-within` — `band-focus` background
- `.panel` — rectangle with 2px ink border, paper background, 0 radius
- `.level-tile` — square tile with ink border, 0 radius
- `.level-tile.selected` — select yellow background
- `.level-tile.estimated` — diagonal half-shade clip
- `.seg-meter` — row of 10 square segments
- `.readout` — large mono number in ink panel
- `.dashed-btn` — pastel fill with rainbow dashed border simulation
- `.viewport-frame` — fixed rainbow border around entire viewport
- `.footer-strip` — ink background, paper text
- Leaflet light popup styling
- Range input restyled (ink track, ink thumb, no gradients)
- `@keyframes step-blink` — solid block cursor steps() blink
- `@keyframes step-tick` — game counter stepped increment
- `shape-rendering: crispEdges` on `.iso-svg`

**Body:** `background: #FFFFFF; color: #3B3B3B; font-family: 'Space Mono', monospace;`

---

## 5. Per-file change plan

### `index.html`
- Remove Inter and JetBrains Mono font links
- Add Pixelify Sans + Space Mono preconnect + preload + stylesheet
- Change `<body class="bg-[#0a0f1e] ...">` to `<body class="bg-paper text-ink font-mono antialiased">`

### `tailwind.config.js`
- Replace all dark navy/slate color tokens with the measured DCEI tokens above
- Add `pixel` and `mono` font families
- Set border radius default to 0
- Remove `float` and `spin-slow` animations; add `step-blink` and `step-tick`

### `src/index.css`
Full rewrite as described in section 4 above.

### `src/App.jsx`
- Change outer `div className` from `bg-[#050a12]` to `bg-paper`
- Page transitions: change from fade/scale Framer motion to a 150ms linear `x` slide (enter from right, exit to left). No spring, no bounce.
- Add `React.lazy` + `Suspense` code-splitting for all 5 dashboard routes
- Add temporary `/design-check` route (delete in phase 6)

### `src/components/Navbar.jsx`
Full restyle:
- Remove: `backdropFilter`, `blur`, `glass`, `rounded-*`, emoji icons, `rounded-xl`, gradient logo
- Add: Bone `paper` background, `2px solid ink` bottom border, `z-50`
- Wordmark: "dcei" in Pixelify Sans, `ink` color, no gradient
- Nav links: plain text rows, no icon, lowercase. Active = full-height `band-primary` band (no rounded, full-bleed within nav height)
- Right side: on landing = `band-primary` band button "launch dashboard →"; on dashboard = "← home" link in `ink-soft`
- Mobile hamburger: remove. Instead a "menu" text label that opens the overlay.
- Mobile overlay: full-screen `paper` background (no blur), stacked menu rows, active banded, "back" link at bottom-left (not centered), no animation curves (150ms linear opacity)
- Remove: `motion.nav` initial/animate entrance. Navbar is immediately visible.
- NAV_LINKS: remove emoji icons, lowercase labels

### `src/components/Footer.jsx`
Full restyle:
- Remove: `FloatingOrb`, `Particle`, `ConnectCard` (hover glow), `PulseDot`, PARTICLES array
- Remove: gradient top line, animated background layer
- Structure: dark `ink` strip, `paper` text (inverted from rest of site)
- Layout: 4 plain text columns (brand, links, connect, data)
- Brand col: "dcei framework" in Pixelify Sans, "v0.1 · India Data Center Research" in Space Mono small, DOI link
- Links col: plain text rows, no icon, lowercase route names
- Connect col: email, LinkedIn, GitHub — plain `ink` rows with `→` text, no hover glow
- "Also Check Out" col: Filtree link as plain text row, data sources as text list
- Bottom row: copyright, DOI, disclaimer — all plain mono text
- No motion, no delay, no inView animations. Static.

### `src/components/CityCard.jsx`
- Remove: `glass-card`, `rounded-lg`, `border-white/5`, gradient buttons
- Use `.panel` class (2px ink border, paper bg)
- Header: city name in Pixelify Sans (large), state in ink-soft mono
- Remove `ScoreGauge` circular component — replace with `.readout` block: big mono number + risk category text
- `RiskBadge` → square chip (no rounded, no dot)
- Sub-index bars → `.seg-meter` segment meters
- Stats grid: 2-col table with `paper-2` cells, mono data
- Infra note: `.panel` with `paper-2` inset
- Data confidence: shown with small tile icon (solid vs diagonal)
- Buttons: `.dashed-btn` style

### `src/components/ScoreGauge.jsx`
Replace entirely with a `ScoreReadout` component:
- A rectangle panel with the score as a large mono number
- Risk category below in smaller pixel font
- No SVG arcs, no circular shape, no gradients
- Stepped count-up animation using `steps()` timing function
- Keep the `score` and `size` props for backward compat; ignore `size` for layout (it's now a block element)

### `src/components/SubIndexBar.jsx`
Replace bar with `.seg-meter`:
- 10 square segments (each 8×8px with 1px gap) in a row
- Filled segments use the risk color; empty segments use `paper-2`
- Label in `ink-soft` mono uppercase, value in `ink` mono at right
- No gradient, no box-shadow, no `motion` spring animation
- Animation: segments fill left to right with 120ms steps() delay between each

### `src/components/RiskBadge.jsx`
- Remove: `rounded-full`, the pulsing dot inside
- Replace with: square chip — `2px solid` border in risk color, small `paper` bg, risk color text + category word
- No animation

### `src/utils/helpers.js`
- `getRiskColor`: update to return new risk ramp values (#4AB0E8, #60C860, #F4A020, #E03838)
- `getRiskBgColor`: update to return light tints of the same colors (at ~15% opacity)
- All other functions: unchanged

### `src/pages/Landing.jsx`
Major restyle, no logic changes except the ref bug fix:

**Bug fix:** Convert `Scene` from a const arrow function to a `React.forwardRef` component so `scene3Ref` and `scene4Ref` attach correctly. This fixes the counters stuck at 0.

**Scene 1 (The Question):**
- Remove: cursor glow div, radial background glows, `glass-card` on chat bubble, rounded gradient avatar
- Add: `paper` background (full scene)
- DCEI pill badge → page-header-bar label (full-width `bar` strip, "dcei framework" in Pixelify Sans)
- Chat bubble → `.panel` (2px ink border, paper bg, no border-radius)
- Round "U" avatar → 32×32 square `ink` tile with pixel "u" glyph in paper text
- Typing cursor → solid 2px block that blinks with `steps(1)` (no easing)
- 8 round particles → 8 square 6×6 pixels in `[band-primary, band-focus, select, cube, risk-low, risk-moderate, risk-high, risk-critical]`, move outward with `steps(4)` per axis, then `display:none` (no fade)
- Emoji removed from typed text (the only copy change allowed)
- Sent state: pixel check glyph (8×8 SVG) instead of round circle; 5-segment loading meter fills step by step
- CTAs: "Explore DCEI Dashboard →" → full-bleed `band-primary` link row; "See the journey ↓" → plain menu row
- "Researching..." line: stays as-is, shown in `ink-soft` mono

**Title stage (above Scene 1 content, full-width):**
- `<IsoTitleStage>` component: renders "DCEI" as isometric block letters on a flat plane using SVG
- Letters use shared `IsoBlock` primitive (see new components section)
- Teal cube starts on left, rolls across letter tops in 90° flips, loops
- Desktop: arrow keys move cube while stage hovered
- Mobile: swipe on stage moves cube; `touch-action: pan-y` on page, `touch-action: none` on stage
- `prefers-reduced-motion`: cube is stationary, animation paused

**Scene 2 (The Journey):**
- Remove: glowing gradient SVG path, round traveling circles, glass cards, emoji in step cards, `bg-grid`
- Add: isometric scene on `paper`
- Three isometric blocks (device, fiber node, data center) on a flat plane SVG
- Path between them: dashed `ink` line (not glowing)
- Traveling dot → teal cube rolling in 90° flips using `requestAnimationFrame` (paused when off-screen)
- Step cards → `.panel` with pixel glyph (8×12 SVG) for icon
- `prefers-reduced-motion`: cube jumps to next stop instantly

**Scene 3 (The Cost):**
- Remove: `glass-card`, emoji icons, eased count-up, animated bars
- Fix: `scene3Ref` now attaches (ref bug fixed above)
- Counter cards → `.readout` panels, stepped tick animation
- Daily totals → 3-column `.panel` row, static values (no animation)

**Scene 4 (India's Footprint):**
- Remove: `CityDot` with pulsing circles, fake India outline SVG path, `glass-card` stat cards
- Fix: `scene4Ref` now attaches
- Add: `<IsoField>` component — isometric "city field" with 50 columns
  - Each column: an `IsoBlock` stack, height proportional to DCEI score, top face = risk color
  - Position from actual lat/lng in cities.js (projected to 2D isometric)
  - Hover: column rises 1 unit, info panel shows name + score
  - Click: navigate to `/explorer?city=<name>`
  - `prefers-reduced-motion`: no hover raise, just info panel on click
- Stat cards → 4 `.readout` panels (358B, 13.6 GW, 60–80%, 70+)

**Scene 5 (The Framework):**
- Remove: `FrameworkCard` with glassmorphism, float animation, gradient weight bar, emoji
- Replace with: 4 `.panel` cards, left-aligned, lowercase heading, `.seg-meter` for weight (35%=3.5 segments, 25%=2.5, 20%=2, 20%=2)
- Pixel glyph icon (no emoji)

**Scene 6 (The CTA):**
- Remove: radial gradient background, gradient heading text, `btn-primary`/`btn-secondary`
- Big Pixelify Sans heading (lowercase, left-aligned, not centered gradient)
- "launch dcei dashboard →" → full-bleed `band-primary` row
- Stats → 4 `.readout` inline panels
- Credits line: Space Mono, `ink-soft`

**Scroll to top button:** remove the `glass` class; small `.dashed-btn` style

### `src/pages/Explorer.jsx`
- Remove: `glass-dark`, `rounded-xl`, `rounded-2xl`, `bg-slate-800/60`, `border-white/5`
- Add: page-header-bar "explorer"
- View toggle: 3 options in an `.options-row` (grid | map | field)
- Default: grid on mobile, field on desktop
- **Grid view:** Level-select grid layout
  - 6-column CSS grid of `.level-tile` components
  - Each tile: city rank number (Pixelify Sans), 6×6 risk color pip in top-left corner
  - `confidence: estimated` → diagonal half-shade (CSS `clip-path` diagonal)
  - Selected tile: `select` yellow background
  - Tap → open city info panel
- **Map view:** react-leaflet, CARTO light_nolabels tiles (no dark filter)
  - Replace `CircleMarker` with `DivIcon` rendering a 12×12 square SVG in risk color
  - Popup → `.panel` style (no rounded, no glass)
  - Map legend: square color chips + labels
- **Field view:** `<IsoField>` (same as Landing scene 4, reused)
- City detail panel: `.panel` with level-info-panel layout
  - City name (large Pixelify Sans), DCEI score as `.readout`, risk category as square chip
  - Sub-indices as `.seg-meter` rows
  - Stats table: `paper`/`paper-2` alternating rows, mono data
  - Bottom: `.dashed-btn` "compare →" and "alternatives →"
- Table (desktop, alongside map): `paper`/`paper-2` alternating rows
  - Column headers: Pixelify Sans uppercase
  - Selected row: `select` yellow bg
  - Confidence shown with small tile icon (solid/diagonal)
- Mobile: full-screen detail opens with back button pinned bottom-left
- Remove `ScoreGauge` references; use `ScoreReadout` instead

### `src/pages/Compare.jsx`
- Remove: `glass-card`, `glass-dark`, `rounded-xl`, `rounded-2xl`, `CITY_COLORS` blue/violet/green, `bg-slate-800/80`, emoji `💡`
- City selectors → `.options-row` (label left, city name right, ◄ ► cycle, tap opens list)
- City list: new palette city colors from token set: `[cube, band-primary, select]` (teal, lavender, yellow)
- Recharts radar: `ink` stroke polygon grid, flat fill at 0.15 opacity per city color, no gradients, square dots (use `dot: { r: 3, strokeWidth: 0 }`)
- Bar chart: square-ended bars (`strokeWidth: 0`, no radius), only baseline grid line
- `CustomTooltip` → `.panel`
- Score tower: stacked `.panel` segments per sub-index, filled in risk color
- Insight banner: remove emoji; `.panel` with `ink-soft` text
- Parameter table: reference-style table, best values highlighted with `select` yellow cell bg

### `src/pages/Sensitivity.jsx`
- Remove: `glass-card`, `rounded-xl`, `rounded-lg`, `rounded`, emoji labels, `accent-indigo-500`, `bg-blue-500/10` etc.
- Page header bar: "sensitivity"
- Weight sliders: each presented as an `.options-row`
  - Label left (no emoji), ◄ current% ► right side cycling, `.seg-meter` below
  - Focused row: `band-focus` lime background (`focus-within`)
  - Hidden `<input type="range">` underneath for keyboard accessibility
- Presets: menu rows, active banded (`band-primary`)
- Bar chart: same restyling as Compare (square bars, ink baseline)
- Heatmap: square cells, no gradient — each cell is one of the 4 risk colors at 80% opacity
- When ranks change: values tick to new numbers using `steps()` animation

### `src/pages/Alternatives.jsx`
- Remove: `bg-[#0a0f1e]`, `backdrop-blur-xl`, gradient text, gradient button, emoji `📍 💧 ⚡ 👥 🌡️ ⚠️`, `rounded-2xl`
- Page header bar: "alternatives"
- Source city selector → `.options-row`
- Distance control → `.options-row` with segment meter
- Map: CARTO light tiles (same as Explorer, no dark filter), polylines in `ink` dashed
- Results: isometric columns of decreasing height (reuse `IsoField` column primitive)
  - Each column labeled with city name (Pixelify Sans), score (Space Mono), delta chip
  - `DeltaBadge` → square chip, `ink` border, risk-color text
- Sub-index delta grid: `.panel` with segment meters, no emoji labels

### `src/pages/Methodology.jsx`
- Remove: `bg-[#0a0f1e]`, `backdrop-blur-xl`, `rounded-xl`, gradient heading text, emoji `📐`, `prose-dark`
- Page header bar: "methodology"
- TOC sidebar → `.menu-row` list, active = `band-primary` band
- Formula blocks → `paper-2` recessed panel (`.panel` with `paper-2` bg, 2px `ink` border)
- `ComponentTable`, data-source table → reference-style tables (ink borders, paper/paper-2 alternating)
- Long body text: Space Mono at ~14px, max-width ~70ch
- Citation badges: remove colored borders; use plain `ink` border squares
- Sticky TOC active state: `band-primary` band instead of `bg-sky-500/15`

---

## 6. New shared components to create

| Component | File | Description |
|---|---|---|
| `IsoBlock` | `src/components/iso/IsoBlock.jsx` | SVG isometric block primitive: `x, y, w, h, depth, baseColor` → three-face polygon + shadow |
| `IsoTitleStage` | `src/components/iso/IsoTitleStage.jsx` | "DCEI" isometric letter stage with rolling cube |
| `IsoField` | `src/components/iso/IsoField.jsx` | 50-column isometric city field from cities.js data |
| `IsoCube` | `src/components/iso/IsoCube.jsx` | The animated teal cube (rolling in 90° flips, RAF-driven) |
| `SegMeter` | `src/components/SegMeter.jsx` | 10-segment horizontal meter |
| `ScoreReadout` | `src/components/ScoreReadout.jsx` | Stepped numeric readout replacing ScoreGauge |
| `PageHeader` | `src/components/PageHeader.jsx` | Full-width gray header bar with lowercase title |
| `Panel` | `src/components/Panel.jsx` | Rectangle with 2px ink border, paper bg, 0 radius |
| `OptionsRow` | `src/components/OptionsRow.jsx` | Label-left, value-right row with focus lime band |
| `MenuRow` | `src/components/MenuRow.jsx` | Plain text row; active = band-primary |
| `LevelTile` | `src/components/LevelTile.jsx` | Square city tile for the grid view |
| `DashedBtn` | `src/components/DashedBtn.jsx` | Pastel fill button with rainbow border |
| `ViewportFrame` | `src/components/ViewportFrame.jsx` | Fixed rainbow pixel border around viewport |
| `PixelGlyph` | `src/components/PixelGlyph.jsx` | 8×8 or 12×12 SVG pixel glyphs for icons |
| `DesignCheck` | `src/pages/DesignCheck.jsx` | Temporary phase 2–5 palette/primitive showcase |

---

## 7. Pixel glyph set

Replace all emoji with hand-drawn SVG glyphs on a 12×12 grid:

| Glyph | Replaces | Description |
|---|---|---|
| `glyph-water` | 💧 | 3 stacked horizontal bars (wave symbol) |
| `glyph-power` | ⚡ | Lightning bolt — diagonal pixel line |
| `glyph-co2` | 🌫️ | Cloud-like 3-step staircase |
| `glyph-temp` | 🌡️ | Vertical bar with circle base |
| `glyph-map` | 🗺️ | 4-pixel grid (2×2) |
| `glyph-balance` | ⚖️ | T-shape (scale bar + fulcrum) |
| `glyph-slider` | 🎚️ | 3 horizontal lines at different offsets |
| `glyph-arrows` | 🔄 | 4 direction arrows in a square |
| `glyph-ruler` | 📐 | L-shape pixel ruler |
| `glyph-check` | ✓ | Pixel checkmark (2 segments) |
| `glyph-u` | "U" avatar | Pixel letter U |

---

## 8. Isometric block primitive specification

**Projection:** 2:1 dimetric. For unit block of width `w` and height `h` (in isometric units):
- Top face: diamond, horizontal span = `w*2`, vertical span = `w` (2:1 ratio)
- Left face: parallelogram, top-left edge slopes down-left at 26.57°
- Right face: parallelogram, mirrored

**SVG coordinate formula** (for block at isometric position ix, iy, iz):
```
screen_x = origin_x + (ix - iy) * cell_w
screen_y = origin_y + (ix + iy) * cell_h/2 - iz * cell_h
```
where `cell_w` = horizontal projection width, `cell_h` = half of that.

**Three face colors** from `baseColor`:
- Top: `baseColor` (untouched, lightest)
- Left: `baseColor` darkened by 20%
- Right: `baseColor` darkened by 40%

**Shadow:** flat polygon cast at +1 unit in both x and y, `ink` at 0.12 opacity, `no blur`.

All coordinates snapped to integers. `shape-rendering: crispEdges` on all iso SVGs.

---

## 9. Motion specification

All animation must follow these rules:

| Type | Duration | Timing function | Notes |
|---|---|---|---|
| Page transition | 150ms | `linear` | Slide left/right on x-axis only |
| Cursor blink | 600ms | `steps(1)` | Solid block, binary on/off |
| Segment fill | 120ms per segment | `steps(1)` | Sequential, left to right |
| Cube roll (90° flip) | 160ms | `steps(4)` | 4-frame pixelated roll |
| Counter tick | 80ms per digit | `steps(1)` | Game score counter feel |
| Particle move | 180ms | `steps(3)` | 3-position jump and vanish |
| Hover state | 120ms | `linear` | Color swap only, no scale/translate |
| Column hover raise | 120ms | `steps(2)` | 2-frame lift |
| `prefers-reduced-motion` | 0ms | instant | Jump to final value |

No spring, no bounce, no cubic-bezier ease curves, no `hover:scale-*`, no translateY hovers.

---

## 10. Code-splitting plan

In `src/App.jsx`:
```jsx
const Explorer     = React.lazy(() => import('./pages/Explorer.jsx'))
const Compare      = React.lazy(() => import('./pages/Compare.jsx'))
const Sensitivity  = React.lazy(() => import('./pages/Sensitivity.jsx'))
const Alternatives = React.lazy(() => import('./pages/Alternatives.jsx'))
const Methodology  = React.lazy(() => import('./pages/Methodology.jsx'))
```

Suspense fallback: a blank `.page-header-bar` with "loading..." in `ink-soft`. No spinner.

Leaflet and Recharts are only imported inside Explorer, Compare, Sensitivity, Alternatives. They must never appear in Landing.jsx's dependency tree.

---

## 11. What is NOT changing

- `src/data/cities.js` — zero changes
- `src/data/scoring.js` — zero changes
- All scoring math, weights, thresholds, risk boundaries
- All routes and URL params
- All copy text (except one emoji removal in Landing.jsx scene 1)
- All numbers, statistics, citations, DOI, data-source credits, links
- The OpenStreetMap / CARTO map attribution

---

## 12. Definition of done audit (phase 6 checklist)

```
grep -r "rounded-" src/ index.html public/   # must return 0 results
grep -r "backdrop-blur" src/ index.html      # must return 0 results  
grep -r "shadow-" src/ index.html            # must return 0 results
grep -r "bg-gradient" src/ index.html        # must return 0 results
grep -r "text-gradient" src/ index.html      # must return 0 results
grep -r "glass" src/ index.html              # must return 0 results
grep -r "glow" src/ index.html               # must return 0 results
grep -r "Inter" src/ index.html              # must return 0 results
grep -r "JetBrains" src/ index.html          # must return 0 results
grep -rE "[💧⚡🌫️🌡️🗺️⚖️🎚️🔄📐📱🏭💡📍🟢🟡🟠🔴⚠️]" src/  # must return 0 results
grep -ri "edge" src/ index.html public/ | grep -v design-ref  # must return 0 results
```

Spot-check cities: Delhi, Kochi, Mumbai, Chennai on Explorer and Compare with URL params.
Check Sensitivity rankings under every preset scenario.
Verify landing counters reach real values (not stuck at 0.0 L / 0.000 kWh / 0.0 g).
