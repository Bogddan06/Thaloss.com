// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle) {
  const setMenuLock = locked => {
    const root = document.documentElement;
    if (locked) {
      const scrollY = window.scrollY;
      document.body.dataset.menuScrollY = String(scrollY);
      root.classList.add('menu-open');
      document.body.classList.add('menu-open');
      document.body.style.top = `-${scrollY}px`;
    } else {
      const scrollY = Number(document.body.dataset.menuScrollY || 0);
      root.classList.remove('menu-open');
      document.body.classList.remove('menu-open');
      document.body.style.top = '';
      window.scrollTo(0, scrollY);
    }
  };
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    setMenuLock(navLinks.classList.contains('open'));
    navToggle.setAttribute('aria-expanded', String(navLinks.classList.contains('open')));
    navLinks.style.height = navLinks.classList.contains('open') ? `${window.innerHeight - 64}px` : '';
    navLinks.style.transform = navLinks.classList.contains('open') ? 'translate3d(0,0,0)' : '';
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => { navLinks.classList.remove('open'); navLinks.style.height = ''; navLinks.style.transform = ''; setMenuLock(false); navToggle.setAttribute('aria-expanded', 'false'); });
  });
  window.addEventListener('resize', () => { if (navLinks.classList.contains('open')) navLinks.style.height = `${window.innerHeight - 64}px`; }, { passive: true });
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
const magnetic = document.querySelectorAll('.btn, .nav-cta, .profile-link');
magnetic.forEach(el => {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
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

// A small physical response is reserved for contact options, not the team directory.
const tiltEls = document.querySelectorAll('.channel-card');
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

// Directional hand-off between local pages. Anchors and external destinations retain native behavior.
const transition = document.createElement('div');
transition.className = 'page-transition';
transition.setAttribute('aria-hidden', 'true');
document.body.prepend(transition);
requestAnimationFrame(() => document.body.classList.add('page-ready'));
document.querySelectorAll('a[href]').forEach(link => {
  link.addEventListener('click', event => {
    const href = link.getAttribute('href');
    const localPage = href && /^(index|team|contact)\.html/.test(href);
    if (!localPage || link.target === '_blank' || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (event.detail === 0) return;
    event.preventDefault();
    document.body.classList.add('page-leaving');
    window.setTimeout(() => { window.location.href = href; }, 460);
  });
});

// Team profile reports: the directory remains quick to scan, with detail one click away.
const profiles = {
  david: { name: 'Bragarenco David', role: 'CEO · Strategy & leadership', image: 'assets/team_david.jpg', link: 'https://www.linkedin.com/in/bragarenco-david-640a2a2b5/', statement: 'Turning a practical water challenge into a team, a product, and a direction.', bio: 'As CEO, David guides Thaloss from idea to execution—bringing the team’s work on bioremediation, hardware, and product into one clear mission.' },
  'bogdan-m': { name: 'Moraru Bogdan', role: 'CTO · Technology', image: 'assets/team_bogdan_m.jpg', link: 'https://www.linkedin.com/in/moraru-bogdan-4585b8354/?isSelfProfile=true', statement: 'Building the technical backbone behind an autonomous water-treatment system.', bio: 'As CTO, Bogdan leads the technology direction that connects the vessel, its sensing, and the systems behind Thaloss.' },
  'bogdan-e': { name: 'Edinac Bogdan-Alexandru', role: 'R&D · Research & development', image: 'assets/team_bogdan_e.jpg', link: 'https://www.linkedin.com/in/bogdan-alexandru-edinac-670435422/', statement: 'Testing ideas carefully so the work on the water is grounded in evidence.', bio: 'Bogdan-Alexandru contributes to research and development, helping the team explore, test, and refine the system behind Thaloss.' },
  anatolii: { name: 'Anatolii Suharschi', role: 'CPO · Product', image: 'assets/team_anatolii.png', link: 'https://www.linkedin.com/in/anatolii-suharschi/', statement: 'Making the product understandable, useful, and ready for the people who manage water.', bio: 'Anatolii shapes the product perspective at Thaloss, bringing an interest in robotics, AI, and mechanical engineering to the work.' }
};
const dialog = document.getElementById('profileDialog');
if (dialog) {
  const keys = Object.keys(profiles); let activeProfile = 0; let opener;
  const renderProfile = key => { const p = profiles[key]; activeProfile = keys.indexOf(key); document.getElementById('profileImage').src = p.image; document.getElementById('profileImage').alt = `Portrait of ${p.name}`; document.getElementById('profileName').textContent = p.name; document.getElementById('profileRole').textContent = p.role; document.getElementById('profileStatement').textContent = p.statement; document.getElementById('profileBio').textContent = p.bio; document.getElementById('profileLinkedin').href = p.link; };
  const closeProfile = () => { dialog.classList.remove('is-open', 'profile-instant'); dialog.setAttribute('aria-hidden', 'true'); document.body.classList.remove('profile-open'); opener?.focus(); };
  const openProfile = (key, instant = false) => { opener = document.querySelector(`[data-profile="${key}"]`); const r = opener.getBoundingClientRect(); dialog.style.setProperty('--profile-origin-x', `${r.left + r.width / 2}px`); dialog.style.setProperty('--profile-origin-y', `${r.top + r.height / 2}px`); renderProfile(key); dialog.classList.toggle('profile-instant', instant); dialog.classList.add('is-open'); dialog.setAttribute('aria-hidden', 'false'); document.body.classList.add('profile-open'); dialog.querySelector('.profile-close').focus(); };
  document.querySelectorAll('[data-profile]').forEach(member => { member.addEventListener('click', event => { if (!event.target.closest('a')) openProfile(member.dataset.profile); }); member.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openProfile(member.dataset.profile, true); } }); });
  dialog.querySelectorAll('[data-close-profile]').forEach(button => button.addEventListener('click', closeProfile));
  dialog.querySelector('.profile-prev').addEventListener('click', () => renderProfile(keys[(activeProfile - 1 + keys.length) % keys.length]));
  dialog.querySelector('.profile-next').addEventListener('click', () => renderProfile(keys[(activeProfile + 1) % keys.length]));
  document.addEventListener('keydown', event => { if (!dialog.classList.contains('is-open')) return; if (event.key === 'Escape') closeProfile(); if (event.key === 'ArrowLeft') renderProfile(keys[(activeProfile - 1 + keys.length) % keys.length]); if (event.key === 'ArrowRight') renderProfile(keys[(activeProfile + 1) % keys.length]); });
}

// Page fade-in is handled purely in CSS (see body { animation: page-fade-in } )
// so the page never gets stuck blank if JS fails to load.
