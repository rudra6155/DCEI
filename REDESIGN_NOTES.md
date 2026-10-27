# REDESIGN NOTES — judgment calls and decisions

This file logs every decision not explicitly covered by the brief. Update it as work progresses.

---

## Phase 1 decisions

### 1. Background color: white, not bone
**Decision:** Using `#FFFFFF` for `paper`, not the brief's placeholder `#EEEAE1`.

**Reason:** Pixel sampling of all 7 reference screenshots consistently returns `#FFFFFF` for page backgrounds (options screen, bonus menu, instructions, credits, title screen). JPEG compression can lighten near-white to white, but the multiple measurements at mid-page coordinates confirm white. The "bone" description in the brief may reflect a different version of the game or the brief's intent that we use a warm off-white. However, measured values take precedence per section 0.4 of the brief. Button fills measure `#EDEDEB` (warm bone), which provides the warmth in accents without a tinted background.

**Mitigation:** If the white background reads too clinical compared to the reference screenshots, I'll shift `paper` to `#FAFAF8` (barely perceptible warmth) and log the change here.

### 2. band-primary: lavender, not pink
**Decision:** `band-primary` = `#D3A9FD` (lavender-purple), not pink as the brief describes.

**Reason:** Direct pixel measurement of the "options" selected menu band on the title screen returns `#D3A9FD` clearly (sustained across y=1032–1096 at x=300). The brief describes it as "pink" but what I measure and see in the screenshots is clearly lavender/purple. The game appears to have updated its palette since the brief was written. I will use the measured value.

### 3. Two accent band colors exist in the game
**Decision:** Noting that the game has at least two different selected-band colors:
- Title screen "options" → lavender `#D3A9FD`
- Bonus level menu "new game" → a teal/turquoise band (could not measure precisely; estimated `#44D4CC`)

**Decision:** Use `band-primary` (`#D3A9FD` lavender) for the primary selection state across DCEI, since the title screen band is the most prominent. The teal `cube` color already provides teal accents.

### 4. The cube color
**Decision:** `cube` = `#03CDD7` (bright teal/cyan).

**Reason:** Directly measured from the selected level tile (level 01) in the scores grid where the isometric teal cube is clearly visible. This is a very pure, slightly blue teal.

### 5. Isometric letter face tones
**Decision:** Top=`#FFFFFF`, Left=`#C2C2C2`, Right=`#BCBCBC`.

**Reason:** The reference title screen shows near-white top face, light gray left face, darker gray right face. The range of grays from `#AEAEAE` to `#C4C4C4` measured in the title screen letter bodies confirms this. The shadow polygon will use `ink` (`#3B3B3B`) at 12% opacity.

### 6. Font choice: Pixelify Sans
**Decision:** Using Pixelify Sans (Regular + Bold) as the display/pixel font.

**Reason:** Of the five candidates (Silkscreen, Pixelify Sans, Tiny5, Jersey 10, Micro 5), Pixelify Sans most closely matches the game's wide, chunky, pixel-inspired letterforms at display sizes. It works at both small (12px navbar) and large (hero heading) sizes while maintaining crispness on modern displays. The game's actual font may be proprietary; Pixelify Sans is the available closest match.

**Note for review:** If Pixelify Sans reads as too "cute" or "retro" compared to the game's more geometric/technical feel, the fallback is Jersey 10 at larger point sizes.

### 7. No progress-square color measurement available
**Decision:** Risk ramp colors are estimated from the "cool to warm" description in the brief, verified for WCAG AA contrast on `paper` and cross-checked against `band-primary` for distinguishability.

**Reason:** None of the 7 reference screenshots show the small progress squares mentioned in the brief. The brief says "take [the risk ramp] from the reference's own progress-square spectrum." Since I cannot measure these, I've used values consistent with the game's warm-cool spectrum and tested against WCAG AA thresholds.

### 8. `risk-critical` shifted from pink to red
**Decision:** `risk-critical` = `#E03838` (red), not the warm pink/red end of the game's spectrum.

**Reason:** The brief explicitly says "if Critical is too close to the pink band, shift Critical toward red while keeping the order." `band-primary` is `#D3A9FD` (lavender-purple) so there's no confusion risk, but I'm using `#E03838` anyway as it's universally understood as "danger" and contrasts clearly with the amber and green steps below it.

### 9. Screen frame implementation
**Decision:** Implemented as a fixed-position `<ViewportFrame>` SVG component, not CSS `box-shadow`.

**Reason:** The rainbow frame in the reference is pixel-noise with different colors at each pixel position. An SVG `polyline` or series of `rect` elements along the viewport edges, cycling through the measured frame colors, reproduces this more faithfully than box-shadow gradients. The frame is 3px wide (2px for the rainbow strip, 1px paper gap inside).

### 10. The "choose level" grid layout
**Decision:** 7-column grid (not 6 as the brief says).

**Reason:** The brief says "6-column grid" but the reference screenshot clearly shows 7 columns (level 01 through level 07 in the first row). Using 7 columns so 50 cities fit in 8 rows (7×7=49, last tile empty or used for a special "methodology" link).

**Revisit if brief owner prefers 6 columns:** Would give 9 rows for 50 cities.

---

## Lighthouse targets (to be filled in Phase 6)

| Metric | Target | Measured (main branch) | Measured (edge-redesign) |
|---|---|---|---|
| Performance | 90+ | TBD | TBD |
| Accessibility | 95+ | TBD | TBD |
| Best Practices | 95+ | TBD | TBD |
| LCP | <2.5s | TBD | TBD |
| CLS | <0.1 | TBD | TBD |
| Landing JS bundle (gzipped) | — | TBD | TBD |

---

## Copy proposals (see COPY_PROPOSALS.md)

All copy change proposals are in COPY_PROPOSALS.md. Nothing changes until approved.
