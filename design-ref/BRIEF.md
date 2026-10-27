# DCEI "EDGE" REDESIGN BRIEF (v2)

This file is the authoritative brief for the redesign. Re-read it at the start of every phase.

The full brief text is in `REDESIGN_PLAN.md` section 0 and in the original prompt.

## Quick reference — constraints that must never be forgotten

- NEVER change any value in `cities.js` or `scoring.js`
- NEVER change routes, URL params, search/sort/filter behavior  
- NEVER change any copy text (one emoji removal in Landing.jsx scene 1 allowed)
- NEVER use the name "EDGE" or "Mobigame" anywhere in code, comments, or visible text
- NEVER add three.js, react-three-fiber, GSAP, icon libraries, or UI kits
- NEVER respond to prefers-color-scheme; light theme only
- The OpenStreetMap / CARTO attribution on maps is legally required — keep it

## Allowed logic changes only

- `getRiskColor` and `getRiskBgColor` may return new color values (same thresholds)
- Fix the `Scene` ref-forwarding bug in Landing.jsx (scene3Ref/scene4Ref counters stuck at 0)
- New presentation-only components and hooks
- Temporary `/design-check` route in phases 2–5 (delete in phase 6)

## Phase checklist

- [ ] Phase 1: REDESIGN_PLAN.md — measured tokens, font decision, per-file plan (STOP)
- [ ] Phase 2: tailwind.config.js + index.css + index.html + all primitives on /design-check (STOP)
- [ ] Phase 3: Navbar + Footer + favicon + Landing (STOP)
- [ ] Phase 4: Explorer (STOP)
- [ ] Phase 5: Compare + Sensitivity + Alternatives + Methodology (STOP)
- [ ] Phase 6: Cleanup + audit + push to Vercel (STOP, do NOT merge to main)
