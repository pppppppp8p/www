# Hero Physics Letters — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static hero headline with 8 interactive "P" letters that stand still above Przemo's photo, get repelled by the cursor like opposite-polarity magnets, fall with gravity, and stay where they land.

**Architecture:** Three file changes — HTML structure swap, CSS style swap, JS parallax cleanup + physics IIFE append. No build step; verify by opening `index.html` in a browser.

**Tech Stack:** Pure HTML/CSS/JS. Oddval Bold 900 font. `requestAnimationFrame` physics loop. No dependencies.

---

## File Map

| File | Change |
|---|---|
| `index.html` | Replace `.hero-type` div with `.hero-letters` div containing 8 `.hero-p` spans |
| `css/style.css` | Remove `.hero-type / .hero-word / .hw-1–.hw-4` blocks + their media query overrides; add `.hero-letters` + `.hero-p` styles |
| `js/main.js` | Remove `heroWords`, `speeds`, `heroWords.forEach` in scroll handler, hero entrance anim block; append physics IIFE |
| `CHANGES.md` | Document v0.4 |

---

## Task 1: HTML — swap hero typography block

**Files:**
- Modify: `index.html` lines 62–67

- [ ] **Step 1: Open `index.html`. Find and replace the `.hero-type` block**

Current block (lines 62–67):
```html
    <!-- Giant editorial typography -->
    <div class="hero-type" aria-hidden="true">
      <span class="hero-word hw-1">Pomagam</span>
      <span class="hero-word hw-2">Markom</span>
      <span class="hero-word hw-3">Być takimi,</span>
      <span class="hero-word hw-4">o których się mówi.</span>
    </div>
```

Replace with:
```html
    <!-- Interactive P letters — physics-driven -->
    <div class="hero-letters" aria-label="PPPPPPPP">
      <span class="hero-p" aria-hidden="true">P</span>
      <span class="hero-p" aria-hidden="true">P</span>
      <span class="hero-p" aria-hidden="true">P</span>
      <span class="hero-p" aria-hidden="true">P</span>
      <span class="hero-p" aria-hidden="true">P</span>
      <span class="hero-p" aria-hidden="true">P</span>
      <span class="hero-p" aria-hidden="true">P</span>
      <span class="hero-p" aria-hidden="true">P</span>
    </div>
```

- [ ] **Step 2: Verify HTML structure is correct**

Open `index.html` in a text editor and confirm:
- No `.hero-type` div remains in the file
- `.hero-letters` div is present with exactly 8 `.hero-p` spans
- `aria-label="PPPPPPPP"` is on the container

---

## Task 2: CSS — swap hero type styles

**Files:**
- Modify: `css/style.css`

- [ ] **Step 1: Remove the `.hero-type` block**

Find and delete this entire block (including the comment line):
```css
/* Giant type composition — right half of screen, editorial magazine */
.hero-type {
  position: relative;
  z-index: 4;
  padding: 120px 0 0;
  pointer-events: none;
  user-select: none;
  text-align: right;
}
```

- [ ] **Step 2: Remove the `.hero-word` block**

Find and delete:
```css
.hero-word {
  display: block;
  font-family: var(--font-display);
  font-weight: 700;
  text-transform: uppercase;
  line-height: .88;
  letter-spacing: -.03em;
  will-change: transform;
}
```

- [ ] **Step 3: Remove the four `.hw-*` blocks**

Find and delete (each as one operation):
```css
/* Line 1: POMAGAM — right-aligned, massive */
.hw-1 {
  font-size: clamp(70px, 12.5vw, 182px);
  color: var(--white);
  padding-right: 40px;
}
```
```css
/* Line 2: MARKOM — outlined, slightly inset */
.hw-2 {
  font-size: clamp(70px, 12.5vw, 182px);
  color: transparent;
  -webkit-text-stroke: 2px var(--white);
  padding-right: clamp(40px, 6vw, 120px);
}
```
```css
/* Line 3: BYĆ TAKIMI, — muted, right */
.hw-3 {
  font-size: clamp(34px, 6vw, 88px);
  color: var(--grey-mid);
  padding-right: 40px;
  margin-top: .06em;
}
```
```css
/* Line 4: O KTÓRYCH SIĘ MÓWI. — orange, right */
.hw-4 {
  font-size: clamp(34px, 6vw, 88px);
  color: var(--orange);
  padding-right: 40px;
  margin-top: .04em;
}
```

- [ ] **Step 4: Remove hero-type/hw-* overrides from the 900px media query**

Inside `@media (max-width: 900px)`, find and delete these four lines:
```css
  .hw-1, .hw-2 { font-size: clamp(44px, 13vw, 100px); }
  .hw-3, .hw-4 { font-size: clamp(24px, 7.5vw, 56px); }
  .hero-type { text-align: left; padding: 120px 20px 0; }
  .hw-1, .hw-2, .hw-3, .hw-4 { padding-right: 20px; padding-left: 0; }
```

