# Hero v0.5 — Word Cycle + Gradient + Rotation Physics Design

**Date:** 2026-06-10
**Project:** PPPPPPPP personal brand website
**Scope:** Three enhancements to the hero physics letters

---

## Overview

Three changes to the existing hero physics IIFE (v0.4):

1. **Uniform P color with gradient** — all 8 physics P letters get the same style (no color variants), colored by position across a violet→orange gradient.
2. **Word display layer** — beneath the physics P's, 8 text slots cycle through PRODUKT → PROCES → PROJEKT with a fast editorial per-slot slide animation.
3. **Rotation physics** — falling letters gain angular velocity proportional to cursor impulse direction, tumble during flight, and damp on floor bounce.

---

## Decisions Made

| Decision | Choice |
|---|---|
| Slot count | 8 (consistent with PPPPPPPP brand, gradient across all 8) |
| Word cycle order | PRODUKT → PROCES → PROJEKT |
| Pause between words | 1.5s |
| Shorter words | Padded with trailing spaces to 7 chars (after the P) |
| Animation style | Fast translateY slide per slot — editorial, not skeuomorphic |
| Slot stagger | 25ms left-to-right |
| Rotation trigger | Angular velocity proportional to cursor impulse direction (C) |
| Gradient behavior | Color stays with each physics letter as it falls |

---

## Gradient

Violet `#7C60EC` (slot 0) → Orange `#FE5200` (slot 7), linearly interpolated per slot:

```
r(i) = round(0x7C + (0xFE - 0x7C) * i / 7)
g(i) = round(0x60 + (0x52 - 0x60) * i / 7)
b(i) = round(0xEC + (0x00 - 0xEC) * i / 7)
```

Applied as `color: rgb(r, g, b)` on both the physics `.hero-p` element and its corresponding `.hero-slot`.

---

## Word Display Layer

### HTML

Add `.hero-word` container before `.hero-letters` in `#hero`:

```html
<div class="hero-word" aria-hidden="true">
  <span class="hero-slot"><span class="slot-cur">P</span><span class="slot-nxt">P</span></span>
  <span class="hero-slot"><span class="slot-cur"> </span><span class="slot-nxt"> </span></span>
  <span class="hero-slot"><span class="slot-cur"> </span><span class="slot-nxt"> </span></span>
  <span class="hero-slot"><span class="slot-cur"> </span><span class="slot-nxt"> </span></span>
  <span class="hero-slot"><span class="slot-cur"> </span><span class="slot-nxt"> </span></span>
  <span class="hero-slot"><span class="slot-cur"> </span><span class="slot-nxt"> </span></span>
  <span class="hero-slot"><span class="slot-cur"> </span><span class="slot-nxt"> </span></span>
  <span class="hero-slot"><span class="slot-cur"> </span><span class="slot-nxt"> </span></span>
</div>
```

### CSS

```css
.hero-word {
  position: absolute;
  z-index: 3;            /* below physics layer (z-index: 4) */
  pointer-events: none;
  display: flex;
  align-items: flex-start;
  /* JS sets: left, top, gap — all matching initPhysics() computed values */
}

.hero-slot {
  position: relative;
  overflow: hidden;
  font-family: var(--font-display);
  font-weight: 900;
  font-size: clamp(56px, 9vw, 140px);
  line-height: 1;
  letter-spacing: -.02em;
  user-select: none;
  /* width/height set by JS to match letterW/letterH */
}

.slot-cur,
.slot-nxt {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  display: flex;
  align-items: flex-start;
  transition: transform 100ms ease-in-out;
}

.slot-nxt {
  transform: translateY(100%);
}
```

### Slot animation

Triggered per-slot with 25ms stagger. For slot `i`, at `t = i * 25`ms:

1. `.slot-cur` → `transform: translateY(-100%)` (slides out upward)
2. `.slot-nxt` → `transform: translateY(0)` (slides in from below)
3. After transition ends (100ms): swap text, reset transforms instantly (no transition), ready for next cycle

### Word data

```js
const WORDS = [
  ['P','R','O','D','U','K','T',' '],  // PRODUKT + 1 space
  ['P','R','O','C','E','S',' ',' '],  // PROCES  + 2 spaces
  ['P','R','O','J','E','K','T',' '],  // PROJEKT + 1 space
];
const WORD_PAUSE = 1500;   // ms between words
const SLOT_STAGGER = 25;   // ms between slots
const SLOT_ANIM = 100;     // ms per slot transition
```

### Timing

- Word display initialises after `initPhysics()` completes
- First cycle starts after `800ms` delay (letters have staggered in by ~560ms + buffer)
- Cycles continuously: PRODUKT → PROCES → PROJEKT → PRODUKT → ...
- Cycle never stops, regardless of physics state

### Initial state

On init, `.slot-cur` in all slots shows the corresponding letter from PRODUKT (first word). Gradient color is applied to each `.hero-slot`.

---

## Physics Letters (Changes from v0.4)

### Color

Remove all `nth-child` color rules. Each `.hero-p` gets `color` set by JS on init using the gradient formula above.

### Rotation state

Add to per-letter state object:

```js
{
  // ... existing fields (el, x, y, vx, vy, homeX, homeY, active, w, h)
  angle:  0,    // degrees, current rotation
  omega:  0,    // degrees/frame, angular velocity
}
```

### Physics constants (additions)

```js
const OMEGA_STR   = 8;    // max angular speed on activation (deg/frame)
const ANG_DAMPING = 0.96; // angular velocity damping per frame
const ANG_BOUNCE  = 0.35; // angular velocity retained on floor bounce
```

### Activation (cursor repel)

When a static letter is activated by cursor:

```js
lt.omega = (dx / dist) * OMEGA_STR + (Math.random() - 0.5) * 2;
```

`dx` = letter center X minus cursor X. Positive dx (cursor left of letter) → positive omega → clockwise spin. Natural feel.

### RAF tick (additions)

Each frame, for active letters:

```js
lt.angle += lt.omega;
lt.omega *= ANG_DAMPING;

// Floor bounce — damp and reverse angular velocity
if (floor_collision) {
  lt.omega *= -ANG_BOUNCE;
}

lt.el.style.transform = `translate(${lt.x}px,${lt.y}px) rotate(${lt.angle}deg)`;
```

### Physics letters z-index

`.hero-p` stays at z-index: 4, `.hero-word` at z-index: 3. Physics P's visually cover word display slots until they fall away.

---

## Files Changed

| File | Change |
|---|---|
| `index.html` | Add `.hero-word` with 8 `.hero-slot` elements before `.hero-letters` |
| `css/style.css` | Add `.hero-word`, `.hero-slot`, `.slot-cur`, `.slot-nxt` styles; remove `.hero-p` nth-child color variants |
| `js/main.js` | In physics IIFE: add gradient color init, add `angle`/`omega` state, update tick for rotation, add `initWordCycle()` function |
| `CHANGES.md` | Document v0.5 |

---

## Out of Scope

- Letter–letter collision detection
- Word display pausing when all letters have fallen
- Cursor interacting with word display characters
- Reversing / respawning physics letters
