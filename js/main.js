/* ============================================================
   PPPPPPPP — main.js  v0.3
   ============================================================ */

// ─── Custom cursor — instant follow, no lag ──────────────────
const cursor = document.getElementById('cursor');

document.addEventListener('mousemove', e => {
  if (cursor) cursor.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
});

// Cursor hover state on interactive elements (no system cursor)
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => cursor?.classList.add('cursor--hover'));
  el.addEventListener('mouseleave', () => cursor?.classList.remove('cursor--hover'));
});

// ─── Pixel spray canvas ──────────────────────────────────────
const sprayCanvas = document.getElementById('spray-canvas');
if (sprayCanvas) {
  const ctx = sprayCanvas.getContext('2d');

  const resize = () => {
    sprayCanvas.width  = sprayCanvas.offsetWidth;
    sprayCanvas.height = sprayCanvas.offsetHeight;
    drawSpray();
  };

  const drawSpray = () => {
    ctx.clearRect(0, 0, sprayCanvas.width, sprayCanvas.height);
    const colors = ['#FE5200', '#7C60EC'];
    const count  = Math.floor(sprayCanvas.width * sprayCanvas.height / 3200);

    for (let i = 0; i < count; i++) {
      const x     = Math.random() * sprayCanvas.width;
      const y     = Math.random() * sprayCanvas.height;
      const size  = Math.random() < 0.75 ? 2 : 4;
      const col   = colors[Math.random() < 0.6 ? 0 : 1];
      const alpha = Math.random() * 0.18 + 0.03;

      ctx.globalAlpha = alpha;
      ctx.fillStyle   = col;
      ctx.fillRect(Math.round(x / 2) * 2, Math.round(y / 2) * 2, size, size);
    }
    ctx.globalAlpha = 1;
  };

  resize();
  window.addEventListener('resize', resize);
}

// ─── Duplicate band content for seamless loop ─────────────────
document.querySelectorAll('.band-inner').forEach(inner => {
  inner.innerHTML += inner.innerHTML;
});

// ─── Scroll handler (parallax + scroll-driven band) ──────────
const heroPhoto  = document.querySelector('.hero-photo');
const bandInners = document.querySelectorAll('.band-inner');
const nav        = document.querySelector('nav');

window.addEventListener('scroll', () => {
  const y = window.scrollY;

  // Hero parallax
  if (heroPhoto) heroPhoto.style.transform = `translateY(${-y * 0.05}px)`;

  // Scroll-driven band — moves only when user scrolls
  bandInners.forEach((inner, idx) => {
    const totalW = inner.scrollWidth / 2;
    const dir    = idx % 2 === 0 ? 1 : -1;
    const offset = ((y * 0.5 * dir) % totalW + totalW) % totalW;
    inner.style.transform = `translateX(-${offset}px)`;
  });

  // Nav glass
  nav?.classList.toggle('scrolled', y > 60);

}, { passive: true });

// ─── Scroll reveal ────────────────────────────────────────────
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-stagger')
  .forEach(el => revealObs.observe(el));

