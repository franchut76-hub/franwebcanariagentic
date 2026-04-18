// CUSTOM CURSOR
const cursor = document.createElement('div');
cursor.classList.add('custom-cursor');
document.body.appendChild(cursor);

const follower = document.createElement('div');
follower.classList.add('custom-cursor-follower');
document.body.appendChild(follower);

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  
  setTimeout(() => {
    follower.style.left = e.clientX + 'px';
    follower.style.top = e.clientY + 'px';
  }, parseInt(50, 10)); // Pequeña latencia
});

const hoverElements = document.querySelectorAll('a, button, .btn, .option, .cred-card, .sector-card, .t-card');
hoverElements.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('hover');
    follower.classList.add('hover');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('hover');
    follower.classList.remove('hover');
  });
});


// CANVAS NEURAL BACKGROUND
const canvas = document.getElementById('neural-canvas');
if(canvas) {
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  
  function initCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }
  
  window.addEventListener('resize', initCanvas);
  initCanvas();
  
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 1.5 + 0.5;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 200, 150, 0.5)';
      ctx.fill();
    }
  }
  
  // Menos particulas en movil para rendimiento
  const numParticles = window.innerWidth < 768 ? 40 : 80;
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle());
  }
  
  function animateCanvas() {
    ctx.clearRect(0, 0, width, height);
    
    // Draw particles
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    
    // Connect particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 200, 150, ${0.15 * (1 - distance / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animateCanvas);
  }
  animateCanvas();
}


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
// Resultado form + Integración a Zapier Webhook
document.getElementById('resultForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  btn.textContent = 'Enviando...';
  btn.disabled = true;

  // 1. Recoger respuestas del diagnóstico
  const selectedOptions = Array.from(document.querySelectorAll('.step .option.selected'))
                              .map(btn => btn.innerText.trim());

  // 2. Recoger datos de contacto
  const nombre = document.getElementById('r-nombre')?.value || '';
  const email = document.getElementById('r-email')?.value || '';

  // 3. Crear OBJETO JSON con las 8 variables exactas para Relevance AI
  const payload = {
    nombre: nombre,
    email: email,
    sector_negocio: selectedOptions[0] || '',
    cantidad_empleados: selectedOptions[1] || '',
    mayor_problema: selectedOptions[2] || '',
    herramientas_actuales: selectedOptions[3] || '',
    horas_perdidas: selectedOptions[4] || '',
    urgencia_implementacion: selectedOptions[5] || ''
  };

  const RELEVANCE_WEBHOOK_URL = 'https://api-d7b62b.stack.tryrelevance.com/latest/agents/hooks/custom-trigger/65a28496-8f7b-4199-a75f-76da08124d60/da8fde9b-4577-49d4-b31c-da670398dbc2';

  try {
    // 4. Enviar a nuestro Agente en Relevance AI
    await fetch(RELEVANCE_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    btn.textContent = '✅ ¡Enviado! Revisa tu email';
    btn.style.background = '#00a07a';
  } catch (error) {
    console.error('Error al invocar el agente de IA:', error);
    btn.textContent = '❌ Error. Inténtalo de nuevo';
    btn.disabled = false;
  }
});

// ---- TESTIMONIAL STACK LOGIC ----
(function() {
  const stack = document.getElementById('testimonialStack');
  if (!stack) return;
  const cards = stack.querySelectorAll('.t-card');

  cards.forEach((card) => {
    // Mobile / Touch Tap: Toggle active class
    card.addEventListener('click', (e) => {
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      if (isTouch) {
        if (!card.classList.contains('active')) {
          e.preventDefault();
          cards.forEach(c => c.classList.remove('active'));
          card.classList.add('active');
        }
      }
    });

    // Reset active class on mouse leave (desktop)
    card.addEventListener('mouseleave', () => {
      card.classList.remove('active');
    });
  });
})();

// --- PREMIUM MONETIZATION JS ---

