/* ========================================
   script.js — MILKY.DEV v4
======================================== */

// ── Nav scroll ───────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  const s = window.scrollY > 30;
  nav.style.borderBottomColor = s
    ? 'rgba(255,110,180,0.22)'
    : 'rgba(255,110,180,0.12)';
  nav.style.background = s
    ? 'rgba(5,5,8,0.97)'
    : 'rgba(5,5,8,0.85)';
});

// ── Hamburger ────────────────────────────
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(a =>
  a.addEventListener('click', () => navLinks.classList.remove('open'))
);

// ── Live clock in HUD ─────────────────────
const hudTime = document.getElementById('hud-time');
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2,'0');
  const m = String(now.getMinutes()).padStart(2,'0');
  const s = String(now.getSeconds()).padStart(2,'0');
  if (hudTime) hudTime.textContent = `${h}:${m}:${s}`;
}
updateClock();
setInterval(updateClock, 1000);

// ── Status cycle ─────────────────────────
const statuses = ['BUILDING', 'SCRIPTING', 'DESIGNING', 'SHIPPING'];
let statusIdx = 0;
const hudStatus = document.getElementById('hud-status');
if (hudStatus) {
  setInterval(() => {
    statusIdx = (statusIdx + 1) % statuses.length;
    hudStatus.style.opacity = '0';
    setTimeout(() => {
      hudStatus.textContent = statuses[statusIdx];
      hudStatus.style.opacity = '1';
    }, 300);
  }, 3000);
  hudStatus.style.transition = 'opacity 0.3s';
}

// ── Scroll reveal ────────────────────────
const revealEls = document.querySelectorAll('.reveal');
const ro = new IntersectionObserver(
  entries => entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 60);
      ro.unobserve(e.target);
    }
  }),
  { threshold: 0.1 }
);
revealEls.forEach(el => ro.observe(el));

// ── Skill bar animate ─────────────────────
const fills = document.querySelectorAll('.sk-fill');
const bo = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('animated');
      bo.unobserve(e.target);
    }
  }),
  { threshold: 0.5 }
);
fills.forEach(f => bo.observe(f));

// ── Active nav ───────────────────────────
const sections = document.querySelectorAll('section[id]');
const navAs    = document.querySelectorAll('.nav-links a');
const so = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) {
      navAs.forEach(a => a.style.color = '');
      const a = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (a) a.style.color = '#ff6eb4';
    }
  }),
  { rootMargin: '-25% 0px -65% 0px' }
);
sections.forEach(s => so.observe(s));

// ── Glitch effect on hero title ───────────
const titleEl = document.querySelector('.title-line');
function glitch() {
  if (!titleEl) return;
  titleEl.style.textShadow = `
    ${Math.random()*6-3}px 0 #ff6eb4,
    ${Math.random()*6-3}px 0 #00f5ff
  `;
  setTimeout(() => {
    titleEl.style.textShadow = '';
    setTimeout(glitch, Math.random() * 6000 + 3000);
  }, 80);
}
setTimeout(glitch, 2000);

// ── Skill card neon glow on hover ─────────
document.querySelectorAll('.skill-card').forEach(card => {
  const fill = card.querySelector('.sk-fill');
  const nc = fill ? getComputedStyle(fill).getPropertyValue('--nc').trim() : '#ff6eb4';
  card.addEventListener('mouseenter', () => {
    card.style.boxShadow = `0 0 28px ${nc}33, 0 16px 40px rgba(0,0,0,0.4)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.boxShadow = '';
  });
});
