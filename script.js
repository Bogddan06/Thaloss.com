// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// Split headline text into animated words: <h1 data-split>
document.querySelectorAll('[data-split]').forEach(el => {
  const words = el.textContent.trim().split(/\s+/);
  el.innerHTML = words
    .map((w, i) => `<span class="word" style="animation-delay:${0.08 * i + 0.05}s">${w}</span>`)
    .join(' ');
});

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in'));
}

// Magnetic hover on buttons — subtle pull toward the cursor
const magnetic = document.querySelectorAll('.btn, .icon-link');
magnetic.forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    el.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
  });
});

// 3D tilt on hover — team cards + channel cards
const tiltEls = document.querySelectorAll('.member, .channel-card');
tiltEls.forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(700px) rotateX(${py * -7}deg) rotateY(${px * 7}deg) translateY(-4px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
  });
});

// Hero visual parallax — the big T + CAD render drift opposite the cursor
const heroVisual = document.getElementById('heroVisual');
const heroSection = document.querySelector('.hero');
if (heroVisual && heroSection) {
  heroSection.addEventListener('mousemove', (e) => {
    const r = heroSection.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    heroVisual.style.setProperty('--px', px.toFixed(3));
    heroVisual.style.setProperty('--py', py.toFixed(3));
    heroVisual.style.transform = `translate(${px * 18}px, ${py * 18}px)`;
  });
  heroSection.addEventListener('mouseleave', () => {
    heroVisual.style.transform = '';
  });
}

// Nav bar: strengthen shadow after scrolling
const header = document.querySelector('.site-header');
if (header) {
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 24);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// Page fade-in is handled purely in CSS (see body { animation: page-fade-in } )
// so the page never gets stuck blank if JS fails to load.