// 1. COUNT UP ANIMATION
const countUpObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-target'), 10);
      let count = 0;
      const speed = target / 150; // Animación más lenta y suave
      
      const updateCount = () => {
        count += speed;
        if (count < target) {
          el.innerText = '+' + Math.ceil(count);
          requestAnimationFrame(updateCount);
        } else {
          el.innerText = '+' + target;
        }
      };
      updateCount();
      observer.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.count-up').forEach(el => countUpObserver.observe(el));


// 2. 3D TILT EFFECT FOR CARDS
const tiltCards = document.querySelectorAll('.cred-card, .sector-card');
tiltCards.forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculates rotation based on cursor position (max 10 deg)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    
    card.style.transform = `perspective(1000px) scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    card.style.transition = 'none';
    card.style.zIndex = '10';
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = `perspective(1000px) scale(1) rotateX(0deg) rotateY(0deg)`;
    card.style.transition = 'transform 0.5s ease';
    card.style.zIndex = '1';
  });
});


// 3. STICKY CTA ON SCROLL
const stickyCta = document.querySelector('.sticky-bottom-cta');
if (stickyCta) {
  window.addEventListener('scroll', () => {
    // Show sticky CTA only when scrolled past 600px 
    // AND hide it if we are at the very bottom near the footer/real CTA
    const scrollY = window.scrollY;
    const docHeight = document.body.scrollHeight;
    const winHeight = window.innerHeight;
    const isNearBottom = (scrollY + winHeight) >= (docHeight - 300);
    
    if (scrollY > 600 && !isNearBottom) {
      stickyCta.classList.add('visible');
    } else {
      stickyCta.classList.remove('visible');
    }
  });
}


// 4. SOCIAL PROOF (FOMO) POPUP
const popup = document.getElementById('social-proof-popup');
const closePopup = document.getElementById('sp-close');

if (popup && closePopup) {
  // Lista de localidades objetivo en Canarias
  const locations = [
    "Tenerife", "Gran Canaria", "Lanzarote", "Fuerteventura", 
    "una Inmobiliaria en La Laguna", "una Clínica en Las Palmas", 
    "un eCommerce en Arona", "un Despacho de Abogados en Santa Cruz"
  ];
  
  const actions = [
    "acaba de solicitar su diagnóstico gratuito",
    "está chateando por WhatsApp ahora mismo",
    "acaba de agendar una llamada",
    "está viendo los servicios de la agencia"
  ];
  
  const times = ["Hace 2 minutos", "Hace 5 minutos", "Hace 12 minutos", "Ahora mismo"];

  closePopup.addEventListener('click', () => {
    popup.classList.remove('visible');
    // Si lo cierra, no molestamos más tan rápido
  });

  // Función para mostrar popup aleatorio
  function showRandomNotification() {
    // Rellenamos datos aleatorios
    document.getElementById('sp-name').textContent = "Alguien de " + locations[Math.floor(Math.random() * locations.length)];
    document.getElementById('sp-action').textContent = actions[Math.floor(Math.random() * actions.length)];
    document.getElementById('sp-time').textContent = times[Math.floor(Math.random() * times.length)];
    
    // Mostramos
    popup.classList.remove('hidden');
    // Pequeño delay para la animación
    setTimeout(() => {
      popup.classList.add('visible');
    }, 100);
    
    // Ocultamos a los 6 segundos
    setTimeout(() => {
      popup.classList.remove('visible');
    }, 6000);
  }

  // Comienza ciclo de notificaciones
  setTimeout(() => {
    showRandomNotification();
    // Y luego repetir cada X tiempo aleatorio (ej. 30-45 seg)
    setInterval(() => {
      if(!popup.classList.contains('visible')) { // Solo si no está abierto ya
        showRandomNotification();
      }
    }, 35000); 
  }, 12000); // Primera a los 12 seg de estar en la web
}