// ─── Accordion ───────────────────────────────────────────────
document.querySelectorAll('.accordion-trigger').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.closest('.accordion-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.accordion-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ─── Hero physics letters ─────────────────────────────────────
(function () {
  const GRAVITY    = 0.25;
  const DAMPING    = 0.97;
  const BOUNCE     = 0.38;
  const REPEL_R    = 140;
  const REPEL_STR  = 14;
  const FLOOR_PAD  = 120;

  function slotColor(i) {
    const t = i / 7;
    const r = Math.round(0x7C + (0xFE - 0x7C) * t);
    const g = Math.round(0x60 + (0x52 - 0x60) * t);
    const b = Math.round(0xEC + (0x00 - 0xEC) * t);
    return `rgb(${r},${g},${b})`;
  }

  const WORDS = [
    ['P','R','O','D','U','K','T',' '],
    ['P','R','O','C','E','S',' ',' '],
    ['P','R','O','J','E','K','T',' '],
  ];
  const WORD_PAUSE   = 1500;
  const SLOT_STAGGER = 25;
  const SLOT_ANIM    = 100;

  function animateSlot(slot, nextChar) {
    const cur = slot.querySelector('.slot-cur');
    const nxt = slot.querySelector('.slot-nxt');

    nxt.textContent = nextChar;

    // Set initial off-screen position without transition
    nxt.style.transition = 'none';
    nxt.style.transform  = 'translateY(100%)';

    // Double-rAF: forces browser to paint before adding the transition
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        cur.style.transition = `transform ${SLOT_ANIM}ms ease-in-out`;
        nxt.style.transition = `transform ${SLOT_ANIM}ms ease-in-out`;
        cur.style.transform  = 'translateY(-100%)';
        nxt.style.transform  = 'translateY(0)';

        setTimeout(() => {
          // Swap without animation — cur becomes the confirmed current char
          cur.style.transition = 'none';
          nxt.style.transition = 'none';
          cur.textContent      = nextChar;
          cur.style.transform  = '';
          nxt.style.transform  = 'translateY(100%)';
          nxt.textContent      = '';
        }, SLOT_ANIM + 10);
      });
    });
  }

  function initWordCycle() {
    const heroWordEl = document.querySelector('#hero .hero-word');
    if (!heroWordEl) return;

    const slotEls = Array.from(heroWordEl.querySelectorAll('.hero-slot'));

    // Position and size to match physics letter group
    heroWordEl.style.left = startX + 'px';
    heroWordEl.style.top  = startY + 'px';
    heroWordEl.style.gap  = gap + 'px';
    slotEls.forEach(slot => {
      slot.style.width  = letterW + 'px';
      slot.style.height = letterH + 'px';
    });

    let wordIdx = 0;

    function flipToNext() {
      wordIdx = (wordIdx + 1) % WORDS.length;
      const word = WORDS[wordIdx];
      slotEls.forEach((slot, i) => {
        setTimeout(() => animateSlot(slot, word[i]), i * SLOT_STAGGER);
      });
      // Schedule next flip: pause + time for all slots to finish
      setTimeout(flipToNext, WORD_PAUSE + slotEls.length * SLOT_STAGGER + SLOT_ANIM + 10);
    }

    // Start after 800ms — physics letters have all faded in (~560ms)
    setTimeout(flipToNext, 800);
  }

  const heroEl   = document.getElementById('hero');
  const photoEl  = document.querySelector('.hero-photo');
  const letterEls = Array.from(document.querySelectorAll('#hero .hero-p'));

  if (!heroEl || !photoEl || letterEls.length === 0) return;

  let heroMouseX = -9999;
  let heroMouseY = -9999;
  let letters    = [];
  let rafId      = null;
  let letterW = 0;
  let letterH = 0;
  let gap     = 0;
  let startX  = 0;
  let startY  = 0;

  // ── Position letters above photo head ──────────────────────
  function initPhysics() {
    const heroRect  = heroEl.getBoundingClientRect();
    const heroW     = heroEl.offsetWidth;
    const heroH     = heroEl.offsetHeight;
    const photoRect = photoEl.getBoundingClientRect();

    const photoCenterX = photoRect.left - heroRect.left + photoRect.width / 2;
    const photoTopY    = photoRect.top  - heroRect.top;

    const firstLetter  = letterEls[0];
    firstLetter.style.opacity = '0';
    firstLetter.style.transform = 'translate(0,0)';
    letterW = firstLetter.offsetWidth;
    letterH = firstLetter.offsetHeight;
    gap     = Math.round(letterW * 0.08);

    const groupW = letterEls.length * letterW + (letterEls.length - 1) * gap;
    startX = photoCenterX - groupW / 2;
    startX = Math.max(0, Math.min(startX, heroW - groupW));
    startY = Math.max(0, photoTopY - letterH * 1.5);

    letters = letterEls.map((el, i) => {
      const x = startX + i * (letterW + gap);
      const y = startY;
      el.style.transform = `translate(${x}px,${y}px)`;
      el.style.color = slotColor(i);
      return {
        el,
        x, y,
        vx: 0, vy: 0,
        homeX: x, homeY: y,
        active: false,
        w: letterW,
        h: letterH
      };
    });

    document.querySelectorAll('#hero .hero-slot').forEach((slot, i) => {
      slot.style.color = slotColor(i);
    });

    // Stagger fade-in
    letters.forEach((lt, i) => {
      setTimeout(() => { lt.el.style.opacity = '1'; }, i * 60 + 80);
    });
  }

  // ── RAF tick ───────────────────────────────────────────────
  function tick() {
    const heroW = heroEl.offsetWidth;
    const heroH = heroEl.offsetHeight;
    const floor = heroH - FLOOR_PAD;

    letters.forEach(lt => {
      if (!lt.active) {
        const cx   = lt.x + lt.w / 2;
        const cy   = lt.y + lt.h / 2;
        const dx   = cx - heroMouseX;
        const dy   = cy - heroMouseY;
        const dist = Math.hypot(dx, dy);
        if (dist < REPEL_R && dist > 0) {
          lt.active = true;
          const mag = (1 - dist / REPEL_R) * REPEL_STR;
          lt.vx = (dx / dist) * mag + (Math.random() - 0.5) * 1.5;
          lt.vy = (dy / dist) * mag * 0.6 - (Math.random() * 2 + 1);
        }
        return;
      }

      // Cursor repulsion while in flight
      const cx   = lt.x + lt.w / 2;
      const cy   = lt.y + lt.h / 2;
      const dx   = cx - heroMouseX;
      const dy   = cy - heroMouseY;
      const dist = Math.hypot(dx, dy);
      if (dist < REPEL_R && dist > 0) {
        const mag = (1 - dist / REPEL_R) * REPEL_STR * 0.5;
        lt.vx += (dx / dist) * mag;
        lt.vy += (dy / dist) * mag;
      }

      lt.vy += GRAVITY;
      lt.vx *= DAMPING;
      lt.vy *= DAMPING;
      lt.x  += lt.vx;
      lt.y  += lt.vy;

      // Floor
      if (lt.y + lt.h > floor) {
        lt.y  = floor - lt.h;
        lt.vy = -Math.abs(lt.vy) * BOUNCE;
        lt.vx *= 0.78;
        if (Math.abs(lt.vy) < 0.8) lt.vy = 0;
      }
      // Left wall
      if (lt.x < 0) {
        lt.x  = 0;
        lt.vx = Math.abs(lt.vx) * 0.45;
      }
      // Right wall
      if (lt.x + lt.w > heroW) {
        lt.x  = heroW - lt.w;
        lt.vx = -Math.abs(lt.vx) * 0.45;
      }
      // Ceiling
      if (lt.y < 60) {
        lt.y  = 60;
        lt.vy = Math.abs(lt.vy) * 0.3;
      }

      lt.el.style.transform = `translate(${lt.x}px,${lt.y}px)`;
    });

    rafId = requestAnimationFrame(tick);
  }

  // ── Mouse tracking (relative to heroEl) ───────────────────
  document.addEventListener('mousemove', e => {
    const rect = heroEl.getBoundingClientRect();
    heroMouseX = e.clientX - rect.left;
    heroMouseY = e.clientY - rect.top;
  });

  // ── Mobile: one tap scatters all ──────────────────────────
  heroEl.addEventListener('touchstart', () => {
    letters.forEach(lt => {
      if (!lt.active) {
        lt.active = true;
        lt.vx = (Math.random() - 0.5) * 20;
        lt.vy = -(Math.random() * 8 + 4);
      }
    });
  }, { once: true });

  // ── Resize ────────────────────────────────────────────────
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const heroW = heroEl.offsetWidth;
      const heroH = heroEl.offsetHeight;
      const floor = heroH - FLOOR_PAD;
      const allInactive = letters.every(lt => !lt.active);
      if (allInactive) {
        initPhysics();
        // Reposition word display to match new layout
        const heroWordEl = document.querySelector('#hero .hero-word');
        if (heroWordEl) {
          heroWordEl.style.left = startX + 'px';
          heroWordEl.style.top  = startY + 'px';
          heroWordEl.style.gap  = gap + 'px';
          heroWordEl.querySelectorAll('.hero-slot').forEach(slot => {
            slot.style.width  = letterW + 'px';
            slot.style.height = letterH + 'px';
          });
        }
      } else {
        letters.forEach(lt => {
          if (lt.x + lt.w > heroW) lt.x = heroW - lt.w;
          if (lt.x < 0) lt.x = 0;
          if (lt.y + lt.h > floor) lt.y = floor - lt.h;
          lt.el.style.transform = `translate(${lt.x}px,${lt.y}px)`;
        });
      }
    }, 200);
  });

  // ── Boot ──────────────────────────────────────────────────
  window.addEventListener('load', () => {
    if (rafId) cancelAnimationFrame(rafId);
    initPhysics();
    initWordCycle();
    rafId = requestAnimationFrame(tick);
  });
})();