- [ ] **Step 5: Remove hw-* overrides from the 480px media query**

Inside `@media (max-width: 480px)`, find and delete:
```css
  .hw-1, .hw-2 { font-size: clamp(36px, 14vw, 72px); }
  .hw-3, .hw-4 { font-size: clamp(20px, 8vw, 40px); }
```

- [ ] **Step 6: Add the new hero-letters + hero-p styles**

Find the `/* Przemo photo */` comment block (starts `/* Przemo photo — left side...`). Insert the following block **directly above** that comment:

```css
/* ============================================================
   HERO — Interactive P letters
   ============================================================ */
.hero-letters {
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: none;
  overflow: hidden;
}

.hero-p {
  position: absolute;
  left: 0;
  top: 0;
  font-family: var(--font-display);
  font-weight: 900;
  font-size: clamp(56px, 9vw, 140px);
  text-transform: uppercase;
  line-height: 1;
  letter-spacing: -.02em;
  user-select: none;
  pointer-events: none;
  will-change: transform;
  opacity: 0;
  color: var(--white);
}

/* Alternating color variants — brand palette */
.hero-p:nth-child(2),
.hero-p:nth-child(5) {
  color: transparent;
  -webkit-text-stroke: 2px var(--white);
}
.hero-p:nth-child(4) { color: var(--orange); }
.hero-p:nth-child(7) { color: var(--violet); }
```

- [ ] **Step 7: Browser check — open index.html**

Expected: hero section shows no typography at all (letters are `opacity: 0` until JS runs). No layout shift. Photo still visible on left. CTA still at bottom. No console errors about missing CSS classes.

---

## Task 3: JS — remove dead heroWords code

**Files:**
- Modify: `js/main.js`

- [ ] **Step 1: Remove the three dead declarations at the top of the scroll section**

Find and remove these three lines (lines 58–60):
```js
const heroWords  = document.querySelectorAll('.hero-word');
const heroPhoto  = document.querySelector('.hero-photo');
const speeds     = [0.03, 0.08, 0.015, 0.10];
```

Replace with just the one line that's still needed:
```js
const heroPhoto  = document.querySelector('.hero-photo');
```

- [ ] **Step 2: Remove the heroWords.forEach call inside the scroll handler**

Inside the scroll event listener, find and delete:
```js
  // Hero parallax
  heroWords.forEach((el, i) => {
    el.style.transform = `translateY(${-y * (speeds[i] || 0.05)}px)`;
  });
```

Leave the photo parallax line intact:
```js
  if (heroPhoto) heroPhoto.style.transform = `translateY(${-y * 0.05}px)`;
```

- [ ] **Step 3: Remove the hero headline entrance animation block**

Find and delete the entire block (lines 99–108):
```js
// ─── Hero headline entrance animation ────────────────────────
document.querySelectorAll('.hero-word').forEach((el, i) => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = `opacity .65s ease ${i * .12 + .08}s, transform .65s ease ${i * .12 + .08}s`;
  setTimeout(() => {
    el.style.opacity   = '1';
    el.style.transform = 'translateY(0)';
  }, 60);
});
```

- [ ] **Step 4: Verify main.js still has no references to `.hero-word`**

Search the file for the string `hero-word` — expect zero results.

---

## Task 4: JS — append physics IIFE

**Files:**
- Modify: `js/main.js` (append after the accordion block)

- [ ] **Step 1: Append the complete physics IIFE to the end of `main.js`**

Add the following block after the last line of the accordion handler:

