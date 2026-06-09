# Hero Physics Letters — Design Spec
**Date:** 2026-06-09  
**Project:** PPPPPPPP personal brand website  
**Scope:** Interactive physics for 8 "P" letters in the hero section

---

## Overview

Replace the static hero typography (`.hero-type`) with 8 individual "P" letters that:
- Stand completely still above Przemo's photo until the cursor disturbs them
- Get repelled by the cursor like opposite-polarity magnets
- Fall with gravity, bounce off the hero floor, and stay where they land
- On mobile: scatter on tap

---

## Decisions Made

| Decision | Choice | Reason |
|---|---|---|
| Initial state | Fully static | Contrast between stillness and chaos after interaction |
| Position | Above Przemo's head | Letters fly "over" the person in the photo |
| Mobile | Tap-to-scatter (single trigger) | Touch has no cursor; one good explosion is better than nothing |
| After falling | Letters stay fallen | No respawn; permanent result of interaction |

---

## HTML

Replace current `.hero-type` block with:

```html
<div class="hero-letters" aria-label="PPPPPPPP">
  <span class="hero-p" aria-hidden="true">P</span>  <!-- white -->
  <span class="hero-p" aria-hidden="true">P</span>  <!-- outlined white -->
  <span class="hero-p" aria-hidden="true">P</span>  <!-- white -->
  <span class="hero-p" aria-hidden="true">P</span>  <!-- orange -->
  <span class="hero-p" aria-hidden="true">P</span>  <!-- outlined white -->
  <span class="hero-p" aria-hidden="true">P</span>  <!-- white -->
  <span class="hero-p" aria-hidden="true">P</span>  <!-- violet -->
  <span class="hero-p" aria-hidden="true">P</span>  <!-- white -->
</div>
```

Accessibility: the container has `aria-label="PPPPPPPP"`, individual spans are `aria-hidden`.

---

## CSS

```css
.hero-letters {
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: none;
  overflow: hidden;
}

.hero-p {
  position: absolute;
  left: 0; top: 0;               /* JS positions via transform */
  font-family: var(--font-display);
  font-weight: 900;
  font-size: clamp(56px, 9vw, 140px);
  text-transform: uppercase;
  line-height: 1;
  letter-spacing: -.02em;
  user-select: none;
  pointer-events: none;
  will-change: transform;
  opacity: 0;                    /* hidden until JS places them */
  color: var(--white);
}

/* Per-letter color variants */
.hero-p:nth-child(2),
.hero-p:nth-child(5) {
  color: transparent;
  -webkit-text-stroke: 2px var(--white);
}
.hero-p:nth-child(4) { color: var(--orange); }
.hero-p:nth-child(7) { color: var(--violet); }
```

Remove: `.hero-type`, `.hero-word`, `.hw-1`, `.hw-2`, `.hw-3`, `.hw-4` and their responsive overrides.

---

## JavaScript — Physics IIFE

Self-contained IIFE appended to `main.js`. Does not touch other physics/scroll code.

### Initialization (on `window load`)

1. Query all `.hero-p` elements inside `#hero`
2. Measure `hero-photo` bounding box relative to `#hero` to find:
   - `photoCenterX` = photo left + photo width / 2
   - `photoTopY` = heroH - photo.offsetHeight  (photo is bottom-anchored)
3. Measure actual rendered letter width from first letter's `offsetWidth`
4. Compute `startX` = `photoCenterX - groupWidth / 2` (center group over photo)
5. Compute `startY` = `photoTopY - letterHeight * 1.5` (just above photo top)
6. Clamp `startX` so group stays within hero bounds
7. Set `transform: translate(x, y)` on each letter
8. Stagger `opacity: 1` with `setTimeout` (60ms between letters)

### Per-letter state object

```js
{
  el,           // DOM element
  x, y,         // current position (top-left of letter bounding box)
  vx, vy,       // velocity
  homeX, homeY, // initial position (used for bounds only)
  active,       // false = static, true = physics running
  w, h          // measured width/height
}
```

### Physics constants

| Constant | Value | Effect |
|---|---|---|
| `GRAVITY` | 0.25 px/frame² | Downward pull |
| `DAMPING` | 0.97 | Air resistance (applied each frame) |
| `BOUNCE` | 0.38 | Energy retained on floor collision |
| `REPEL_R` | 140 px | Cursor influence radius |
| `REPEL_STR` | 14 px/frame | Max repulsion velocity added |
| `FLOOR_PAD` | 120 px | Distance from hero bottom kept clear for CTA |

### RAF tick (runs always)

For each letter:

**If `active = false` (static):**
- No movement
- Check cursor proximity: `dist = hypot(letter.centerX - mouseX, letter.centerY - mouseY)`
- If `dist < REPEL_R`:
  - Set `active = true`
  - Compute impulse vector (away from cursor), magnitude proportional to `(1 - dist/REPEL_R) * REPEL_STR`
  - Add small random jitter to vx (±1.5 px/frame)
  - Set vy to slightly negative component (brief upward kick before gravity wins)

**If `active = true` (physics):**
1. Cursor repulsion (reduced strength `REPEL_STR * 0.5` while in flight)
2. `vy += GRAVITY`
3. `vx *= DAMPING; vy *= DAMPING`
4. `x += vx; y += vy`
5. Floor: if `y + h > heroH - FLOOR_PAD` → clamp y, `vy *= -BOUNCE`, `vx *= 0.78`; if `|vy| < 0.8` set `vy = 0`
6. Left wall: if `x < 0` → clamp, `vx *= -0.45`
7. Right wall: if `x + w > heroW` → clamp, `vx *= -0.45`
8. Ceiling: if `y < 60` → clamp, `vy = |vy| * 0.3`
9. Apply: `el.style.transform = translate(x, y)`

### Mouse tracking

`document.addEventListener('mousemove')` → compute position relative to `heroEl.getBoundingClientRect()` → store as `heroMouseX`, `heroMouseY`. Initialized to `-9999` (off-screen) so letters don't activate before cursor enters.

### Mobile touch

`heroEl.addEventListener('touchstart', { once: true })`:
- On first tap: all inactive letters simultaneously get random scatter impulse
- `vx = (Math.random() - 0.5) * 20`, `vy = -(Math.random() * 8 + 4)`
- All set `active = true`

### Resize handling

`window.addEventListener('resize')` with 200ms debounce:
- Re-run initialization to recalculate positions
- Already-active (fallen) letters: keep same absolute x, clamp to new hero bounds; adjust y to new floor level if below it

---

## Files Changed

| File | Change |
|---|---|
| `index.html` | Replace `.hero-type` with `.hero-letters` |
| `css/style.css` | Remove hero-word styles, add `.hero-letters` + `.hero-p` styles |
| `js/main.js` | Remove heroWords parallax + entrance anim; add physics IIFE |
| `CHANGES.md` | Document v0.4 |

---

## Out of Scope

- Respawn / return to home position (user chose A — stay fallen)
- Letter–letter collision detection (adds complexity, not requested)
- Letter rotation during fall (user chose static initial state, rotation would look inconsistent)
- Sound effects
