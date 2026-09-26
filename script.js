/* ==========================================================
   PORTFOLIO ENHANCEMENTS
   Drop this in as a <script> after your existing scripts, and
   add the small markup snippets noted in each section below.
   ========================================================== */

/* ---------- 1. Card "show more" (pairs with .is-clamped in CSS) ----------
   HTML pattern for any card that might overflow, e.g. a project card:

   <p class="tc-desc is-clamped" data-clamp>Long description text...</p>
   <button class="card-expand" data-clamp-toggle>Show more</button>

   Works for any element — just add is-clamped + data-clamp to the
   text, and data-clamp-toggle to a sibling button.
*/
document.querySelectorAll('[data-clamp-toggle]').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.previousElementSibling;
    const expanded = target.classList.toggle('is-clamped') === false;
    btn.textContent = expanded ? 'Show less' : 'Show more';
  });
});

/* ---------- 2. Recommendation carousel ----------
   HTML pattern:

   <div class="rec-carousel">
     <div class="rec-track">
       <div class="rec-slide">
         <div class="rec-card"> ...recommendation 1... </div>
       </div>
       <div class="rec-slide">
         <div class="rec-card"> ...recommendation 2... </div>
       </div>
       <!-- one .rec-slide per recommendation -->
     </div>
     <div class="rec-nav">
       <button class="rec-arrow" data-rec-prev aria-label="Previous">‹</button>
       <div class="rec-dots"></div>
       <button class="rec-arrow" data-rec-next aria-label="Next">›</button>
     </div>
   </div>
*/
(function initRecCarousel() {
  const carousel = document.querySelector('.rec-carousel');
  if (!carousel) return;

  const track = carousel.querySelector('.rec-track');
  const slides = Array.from(carousel.querySelectorAll('.rec-slide'));
  const dotsWrap = carousel.querySelector('.rec-dots');
  const prevBtn = carousel.querySelector('[data-rec-prev]');
  const nextBtn = carousel.querySelector('[data-rec-next]');
  const nav = carousel.parentElement.querySelector('.rec-nav');
  let index = 0;
  let autoTimer = null;

  // Only one recommendation so far — hide arrows/dots, nothing to page through.
  // This removes itself automatically once you add more .rec-slide entries.
  if (slides.length <= 1) {
    if (nav) nav.style.display = 'none';
    return;
  }

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
    autoTimer = setInterval(() => goTo(index + 1), 6000);
  }

  prevBtn?.addEventListener('click', () => { goTo(index - 1); restartAuto(); });
  nextBtn?.addEventListener('click', () => { goTo(index + 1); restartAuto(); });

  // Pause autoplay while the user's mouse is over it
  carousel.addEventListener('mouseenter', () => autoTimer && clearInterval(autoTimer));
  carousel.addEventListener('mouseleave', restartAuto);

  goTo(0);
  restartAuto();
})();

/* ---------- 3. Font preset switcher ----------
   HTML pattern (e.g. next to your existing theme-toggle button):

   <button class="theme-toggle" data-font-cycle aria-label="Change font style">Aa</button>
*/
(function initFontCycle() {
  const presets = [null, 'signal', 'report']; // null = default "terminal" pairing
  const btn = document.querySelector('[data-font-cycle]');
  if (!btn) return;

  let saved = localStorage.getItem('portfolio-font');
  if (saved && presets.includes(saved === 'terminal' ? null : saved)) {
    document.documentElement.setAttribute('data-font', saved === 'terminal' ? '' : saved);
  }

  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-font') || null;
    const nextIndex = (presets.indexOf(current) + 1) % presets.length;
    const next = presets[nextIndex];
    if (next) {
      document.documentElement.setAttribute('data-font', next);
    } else {
      document.documentElement.removeAttribute('data-font');
    }
    localStorage.setItem('portfolio-font', next || 'terminal');
  });
})();

/* ---------- 4. Theme cycling (extends your existing light/dark toggle) ----------
   If you want your existing .theme-toggle button to cycle through
   FOUR themes instead of two, replace its click handler with this:

   const themes = ['dark', 'light', 'slate', 'ledger']; // 'dark' = default, no attribute
*/
(function initThemeCycle() {
  const themes = ['dark', 'light', 'slate', 'ledger'];
  const btn = document.querySelector('[data-theme-cycle]'); // give your existing button this attribute
  if (!btn) return;

  let saved = localStorage.getItem('portfolio-theme');
  if (saved && saved !== 'dark') document.documentElement.setAttribute('data-theme', saved);

  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = themes[(themes.indexOf(current) + 1) % themes.length];
    if (next === 'dark') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', next);
    }
    localStorage.setItem('portfolio-theme', next);
  });
})();