```js
// ─── Hero P letters — interactive physics ────────────────────
(function heroPhysics() {
  const heroEl = document.getElementById('hero');
  if (!heroEl) return;

  const letterEls = Array.from(heroEl.querySelectorAll('.hero-p'));
  if (!letterEls.length) return;

  // Hero-relative mouse position (off-screen until cursor enters)
  let heroMouseX = -9999;
  let heroMouseY = -9999;

  document.addEventListener('mousemove', e => {
    const r = heroEl.getBoundingClientRect();
    heroMouseX = e.clientX - r.left;
    heroMouseY = e.clientY - r.top;
  });

  const GRAVITY   = 0.25;  // px/frame²
  const DAMPING   = 0.97;  // velocity multiplier per frame
  const BOUNCE    = 0.38;  // energy retained on floor hit
  const REPEL_R   = 140;   // cursor influence radius (px)
  const REPEL_STR = 14;    // max repulsion impulse (px/frame)
  const FLOOR_PAD = 120;   // keep this many px above hero bottom

  const state = [];

  function initPhysics() {
    state.length = 0;

    const heroW  = heroEl.offsetWidth;
    const heroH  = heroEl.offsetHeight;
    const photo  = heroEl.querySelector('.hero-photo');

    // Temporarily make first letter visible at (0,0) to measure it
    const sample = letterEls[0];
    const savedOpacity    = sample.style.opacity;
    const savedTransform  = sample.style.transform;
    sample.style.opacity  = '0';
    sample.style.transform = 'translate(0,0)';

    const letterW = sample.offsetWidth;
    const letterH = sample.offsetHeight;

    sample.style.opacity   = savedOpacity;
    sample.style.transform = savedTransform;

    const gap    = Math.max(4, Math.round(letterW * 0.07));
    const groupW = letterW * letterEls.length + gap * (letterEls.length - 1);

    // Center the group above the photo's horizontal center
    let centerX, startY;
    if (photo) {
      const pRect = photo.getBoundingClientRect();
      const hRect = heroEl.getBoundingClientRect();
      centerX = pRect.left - hRect.left + pRect.width * 0.5;
      const photoTopY = pRect.top - hRect.top;
      startY  = Math.max(80, photoTopY - letterH * 1.6);
    } else {
      centerX = heroW * 0.35;
      startY  = heroH * 0.2;
    }

    // Clamp group within hero bounds
    let startX = centerX - groupW * 0.5;
    startX = Math.max(10, Math.min(startX, heroW - groupW - 10));

    letterEls.forEach((el, i) => {
      const hx = startX + i * (letterW + gap);
      const hy = startY;

      state.push({ el, x: hx, y: hy, vx: 0, vy: 0, active: false, w: letterW, h: letterH });
      el.style.transform = `translate(${hx}px, ${hy}px)`;
    });

    // Staggered opacity reveal
    letterEls.forEach((el, i) => {
      setTimeout(() => {
        el.style.transition = 'opacity 0.35s ease';
        el.style.opacity    = '1';
        setTimeout(() => { el.style.transition = ''; }, 400);
      }, i * 65 + 120);
    });
  }

  function tick() {
    const heroW = heroEl.offsetWidth;
    const heroH = heroEl.offsetHeight;
    const floor = heroH - FLOOR_PAD;

    for (const s of state) {
      if (!s.active) {
        // Static — only check cursor proximity
        const cx   = s.x + s.w * 0.5;
        const cy   = s.y + s.h * 0.5;
        const dx   = cx - heroMouseX;
        const dy   = cy - heroMouseY;
        const dist = Math.hypot(dx, dy);

        if (dist < REPEL_R) {
          s.active = true;
          const mag   = Math.max(1, dist);
          const boost = (1 - dist / REPEL_R) * REPEL_STR;
          s.vx = (dx / mag) * boost + (Math.random() - 0.5) * 3;
          s.vy = (dy / mag) * boost - 1 - Math.random() * 2;
        }
        // Position unchanged — no transform update needed
      } else {
        // Physics mode
        const cx   = s.x + s.w * 0.5;
        const cy   = s.y + s.h * 0.5;
        const dx   = cx - heroMouseX;
        const dy   = cy - heroMouseY;
        const dist = Math.hypot(dx, dy);

        // Continued cursor push (reduced in-flight)
        if (dist < REPEL_R && dist > 1) {
          const force = (1 - dist / REPEL_R) * REPEL_STR * 0.5;
          s.vx += (dx / dist) * force;
          s.vy += (dy / dist) * force;
        }

        s.vy += GRAVITY;
        s.vx *= DAMPING;
        s.vy *= DAMPING;
        s.x  += s.vx;
        s.y  += s.vy;

        // Floor bounce
        if (s.y + s.h > floor) {
          s.y   = floor - s.h;
          s.vy *= -BOUNCE;
          s.vx *= 0.78;
          if (Math.abs(s.vy) < 0.8) s.vy = 0;
        }

        // Left wall
        if (s.x < 0) { s.x = 0; s.vx *= -0.45; }

        // Right wall
        if (s.x + s.w > heroW) { s.x = heroW - s.w; s.vx *= -0.45; }

        // Ceiling
        if (s.y < 60) { s.y = 60; s.vy = Math.abs(s.vy) * 0.3; }

        s.el.style.transform = `translate(${s.x}px, ${s.y}px)`;
      }
    }

    requestAnimationFrame(tick);
  }

  // Mobile: first tap scatters all letters simultaneously
  heroEl.addEventListener('touchstart', function scatter() {
    heroEl.removeEventListener('touchstart', scatter);
    state.forEach(s => {
      if (!s.active) {
        s.active = true;
        s.vx = (Math.random() - 0.5) * 20;
        s.vy = -(Math.random() * 8 + 4);
      }
    });
  }, { passive: true });

  // Resize: re-init if no letters are active; clamp active ones to new bounds
  let _resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(_resizeTimer);
    _resizeTimer = setTimeout(() => {
      if (state.every(s => !s.active)) {
        initPhysics();
      } else {
        const heroW = heroEl.offsetWidth;
        const heroH = heroEl.offsetHeight;
        const floor = heroH - FLOOR_PAD;
        state.forEach(s => {
          if (s.x < 0) s.x = 0;
          if (s.x + s.w > heroW) s.x = heroW - s.w;
          if (s.y + s.h > floor) s.y = floor - s.h;
          s.el.style.transform = `translate(${s.x}px, ${s.y}px)`;
        });
      }
    }, 200);
  });

  // Start
  if (document.readyState === 'complete') {
    initPhysics();
    requestAnimationFrame(tick);
  } else {
    window.addEventListener('load', () => {
      initPhysics();
      requestAnimationFrame(tick);
    });
  }
})();
```

