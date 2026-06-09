/* ============================================================
   PPPPPPPP — main.js
   ============================================================ */

// Custom cursor
const cursor = document.querySelector('.cursor');

document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
});

document.addEventListener('mouseleave', () => {
  cursor.style.opacity = '0';
});

document.addEventListener('mouseenter', () => {
  cursor.style.opacity = '1';
});

// ============================================================
// Fog of War — canvas overlay on hero
// ============================================================
const fogCanvas = document.getElementById('fog-canvas');
const fogCtx    = fogCanvas ? fogCanvas.getContext('2d') : null;

let fogMouse = { x: -999, y: -999 };
let fogRadius  = 0;
let fogTargetR = 0;
const FOG_RADIUS_MAX  = 200;

if (fogCanvas) {
  const resizeFog = () => {
    fogCanvas.width  = fogCanvas.offsetWidth;
    fogCanvas.height = fogCanvas.offsetHeight;
  };
  resizeFog();
  window.addEventListener('resize', resizeFog);

  const hero = document.getElementById('hero');

  hero.addEventListener('mousemove', e => {
    const rect = fogCanvas.getBoundingClientRect();
    fogMouse.x = e.clientX - rect.left;
    fogMouse.y = e.clientY - rect.top;
    fogTargetR = FOG_RADIUS_MAX;
  });

  hero.addEventListener('mouseleave', () => {
    fogTargetR = 0;
  });

  const drawFog = () => {
    if (!fogCtx) return;

    // Smooth radius
    fogRadius += (fogTargetR - fogRadius) * 0.08;

    fogCtx.clearRect(0, 0, fogCanvas.width, fogCanvas.height);

    // Dark overlay
    fogCtx.fillStyle = 'rgba(36, 27, 33, 0.72)';
    fogCtx.fillRect(0, 0, fogCanvas.width, fogCanvas.height);

    // Cut out circle at mouse — radial gradient to transparent
    const grad = fogCtx.createRadialGradient(
      fogMouse.x, fogMouse.y, 0,
      fogMouse.x, fogMouse.y, fogRadius
    );
    grad.addColorStop(0,   'rgba(36, 27, 33, 0)');
    grad.addColorStop(0.6, 'rgba(36, 27, 33, 0)');
    grad.addColorStop(1,   'rgba(36, 27, 33, 0.72)');

    fogCtx.globalCompositeOperation = 'destination-out';
    fogCtx.beginPath();
    fogCtx.arc(fogMouse.x, fogMouse.y, fogRadius, 0, Math.PI * 2);
    fogCtx.fillStyle = grad;
    fogCtx.fill();
    fogCtx.globalCompositeOperation = 'source-over';

    requestAnimationFrame(drawFog);
  };

  drawFog();
}

// ============================================================
// Scroll-driven ticker — horizontal movement on scroll
// ============================================================
const ticker = document.querySelector('.hero-ticker-inner');

if (ticker) {
  // Duplicate content for seamless loop
  ticker.innerHTML += ticker.innerHTML;

  let scrollY = 0;

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    // Slow the animation on scroll (parallax feel)
    ticker.style.animationPlayState = 'running';
  });
}

// ============================================================
// Scroll reveal — IntersectionObserver
// ============================================================
const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

// ============================================================
// Hero headline — word-by-word entrance
// ============================================================
const heroHeadline = document.querySelector('.hero-headline');

if (heroHeadline) {
  const words = heroHeadline.textContent.trim().split(/\s+/);
  heroHeadline.innerHTML = words.map((w, i) =>
    `<span class="hw" style="
      display:inline-block;
      opacity:0;
      transform:translateY(20px);
      animation: wordIn .6s ease forwards;
      animation-delay: ${i * 0.07 + 0.2}s
    ">${w}&nbsp;</span>`
  ).join('');
}

const styleEl = document.createElement('style');
styleEl.textContent = `
  @keyframes wordIn {
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(styleEl);

// ============================================================
// Nav transparency on scroll
// ============================================================
const nav = document.querySelector('nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    nav.style.background = 'rgba(36, 27, 33, 0.92)';
    nav.style.backdropFilter = 'blur(12px)';
    nav.style.borderBottom = '1px solid rgba(250, 247, 249, 0.07)';
  } else {
    nav.style.background = 'transparent';
    nav.style.backdropFilter = 'none';
    nav.style.borderBottom = 'none';
  }
}, { passive: true });
