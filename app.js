// Scroll header
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
});

// Mobile menu
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('mainNav');
menuToggle.addEventListener('click', () => nav.classList.toggle('open'));
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

// Smooth scroll para data-scroll
document.querySelectorAll('[data-scroll]').forEach(el => {
  el.addEventListener('click', () => {
    const target = document.querySelector(el.dataset.scroll);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// Smooth scroll anchors
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// Fade-up animations
const fadeEls = document.querySelectorAll('.fade-up');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
  });
}, { threshold: 0.1 });
fadeEls.forEach(el => observer.observe(el));

// ---- DIAGNÓSTICO ----
(function() {
  const allSteps = Array.from(document.querySelectorAll('.step'));
  const progressFill = document.getElementById('progressFill');
  const progressLabel = document.getElementById('progressLabel');
  const diagSteps = document.getElementById('diagSteps');
  const diagResult = document.getElementById('diagResult');
  const TOTAL = allSteps.length;
  let current = 0;

  function getActiveStep() { return allSteps[current]; }

  function render() {
    // Show/hide steps
    allSteps.forEach((s, i) => s.classList.toggle('active', i === current));
    // Progress
    const pct = (current / TOTAL) * 100;
    if (progressFill) progressFill.style.width = pct + '%';
    if (progressLabel) progressLabel.textContent = `Pregunta ${current + 1} de ${TOTAL}`;
    // Buttons for active step
    const step = getActiveStep();
    const prevBtn = step.querySelector('.btn-prev');
    const nextBtn = step.querySelector('.btn-next');
    if (prevBtn) prevBtn.style.visibility = current === 0 ? 'hidden' : 'visible';
    if (nextBtn) nextBtn.disabled = !step.querySelector('.option.selected');
  }

  // Option clicks
  allSteps.forEach((step, si) => {
    step.querySelectorAll('.option').forEach(opt => {
      opt.addEventListener('click', () => {
        step.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        const nextBtn = step.querySelector('.btn-next');
        if (nextBtn) nextBtn.disabled = false;
      });
    });

    // Prev button
    const prevBtn = step.querySelector('.btn-prev');
    if (prevBtn) prevBtn.addEventListener('click', () => {
      if (current > 0) { current--; render(); }
    });

    // Next button
    const nextBtn = step.querySelector('.btn-next');
    if (nextBtn) nextBtn.addEventListener('click', () => {
      if (!step.querySelector('.option.selected')) return;
      if (current < TOTAL - 1) {
        current++;
        render();
      } else {
        // Mostrar resultado
        if (diagSteps) diagSteps.style.display = 'none';
        if (progressFill) progressFill.style.width = '100%';
        if (progressLabel) progressLabel.textContent = '¡Diagnóstico completado!';
        if (diagResult) { diagResult.classList.add('show'); diagResult.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      }
    });
  });

  render();
})();

// Resultado form
document.getElementById('resultForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  btn.textContent = '✅ ¡Enviado! Revisa tu email';
  btn.style.background = '#00a07a';
  btn.disabled = true;
});

// Lead magnet form
document.getElementById('lmForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  btn.textContent = '✅ ¡Enviado! Revisa tu email';
  btn.style.background = '#00a07a';
  btn.disabled = true;
});
