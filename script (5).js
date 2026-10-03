document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Theme toggle (cycles 6 themes) ---------- */
  const html = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themes = ['dark', 'light', 'slate', 'ledger', 'cyberpunk', 'midnight'];
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
    const fontPresets = [null, 'signal', 'report'];
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

document.querySelectorAll('[data-clamp-toggle]').forEach(btn => {
  const card = btn.closest('article, .log-card, .finding-card');
  if (!card) return;

  const target = card.querySelector(
    '.finding-desc.is-clamped, .log-list.is-clamped, .finding-desc, .log-list'
  );
  if (!target) return;

  // Check if content actually overflows while clamped
  const isOverflowing = target.scrollHeight > target.clientHeight;

  if (!isOverflowing) {
    // Hide or remove the button if the content fits naturally
    btn.style.display = 'none';
    return;
  }

  // Handle click toggle for overflowing elements
  btn.addEventListener('click', () => {
    const isClamped = target.classList.contains('is-clamped');

    if (isClamped) {
      target.classList.remove('is-clamped');
      btn.textContent = 'Show less';
    } else {
      target.classList.add('is-clamped');
      btn.textContent = 'Show more';
    }
  });
});

document.querySelectorAll('.carousel-wrapper').forEach(wrapper => {
  const track = wrapper.querySelector('[data-carousel]');
  const prevBtn = wrapper.querySelector('.carousel-btn.prev');
  const nextBtn = wrapper.querySelector('.carousel-btn.next');

  if (!track || !prevBtn || !nextBtn) return;

  // Calculates width of 1 card + grid gap
  const getScrollAmount = () => {
    const card = track.querySelector('.tc-card, .finding-card');
    const gap = parseInt(getComputedStyle(track).gap) || 0;
    return card ? card.offsetWidth + gap : track.clientWidth;
  };

  // Next / Prev click handlers
  prevBtn.addEventListener('click', () => {
    track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    resetAutoPlay();
  });

  nextBtn.addEventListener('click', () => {
    scrollNext();
    resetAutoPlay();
  });

  // Function to move to next slide or loop back to start
  const scrollNext = () => {
    const maxScroll = track.scrollWidth - track.clientWidth;
    // If we've reached the end, wrap back to the beginning
    if (Math.ceil(track.scrollLeft) >= maxScroll - 5) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    }
  };

  // Auto-play Timer (2 Seconds)
  let autoPlayTimer = setInterval(scrollNext, 3000);

  const resetAutoPlay = () => {
    clearInterval(autoPlayTimer);
    autoPlayTimer = setInterval(scrollNext, 3000);
  };

  // Pause auto-scroll when user hovers over the cards to read
  wrapper.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
  wrapper.addEventListener('mouseleave', () => resetAutoPlay());

  // Update button visibility on scroll
  const updateButtons = () => {
    const maxScroll = track.scrollWidth - track.clientWidth;
    prevBtn.classList.toggle('is-hidden', track.scrollLeft <= 5);
    nextBtn.classList.toggle('is-hidden', track.scrollLeft >= maxScroll - 5);
  };

  track.addEventListener('scroll', updateButtons);
  window.addEventListener('resize', updateButtons);
  updateButtons();
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
