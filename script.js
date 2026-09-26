document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Theme toggle (now cycles 4 themes instead of 2) ---------- */
  const html = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themes = ['dark', 'light', 'slate', 'ledger']; // 'dark' = default, no attribute needed
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme && themes.includes(savedTheme)) html.setAttribute('data-theme', savedTheme);

  const applyThemeState = () => {
    const current = html.getAttribute('data-theme') || 'dark';
    const isLightFamily = current === 'light' || current === 'ledger';
    themeToggle.setAttribute('aria-pressed', String(isLightFamily));
  };
  applyThemeState();

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme') || 'dark';
    const next = themes[(themes.indexOf(current) + 1) % themes.length];
    html.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
    applyThemeState();
  });

  /* ---------- Font pairing switcher ---------- */
  const fontBtn = document.querySelector('[data-font-cycle]');
  if (fontBtn) {
    const fontPresets = [null, 'signal', 'report']; // null = default terminal pairing
    const savedFont = localStorage.getItem('portfolio-font');
    if (savedFont && savedFont !== 'terminal') html.setAttribute('data-font', savedFont);

    fontBtn.addEventListener('click', () => {
      const current = html.getAttribute('data-font') || null;
      const next = fontPresets[(fontPresets.indexOf(current) + 1) % fontPresets.length];
      if (next) html.setAttribute('data-font', next);
      else html.removeAttribute('data-font');
      localStorage.setItem('portfolio-font', next || 'terminal');
    });
  }

  /* ---------- Card "show more" (project & log cards) ---------- */
  document.querySelectorAll('[data-clamp-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.previousElementSibling;
      const expanded = target.classList.toggle('is-clamped') === false;
      btn.textContent = expanded ? 'Show less' : 'Show more';
    });
  });

  /* ---------- Recommendation carousel ---------- */
  const recCarousel = document.querySelector('.rec-carousel');
  if (recCarousel) {
    const track = recCarousel.querySelector('.rec-track');
    const slides = Array.from(recCarousel.querySelectorAll('.rec-slide'));
    const dotsWrap = recCarousel.querySelector('.rec-dots');
    const prevBtn = recCarousel.querySelector('[data-rec-prev]');
    const nextBtn = recCarousel.querySelector('[data-rec-next]');
    const nav = recCarousel.parentElement.querySelector('.rec-nav');

    if (slides.length <= 1) {
      if (nav) nav.style.display = 'none';
    } else {
      let index = 0;
      let autoTimer = null;

      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'rec-dot' + (i === 0 ? ' is-active' : '');
        dot.setAttribute('aria-label', `Go to recommendation ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
      });
      const dots = Array.from(dotsWrap.children);

      function goTo(i) {
        index = (i + slides.length) % slides.length;
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((d, di) => d.classList.toggle('is-active', di === index));
      }

      function restartAuto() {
        if (autoTimer) clearInterval(autoTimer);
        if (!reduceMotion) autoTimer = setInterval(() => goTo(index + 1), 6000);
      }

      prevBtn?.addEventListener('click', () => { goTo(index - 1); restartAuto(); });
      nextBtn?.addEventListener('click', () => { goTo(index + 1); restartAuto(); });
      recCarousel.addEventListener('mouseenter', () => autoTimer && clearInterval(autoTimer));
      recCarousel.addEventListener('mouseleave', restartAuto);

      goTo(0);
      restartAuto();
    }
  }

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
    },{ rootMargin: '-15% 0px -60% 0px', threshold: 0 });

    sections.forEach(s => observer.observe(s));
  }

  /* ---------- Hero role rotator ---------- */
  const rotateEl = document.getElementById('heroRotate');
  if (rotateEl) {
    const roles = ['QA Engineer', 'Bug Hunter', 'Database Tester', 'API Tester', 'Regression Specialist'];

    if (reduceMotion) {
      rotateEl.textContent = roles[0];
    } else {
      let roleIndex = 0;

      const deleteRole = () => {
        const current = roles[roleIndex];
        let charIndex = current.length;
        const deleteChar = () => {
          charIndex--;
          rotateEl.textContent = current.slice(0, charIndex);
          if (charIndex > 0) {
            setTimeout(deleteChar, 35);
          } else {
            roleIndex = (roleIndex + 1) % roles.length;
            typeRole();
          }
        };
        deleteChar();
      };

      const typeRole = () => {
        const next = roles[roleIndex];
        let charIndex = 0;
        const typeChar = () => {
          charIndex++;
          rotateEl.textContent = next.slice(0, charIndex);
          if (charIndex < next.length) {
            setTimeout(typeChar, 55);
          } else {
            setTimeout(deleteRole, 1600);
          }
        };
        typeChar();
      };

      typeRole();
    }
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

  /* ---------- Fleeing bug ---------- */
  const bug = document.getElementById('crawlingBug');
  if (bug) {
    const placeBugRandomly = () => {
      const margin = 60;
      const maxTop = window.innerHeight - margin;
      const maxLeft = window.innerWidth - margin;
      const top = margin + Math.random() * (maxTop - margin);
      const left = margin + Math.random() * (maxLeft - margin);
      bug.style.top = `${top}px`;
      bug.style.left = `${left}px`;
    };

    placeBugRandomly();
    bug.addEventListener('click', placeBugRandomly);
    window.addEventListener('resize', placeBugRandomly);
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
