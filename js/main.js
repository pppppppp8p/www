/* ============================================================
   PPPPPPPP — main.js
   ============================================================ */

// ─── Custom cursor ───────────────────────────────────────────
const cursor = document.getElementById('cursor');
let cursorX = 0, cursorY = 0, cx = 0, cy = 0;

document.addEventListener('mousemove', e => {
  cursorX = e.clientX;
  cursorY = e.clientY;
});

const animateCursor = () => {
  cx += (cursorX - cx) * 0.18;
  cy += (cursorY - cy) * 0.18;
  if (cursor) cursor.style.transform = `translate(calc(${cx}px - 50%), calc(${cy}px - 50%))`;
  requestAnimationFrame(animateCursor);
};
animateCursor();

// ─── Pixel spray canvas — background texture ─────────────────
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
      const x    = Math.random() * sprayCanvas.width;
      const y    = Math.random() * sprayCanvas.height;
      const size = Math.random() < 0.75 ? 2 : 4;
      const col  = colors[Math.random() < 0.6 ? 0 : 1];
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

// ─── Hero parallax on scroll ──────────────────────────────────
const heroWords = document.querySelectorAll('.hero-word');
const heroPhoto = document.querySelector('.hero-photo');
const speeds    = [0.04, 0.10, 0.02, 0.13]; // each line moves at different rate

const onScroll = () => {
  const y = window.scrollY;

  heroWords.forEach((el, i) => {
    const speed = speeds[i] || 0.05;
    el.style.transform = `translateY(${-y * speed}px)`;
  });

  if (heroPhoto) {
    heroPhoto.style.transform = `translateY(${-y * 0.06}px)`;
  }
};

window.addEventListener('scroll', onScroll, { passive: true });

// ─── Nav glass on scroll ──────────────────────────────────────
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ─── Scroll reveal (IntersectionObserver) ────────────────────
const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-stagger');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

reveals.forEach(el => revealObs.observe(el));

// ─── Hero headline word entrance ─────────────────────────────
const heroWordEls = document.querySelectorAll('.hero-word');
heroWordEls.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform += ' translateY(30px)';
  el.style.transition = `opacity .7s ease ${i * .1 + .1}s, transform .7s ease ${i * .1 + .1}s`;

  setTimeout(() => {
    el.style.opacity = '1';
    el.style.transform = el.style.transform.replace(' translateY(30px)', '');
  }, 50);
});

// ─── Accordion ───────────────────────────────────────────────
document.querySelectorAll('.accordion-trigger').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.closest('.accordion-item');
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.accordion-item.open').forEach(i => i.classList.remove('open'));

    // Open clicked (if wasn't open)
    if (!isOpen) item.classList.add('open');
  });
});

// ─── Duplicate marquee bands for seamless loop ───────────────
document.querySelectorAll('.band-inner').forEach(inner => {
  inner.innerHTML += inner.innerHTML;
});

// ─── Scroll-reverse the orange band between hero and section 2 ─
const bandEl = document.querySelector('.band .band-inner');
if (bandEl) {
  const hero = document.getElementById('hero');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const heroH = hero ? hero.offsetHeight : 0;
    if (y < heroH + 200) {
      // Counter-scroll the band slightly
      const base = parseFloat(bandEl.style.marginLeft || '0');
      bandEl.style.animationDuration = `${Math.max(6, 14 - y * 0.01)}s`;
    }
  }, { passive: true });
}