- [ ] **Step 2: Verify no syntax errors**

Open browser DevTools console after loading `index.html`. Expected: zero errors. The 8 "P" letters should appear staggered (one after another, 65ms apart) above the photo area.

- [ ] **Step 3: Verify cursor repulsion (desktop)**

Move the mouse slowly into the hero section toward one of the "P" letters. Expected:
- Letter starts moving away when cursor enters ~140px radius
- Letter keeps moving after cursor passes (momentum)
- Gravity pulls it down
- It bounces off the floor (above the CTA buttons)
- Eventually settles and stays

- [ ] **Step 4: Verify all 8 letters activate independently**

Slowly drag the cursor across all 8 letters. Expected: each letter activates individually on cursor approach, not all at once.

- [ ] **Step 5: Verify letters stay within hero bounds**

Push a letter toward the left wall, right wall, and ceiling. Expected: bounces back in all three cases. Never exits the hero section.

- [ ] **Step 6: Verify mobile tap (if touch device or DevTools mobile emulation)**

Switch DevTools to mobile emulation. Tap anywhere in the hero. Expected: all 8 letters scatter simultaneously with random velocities, then fall and settle.

- [ ] **Step 7: Verify page scroll still works**

Scroll down past the hero. Expected: letters are frozen in their last position (they do not continue to move after the hero leaves the viewport). The rest of the page (band, cards, accordion) works normally.

---

## Task 5: Update CHANGES.md and commit

**Files:**
- Modify: `CHANGES.md`

- [ ] **Step 1: Add v0.4 entry to top of CHANGES.md**

```markdown
## 2026-06-09 — v0.4 — Hero physics letters

### Zmieniono
- **HERO — typografia** — 8 liter „P" zastępuje stary nagłówek
  - Stoją statycznie nad głową Przemo (pozycja mierzona dynamicznie z bounding box zdjęcia)
  - Kursor w promieniu 140px odpycha literę impulsem (jak magnes) → włącza fizykę
  - Fizyka: grawitacja 0.25, tłumienie 0.97, odbicie 0.38; ograniczone do sekcji hero
  - Mobile: pierwszy dotyk w obszarze hero rozrzuca wszystkie litery naraz
  - Litery zostają gdzie spadły (brak respawnu)
- **Usunięto** martwy kod heroWords/speeds/hero-entrance-animation z main.js
- **Usunięto** klasy CSS .hero-type / .hero-word / .hw-1–.hw-4
```

- [ ] **Step 2: Commit**

```bash
git add index.html css/style.css js/main.js CHANGES.md docs/superpowers/specs/2026-06-09-hero-physics-letters-design.md docs/superpowers/plans/2026-06-09-hero-physics-letters.md
git commit -m "feat: hero physics letters — 8 P letters repelled by cursor, fall with gravity"
```

---

## Self-Review Notes

- **Spec § HTML** → Task 1 ✓ (8 spans, aria-label)
- **Spec § CSS** → Task 2 ✓ (all hw-* removed, hero-p added with all 4 variants)
- **Spec § JS / Initialization** → Task 4 Step 1, `initPhysics()` ✓
- **Spec § Per-letter state** → Task 4 Step 1, state object has all required fields ✓
- **Spec § Physics constants** → Task 4 Step 1 constants match spec values ✓
- **Spec § RAF tick / static branch** → Task 4 Step 1 ✓
- **Spec § RAF tick / physics branch** → Task 4 Step 1 ✓
- **Spec § Mouse tracking** → Task 4 Step 1, initialized to `-9999` ✓
- **Spec § Mobile touch** → Task 4 Step 1, `touchstart` with `{ once }` via removeEventListener ✓
- **Spec § Resize** → Task 4 Step 1, 200ms debounce, clamp vs re-init ✓
- **Out of scope confirmed**: no respawn, no letter–letter collision, no rotation ✓
