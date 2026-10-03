document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Theme Switcher (6 Themes Support) ---------- */
  const html = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themes = ['dark', 'light', 'slate', 'ledger', 'cyberpunk', 'midnight'];
  const savedTheme = localStorage.getItem('portfolio-theme');
  
  if (savedTheme && themes.includes(savedTheme)) {
    html.setAttribute('data-theme', savedTheme);
  }

  const applyThemeState = () => {
    if (!themeToggle) return;
    const current = html.getAttribute('data-theme') || 'dark';
    const isLightFamily = current === 'light' || current === 'ledger';
    themeToggle.setAttribute('aria-pressed', String(isLightFamily));
  };
  applyThemeState();

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme') || 'dark';
      const next = themes[(themes.indexOf(current) + 1) % themes.length];
      html.setAttribute('data-theme', next);
      localStorage.setItem('portfolio-theme', next);
      applyThemeState();
    });
  }

  /* ---------- Font Pairing Switcher ---------- */
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

  /* ---------- Clamp / Expand Text Toggles ---------- */
  document.querySelectorAll('[data-clamp-toggle]').forEach(btn => {
    const card = btn.closest('article, .log-card, .finding-card, .card');
    if (!card) return;

    const target = card.querySelector(
      '.finding-desc.is-clamped, .log-list.is-clamped, .finding-desc, .log-list, .card-desc'
    );
    if (!target) return;

    const isOverflowing = target.scrollHeight > target.clientHeight;

    if (!isOverflowing) {
      btn.style.display = 'none';
      return;
    }

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

  /* ---------- Case Study & Project Carousel ---------- */
  document.querySelectorAll('.carousel-wrapper').forEach(wrapper => {
    const track = wrapper.querySelector('[data-carousel]');
    const prevBtn = wrapper.querySelector('.carousel-btn.prev');
    const nextBtn = wrapper.querySelector('.carousel-btn.next');

    if (!track || !prevBtn || !nextBtn) return;

    const getScrollAmount = () => {
      const card = track.querySelector('.tc-card, .finding-card, .project-card');
      const gap = parseInt(getComputedStyle(track).gap) || 0;
      return card ? card.offsetWidth + gap : track.clientWidth;
    };

    prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
      resetAutoPlay();
    });

    nextBtn.addEventListener('click', () => {
      scrollNext();
      resetAutoPlay();
    });

    const scrollNext = () => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (Math.ceil(track.scrollLeft) >= maxScroll - 5) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
      }
    };

    let autoPlayTimer = setInterval(scrollNext, 3000);

    const resetAutoPlay = () => {
      clearInterval(autoPlayTimer);
      autoPlayTimer = setInterval(scrollNext, 3000);
    };

    wrapper.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
    wrapper.addEventListener('mouseleave', () => resetAutoPlay());

    const updateButtons = () => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      prevBtn.classList.toggle('is-hidden', track.scrollLeft <= 5);
      nextBtn.classList.toggle('is-hidden', track.scrollLeft >= maxScroll - 5);
    };

    track.addEventListener('scroll', updateButtons);
    window.addEventListener('resize', updateButtons);
    updateButtons();
  });

  /* ---------- Mobile Navigation Drawer ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const drawer = document.getElementById('drawer');

  if (menuToggle && drawer) {
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
  }

  /* ---------- Navigation Scrollspy ---------- */
  const sections = ['about', 'skills', 'projects', 'bugs', 'contact']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const stageLinks = Array.from(document.querySelectorAll('.stage, .nav-links a'));
  const order = sections.map(s => s.id);

  const setActive = (id) => {
    stageLinks.forEach(link => {
      const href = link.getAttribute('href')?.replace('#', '');
      if (href === id) {
        link.classList.add('is-active');
      } else {
        link.classList.remove('is-active');
      }
    });
  };

  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-20% 0px -50% 0px', threshold: 0 });

    sections.forEach(s => observer.observe(s));
  }

  /* ---------- Hero Role Text Rotator ---------- */
  const rotateEl = document.getElementById('heroRotate');
  if (rotateEl) {
    const roles = ['SQA Engineer', 'Automation Tester', 'API Quality Specialist', 'Bug Hunter', 'Performance Tester'];

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

  /* ---------- Fleeing Bug Feature ---------- */
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

  /* ---------- Contact Form Mailto Action ---------- */
  const form = document.getElementById('ticketForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('tName')?.value.trim() || '';
      const email = document.getElementById('tEmail')?.value.trim() || '';
      const message = document.getElementById('tMsg')?.value.trim() || '';

      const subject = encodeURIComponent(`SQA Portfolio Inquiry from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      window.location.href = `mailto:arsalantaqi255@gmail.com?subject=${subject}&body=${body}`;
    });
  }
});
