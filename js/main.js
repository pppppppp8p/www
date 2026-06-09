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
const heroWords  = document.querySelectorAll('.hero-word');
const heroPhoto  = document.querySelector('.hero-photo');
const speeds     = [0.03, 0.08, 0.015, 0.10];
const bandInners = document.querySelectorAll('.band-inner');
const nav        = document.querySelector('nav');

window.addEventListener('scroll', () => {
  const y = window.scrollY;

  // Hero parallax
  heroWords.forEach((el, i) => {
    el.style.transform = `translateY(${-y * (speeds[i] || 0.05)}px)`;
  });
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

// ─── Accordion ───────────────────────────────────────────────
document.querySelectorAll('.accordion-trigger').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.closest('.accordion-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.accordion-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});
