# DCEI Correction Plan — Phase 1 Report

Generated: 2026-10-27  
Branch: edge-redesign  
Reference images: `design-ref/edge game designs/` (10 screenshots, 1000×1600px each)

---

## 1. Page redesign status

| Page | File | Redesigned? | Notes |
|---|---|---|---|
| Landing | src/pages/Landing.jsx | ✓ Yes | All 6 scenes rewritten |
| Explorer | src/pages/Explorer.jsx | ✓ Yes | Map + table + CityCard |
| Compare | src/pages/Compare.jsx | ✓ Yes | Radar + bar + param table |
| Sensitivity | src/pages/Sensitivity.jsx | ✓ Yes | Sliders + heatmap |
| Alternatives | src/pages/Alternatives.jsx | ✓ Yes | Map + result cards |
| Methodology | src/pages/Methodology.jsx | ✓ Yes | TOC + sections |
| Navbar | src/components/Navbar.jsx | ✓ Yes | Fixed gray bar |
| Footer | src/components/Footer.jsx | ✓ Yes | Light footer |

All 5 dashboard pages and shared components were redesigned. No page was left on the dark theme.

---

## 2. Items from CORRECTION.md confirmed in current code

### ✓ Correct
- Background: `paper: #FFFFFF` ✓
- Header bar color: `bar: #7D7D7D` ✓
- Ink/text: `ink: #3B3B3B` ✓
- Band lavender: `band-primary: #D3A9FD` ✓ (pixel sampled, exact match)
- Row yellow: `select: #FFD275` ✓ (pixel sampled, confirmed)
- Panel-grey area: `#D2D2D2` ✓ (pixel sampled from result screen)
- Well/scores bg: `#A9A9A9` ✓ (pixel sampled from scores screen)
- Tile split: light `#CECECE` / dark `#A9A9A9` ✓ (pixel sampled)
- Band teal: `#69EACE` ✓ (pixel sampled from bonus level screen)
- Rainbow viewport frame: ViewportFrame component ✓
- Square corners (border-radius: 0 everywhere) ✓
- PageHeader component with gray bar ✓
- Panel with ink border ✓
- SegMeter replacing gradient bars ✓
- data_confidence field used correctly in CityCard.jsx ✓

