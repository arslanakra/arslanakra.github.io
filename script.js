document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Theme toggle ---------- */
  const html = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme) html.setAttribute('data-theme', savedTheme);

  const applyThemeState = () => {
    const isLight = html.getAttribute('data-theme') === 'light';
    themeToggle.setAttribute('aria-pressed', String(isLight));
  };
  applyThemeState();

  themeToggle.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
    applyThemeState();
  });

  /* ---------- Mobile drawer ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const drawer = document.getElementById('drawer');

  const closeDrawer = () => {
    drawer.classList.remove('is-open');
    menuToggle.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('is-open');
    menuToggle.classList.toggle('is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.querySelectorAll('.drawer-link').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  /* ---------- Pipeline scrollspy ---------- */
  const sections = ['home','about','skills','experience','projects','artifacts','contact']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const stageLinks = Array.from(document.querySelectorAll('.stage'));
  const order = sections.map(s => s.id);

  const setActive = (id) => {
    const idx = order.indexOf(id);
    stageLinks.forEach(link => {
      const linkIdx = order.indexOf(link.dataset.target);
      link.classList.remove('is-active', 'is-done');
      if (linkIdx === idx) link.classList.add('is-active');
      else if (linkIdx < idx) link.classList.add('is-done');
    });
  };

  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    sections.forEach(s => observer.observe(s));
  }

  /* ---------- Terminal typing animation ---------- */
  const terminalBody = document.getElementById('terminalBody');
  if (terminalBody) {
    const lines = Array.from(terminalBody.querySelectorAll('.t-line'));

    if (reduceMotion) {
      lines.forEach(line => { line.textContent = line.dataset.text; });
    } else {
      lines.forEach(line => { line.textContent = ''; });

      let lineIndex = 0;
      const typeLine = () => {
        if (lineIndex >= lines.length) return;
        const line = lines[lineIndex];
        const full = line.dataset.text;
        let charIndex = 0;

        const typeChar = () => {
          if (charIndex <= full.length) {
            line.textContent = full.slice(0, charIndex);
            charIndex++;
            setTimeout(typeChar, 14);
          } else {
            lineIndex++;
            setTimeout(typeLine, 180);
          }
        };
        typeChar();
      };

      const startObserver = new IntersectionObserver((entries, obs) => {
        if (entries[0].isIntersecting) {
          typeLine();
          obs.disconnect();
        }
      }, { threshold: 0.3 });
      startObserver.observe(terminalBody);
    }
  }

  /* ---------- Contact form -> mailto ---------- */
  const form = document.getElementById('ticketForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('tName').value.trim();
      const email = document.getElementById('tEmail').value.trim();
      const message = document.getElementById('tMsg').value.trim();

      const subject = encodeURIComponent(`Portfolio contact from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      window.location.href = `mailto:arsalantaqi255@gmail.com?subject=${subject}&body=${body}`;
    });
  }
});