### ✗ Wrong — must fix
1. **Font**: Pixelify Sans is bold/chunky. Reference uses thin square pixel font (Micro 5 or equivalent)
2. **Cube color**: `cube: #03CDD7` (teal) — reference cube is `#9D55FF` purple (pixel sampled ≈#9A57FF)
3. **band-focus**: `#61F690` — should be `#5EFB90` (pixel sampled from options screen)
4. **pink-hot: #FF3D8F** — invented color, not in reference; REMOVE
5. **box-shadow glows on panels** — BANNED per correction doc; added in last commit; REMOVE
6. **text-shadow glows on numbers** — BANNED; added in last commit; REMOVE
7. **Colored numbers** (orange/cyan/pink on digits) — BANNED; all numbers → #7D7D7D or #3B3B3B
8. **Copy violations** — 4 strings changed without approval; RESTORED below
9. **Eyebrow labels** ("THE COST", "THE JOURNEY" etc.) still present in Landing.jsx — replace with header bars
10. **Card grids** (FrameworkCard, StatCard, journey step cards) — replace with label/value rows
11. **Centered layouts** — Landing scenes are centered; should be left-aligned and dense
12. **Stray scroll-to-top button** (absolute bottom-4 right-4) in Scene 6 — REMOVE
13. **Title stage missing** — no isometric "DCEI" letters, no cube on top
14. **India map has hardcoded risk colors** — must derive from `scoreAllCities` output
15. **No rolling cube in journey scene** — Scene 2 is flat 2D
16. **Footer strip missing** on landing page — dark #3C3C3C strip with small text

---

## 3. Re-measured palette

Pixel-sampled from reference screenshots (1000×1600px JPEG, JPEG artifacts noted):

| Token | Current | Corrected | Source |
|---|---|---|---|
| page | #FFFFFF | #FFFFFF | ✓ no change |
| bar | #7D7D7D | #7D7D7D | ✓ no change |
| ink | #3B3B3B | #3B3B3B | ✓ no change |
| ink-soft | #818181 | #7D7D7D | unify with bar measurement |
| band-primary (lilac) | #D3A9FD | #D3A9FD | ✓ no change |
| band-focus (mint) | #61F690 | #5EFB90 | pixel sampled options screen |
| select (yellow) | #FFD275 | #FFD275 | ✓ pixel sampled (~#FDCF77 JPEG) |
| cube | #03CDD7 | #9D55FF | pixel sampled instructions screen |
| cube-dark (NEW) | — | #3901AA | doc value |
| pink-accent | #FDA9B6 | #FDA9B8 | pixel sampled (~#E7ABB7 JPEG) |
| pink-hot | #FF3D8F | REMOVE | not in reference |
| well (NEW) | — | #A9A9A9 | pixel sampled scores screen |
| tile-light (NEW) | — | #CECECE | pixel sampled scores screen |
| panel-grey (NEW) | — | #D2D2D2 | pixel sampled result screen |
| band-teal (NEW) | — | #69EACE | pixel sampled bonus level |
| lime (NEW) | — | #C7F439 | doc value (JPEG ~#EEF11A) |
| s-rank (NEW) | — | #FEB39C | pixel sampled result screen |
| footer-strip (NEW) | — | #3C3C3C | ≈ #3B3B3B |
| paper-2 | #EDEDEB | KEEP | useful for alternating rows |
| paper-3 | #F0F0EE | KEEP | useful for inset wells |

---

## 4. Font analysis

**Reference font characteristics (from screenshots):**
- Stroke weight: thin (1 pixel unit at the pixel grid)
- Letterform style: square, geometric, wide proportions
- Case: lowercase-forward, but uppercase supported
- Spacing: monospaced or near-monospaced
- Letter "o": very rectangular/square
- Letter "s"/"S": blocky, distinctive
- Digits: clear at display sizes; "5" can resemble "S" at very small sizes

**Candidate fonts evaluated (visual match against reference screenshots):**

| Font | Match | Reason |
|---|---|---|
| **Micro 5** | ★★★★★ | 5×5 pixel grid, thin strokes, square geometric, exactly matches weight and proportions |
| Tiny5 | ★★★★☆ | Similar to Micro 5; slightly different "a" and "e" forms |
| Silkscreen | ★★★☆☆ | Slightly too bold and condensed; wrong weight |
| Workbench | ★★☆☆☆ | Different style entirely; not pixel grid |
| Pixelify Sans (current) | ★★☆☆☆ | Too bold/chunky, not square, wrong proportions |
| VT323 (added last commit) | ★★☆☆☆ | CRT terminal style; too tall and narrow |

**Recommendation: Micro 5** (Google Fonts: `family=Micro+5`)

**Number handling:**
Micro 5's "5" is visually close to "S" at < 16px (confirmed by viewing "S36" in scores screen tile labels where "5" renders like "S"). Per correction doc rule: use **Space Mono** for all numeric data.

Font map:
- `font-pixel` → `font-pixel` renamed to `font-game` using **Micro 5** for all word text, labels, menus, headers
- `font-mono` → **Space Mono** (unchanged) for all numbers and long paragraphs
- `font-num` (VT323, added last commit) → REMOVE; use Space Mono for numbers

---

## 5. Copy violations and restoration

### Strings restored to original `main` values

| Location | Was (wrong) | Restored to (original, lowercase only change) |
|---|---|---|
| Landing Scene 1 hero title | "DCEI measures it." | "Every AI query has a hidden cost. Let us show you." |
| Landing Scene 5 framework h2 | "DCEI measures what other frameworks skip." | "DCEI measures what no one is measuring." |
| Landing Scene 6 CTA h2 | "50 cities. 4 indices. Open methodology." | "Explore 50 cities. 4 indices. Zero greenwashing." |
| Landing Scene 6 sub | "Government data. Transparent weights. Published on Zenodo." | "Real government data. Transparent methodology. Honest scores." |

Proposed rewrites → see `COPY_PROPOSALS.md` for approval.

### Other copy items confirmed correct (unchanged from main)
- "Hey Claude, will AI take my job?" ✓
- "Message sent — processing query…" ✓
- "Every AI query has a hidden cost." ✓
- All per-query stat labels and values ✓
- All attribution/citation strings ✓

---

## 6. Stray element: scroll-to-top button

In Landing.jsx Scene 6, there is:
```jsx
<button
  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
  className="absolute bottom-4 right-4 border border-ink/30 p-2 ..."
>
  <PixelGlyph name="arrow-left" size={8} color="currentColor" style={{ transform: 'rotate(90deg)' }} />
```

This is a scroll-to-top button using a rotated `arrow-left` PixelGlyph. At 8×8 pixels rotated 90°, this renders as a small ambiguous shape that can look like a box with a "+" or cross inside. **Remove it.**

---

## 7. Phase plan

| Phase | Work | Status |
|---|---|---|
| 1 | CORRECTION_PLAN.md + palette + font + copy restore | ✓ This document |
| 2 | Tokens, Micro 5 font, remove glows/eyebrows, updated primitives, /design-check | Pending |
| 3 | Landing: title stage (isometric DCEI letters + cube), all floors with header bars + menu rows | Pending |
| 4 | City result screen + Explorer (scores grid) | Pending |
| 5 | Compare, Sensitivity, Alternatives, Methodology | Pending |

---

## 8. Self-check Phase 1

- [x] All 8 reference screenshots read and analysed
- [x] Pixel colors sampled from key areas in each screenshot
- [x] Corrected palette table produced with source
- [x] Font analysed — Micro 5 recommended with justification
- [x] All 4 copy violations identified and restored
- [x] Stray element identified and explained
- [x] data_confidence field confirmed correct in code
- [x] All wrong items enumerated (16 items in section 2)
