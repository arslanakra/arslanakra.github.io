document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Theme toggle (cycles 6 themes) ---------- */
  const html = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themes = ['dark', 'light', 'slate', 'ledger', 'cyberpunk', 'midnight'];
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme && themes.includes(savedTheme)) html.setAttribute('data-theme', savedTheme);

  const radarAvatarButton = document.querySelector('.radar-avatar-button');
  if (radarAvatarButton) {
    radarAvatarButton.addEventListener('click', () => {
      const isZoomed = radarAvatarButton.classList.toggle('is-zoomed');
      radarAvatarButton.setAttribute('aria-pressed', String(isZoomed));
      radarAvatarButton.setAttribute('aria-label', isZoomed ? 'Restore portrait size' : 'Zoom portrait');
    });
  }

  const rotateEl = document.getElementById('heroRotate');
  if (rotateEl) {
    const roles = ['API Tester', 'QA Engineer', 'Bug Hunter', 'Database Tester', 'Regression Specialist'];
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

      setTimeout(deleteRole, 1600);
    }
  }

  const skillDetails = {
    manual: {
      category: 'QUALITY PRACTICE',
      title: 'Manual testing',
      evidence: [['Chat App QA', 'Web & mobile'], ['Check Cashing Mobile App', 'Functional flows']],
      description: 'Validated web and mobile journeys, edge cases, and release builds through hands-on exploratory and functional testing.'
    },
    regression: {
      category: 'QUALITY PRACTICE',
      title: 'Regression testing',
      evidence: [['Agent POS System', 'Playwright + manual'], ['Check Cashing Web App', 'Critical rollouts']],
      description: 'Retested core workflows during releases and automated regression scenarios for the agent-facing POS platform.'
    },
    strategy: {
      category: 'QUALITY PRACTICE',
      title: 'Test planning',
      evidence: [['Check Cashing Web App', 'Test cases & reports'], ['QA delivery', 'Risk-based scenarios']],
      description: 'Created targeted test scenarios and QA documentation to catch issues early across financial and mobile products.'
    },
    cases: {
      category: 'QUALITY PRACTICE',
      title: 'Test cases',
      evidence: [['Pistachio POS', 'End-to-end coverage'], ['Chat App QA', '100+ scenarios']],
      description: 'Wrote and executed detailed test cases for end-to-end, regression, and edge-case behavior.'
    },
    'bug-reporting': {
      category: 'QUALITY PRACTICE',
      title: 'Bug reporting',
      evidence: [['Software Technologies', 'Jira'], ['QA delivery', 'Reproduction steps']],
      description: 'Documented defects with clear reproduction steps, resolution reports, and follow-up validation.'
    },
    mobile: {
      category: 'QUALITY PRACTICE',
      title: 'Mobile testing',
      evidence: [['Chat App QA', 'Web & mobile clients'], ['MySalarium', 'TestFlight builds']],
      description: 'Tested mobile workflows and TestFlight builds, checking functionality and release readiness.'
    },
    playwright: {
      category: 'AUTOMATION',
      title: 'Playwright',
      evidence: [['Agent POS System', 'Core regression automation'], ['Playwright certification', 'Test Automation University']],
      description: 'Automated core regression scenarios and validated end-to-end behavior for check-cashing and OCR workflows.'
    },
    e2e: {
      category: 'AUTOMATION',
      title: 'End-to-end testing',
      evidence: [['Pistachio POS', 'Complete E2E testing'], ['Agent POS System', 'Check-cashing flow']],
      description: 'Verified complete user journeys across frontend, backend responses, and connected system workflows.'
    },
    locators: {
      category: 'AUTOMATION',
      title: 'Web element locators',
      evidence: [['Applitools', 'Locator strategies certificate'], ['Playwright', 'UI automation']],
      description: 'Applied web element locator strategies for reliable browser test automation.'
    },
    cicd: {
      category: 'AUTOMATION',
      title: 'GitHub Actions',
      evidence: [['Tooling', 'CI/CD']],
      description: 'Familiar with GitHub Actions as part of the QA and continuous integration toolset.'
    },
    api: {
      category: 'API & DATA',
      title: 'API testing',
      evidence: [['MySalarium', 'Intermex APIs'], ['Chat App QA', 'Message sync & sockets']],
      description: 'Validated endpoint responses, transaction status, and consistency between API behavior and client experiences.'
    },
    postman: {
      category: 'API & DATA',
      title: 'Postman',
      evidence: [['Check Cashing Mobile App', 'API & backend validation'], ['Agent POS System', 'Response validation']],
      description: 'Used Postman to validate API responses and backend behavior across financial and POS applications.'
    },
    database: {
      category: 'API & DATA',
      title: 'SQL & databases',
      evidence: [['Backend validation', 'SQL queries'], ['Portfolio examples', 'MySQL']],
      description: 'Used SQL and database checks to validate backend data and application behavior.'
    },
    jmeter: {
      category: 'API & DATA',
      title: 'JMeter',
      evidence: [['API validation', 'Load testing']],
      description: 'Load tested endpoints with JMeter as part of API and backend quality checks.'
    },
    jira: {
      category: 'TOOLS & WORKFLOW',
      title: 'Jira',
      evidence: [['Software Technologies', 'Defect tracking'], ['QA delivery', 'Issue follow-up']],
      description: 'Tracked defects and documented reproduction steps to support clear handoffs and resolution.'
    },
    git: {
      category: 'TOOLS & WORKFLOW',
      title: 'Git',
      evidence: [['Development workflow', 'Version control']],
      description: 'Use Git as part of collaborative software and QA workflows.'
    },
    testflight: {
      category: 'TOOLS & WORKFLOW',
      title: 'TestFlight',
      evidence: [['MySalarium', 'Pre-release builds'], ['Mobile apps', 'Build validation']],
      description: 'Validated TestFlight builds before production releases and checked mobile app behavior.'
    },
    'rest-assured': {
      category: 'API & DATA',
      title: 'REST Assured',
      evidence: [['API testing toolkit', 'REST API checks']],
      description: 'REST Assured is part of the API testing toolkit used for validating REST services.'
    }
  };

  const skillMap = document.querySelector('.skill-map');
  if (skillMap) {
    const skillPoints = Array.from(skillMap.querySelectorAll('.skill-point'));
    const categoryKey = {
      AUTOMATION: 'automation',
      'API & DATA': 'api',
      'QUALITY PRACTICE': 'quality',
      'TOOLS & WORKFLOW': 'workflow'
    };
    let selectedSkill = 'playwright';

    const showSkill = skillId => {
      const skill = skillDetails[skillId];
      if (!skill) return;
      const skillTitle = document.getElementById('skillTitle');
      const skillEvidence = document.getElementById('skillEvidence');
      const skillMark = skillTitle.querySelector('.skill-detail-mark');
      document.getElementById('skillCategory').textContent = skill.category;
      skillTitle.lastChild.textContent = skill.title;
      document.getElementById('skillDescription').textContent = skill.description;
      skillMark.className = `skill-detail-mark skill-key skill-key-${categoryKey[skill.category]}`;
      skillEvidence.replaceChildren(...skill.evidence.map(([project, context]) => {
        const row = document.createElement('p');
        row.className = 'skill-evidence-item';
        const projectName = document.createElement('span');
        const projectContext = document.createElement('span');
        projectName.textContent = project;
        projectContext.textContent = context;
        row.append(projectName, projectContext);
        return row;
      }));
    };

    const selectSkill = skillId => {
      selectedSkill = skillId;
      skillPoints.forEach(point => {
        const isSelected = point.dataset.skill === selectedSkill;
        point.classList.toggle('is-selected', isSelected);
        point.setAttribute('aria-pressed', String(isSelected));
      });
      showSkill(skillId);
    };

    skillPoints.forEach(point => {
      point.addEventListener('mouseenter', () => showSkill(point.dataset.skill));
      point.addEventListener('mouseleave', () => showSkill(selectedSkill));
      point.addEventListener('focus', () => showSkill(point.dataset.skill));
      point.addEventListener('blur', () => showSkill(selectedSkill));
      point.addEventListener('click', () => selectSkill(point.dataset.skill));
      point.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          selectSkill(point.dataset.skill);
        }
      });
    });

    showSkill(selectedSkill);
  }

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

const projectDetails = {
  mysalarium: {
    kicker: 'CASE FILE 01 · MOBILE REMITTANCE',
    title: 'MySalarium — Send Money App',
    description: 'Mobile remittance app built on Intermex APIs, handling transfers to single and multiple payees with real-time status tracking.',
    tags: ['Send money flow', 'Multi-payee', 'Intermex API', 'TestFlight'],
    highlights: [
      'Tested send and repeat-transfer flows for single and multiple payees.',
      'Validated transfer cancellation at different in-flight stages.',
      'Checked real-time API status updates for pending, sent, and cancelled transfers.',
      'Tested TestFlight builds and monitored crash logs before release.'
    ]
  },
  'agent-pos': {
    kicker: 'CASE FILE 02 · AUTOMATION & OCR',
    title: 'Agent POS — Check Cashing & OCR',
    description: 'End-to-end QA for an agent POS platform covering check cashing, OCR-based check reading, and connected scanner hardware.',
    tags: ['Playwright', 'Gemini OCR', 'Postman', 'Scanner hardware'],
    highlights: [
      'Tested terminal registration and auto-approve, auto-decline, and pending-decision paths.',
      'Validated OCR failure handling for amount, signature, and CAR/LAR mismatches.',
      'Verified MICR check-data reading and flatbed, Aspire, and Epson scanners.',
      'Automated core regression scenarios with Playwright and validated APIs with Postman.'
    ]
  },
  'check-web': {
    kicker: 'CASE FILE 03 · WEB & FINANCIAL',
    title: 'Check Cashing Web App & Back Office',
    description: 'Customer-facing money-transfer platform and back office for account, approval, and reporting workflows.',
    tags: ['Regression', 'CTR/SAR compliance', 'User permissions', 'Jira'],
    highlights: [
      'Tested approvals, user permissions, reporting, and transaction-monitoring modules.',
      'Created test cases, resolution reports, and QA documentation.',
      'Performed regression testing during critical rollouts.',
      'Reduced the reported bug ratio by 30% through preemptive scenario writing.'
    ]
  },
  chat: {
    kicker: 'CASE FILE 04 · WEB & MOBILE',
    title: 'Chat App QA — Web & Mobile',
    description: 'Quality assurance for a real-time messaging app across mobile and web clients with socket integration.',
    tags: ['Manual testing', 'API testing', 'Sockets', '100+ scenarios'],
    highlights: [
      'Tested web and mobile clients and reviewed frontend behavior.',
      'Validated socket responses, API endpoints, and message synchronization across devices.',
      'Analyzed error logs and developed more than 100 test scenarios.',
      'Tested TestFlight builds and helped reduce post-release defects.'
    ]
  },
  'check-mobile': {
    kicker: 'CASE FILE 05 · MOBILE & KYC',
    title: 'Check Cashing Mobile App',
    description: 'Mobile check-cashing application supporting real-time financial transactions.',
    tags: ['KYC', 'Postman', 'Backend validation', 'Crash scenarios'],
    highlights: [
      'Tested transaction, KYC, receipt, and history modules.',
      'Validated APIs with Postman and checked backend data.',
      'Tested TestFlight builds before release.',
      'Created test cases and exercised edge-case crash scenarios.'
    ]
  }
};

const projectTimeline = document.querySelector('.project-timeline');
if (projectTimeline) {
  const projectTabs = Array.from(projectTimeline.querySelectorAll('[data-project]'));
  const projectPanel = document.getElementById('project-detail');
  const renderProject = projectId => {
    const project = projectDetails[projectId];
    const selectedTab = projectTabs.find(tab => tab.dataset.project === projectId);
    if (!project || !selectedTab) return;

    projectTabs.forEach(tab => {
      const isSelected = tab === selectedTab;
      tab.classList.toggle('is-selected', isSelected);
      tab.setAttribute('aria-selected', String(isSelected));
      tab.tabIndex = isSelected ? 0 : -1;
    });

    projectPanel.setAttribute('aria-labelledby', selectedTab.id);
    document.getElementById('project-kicker').textContent = project.kicker;
    document.getElementById('project-title').textContent = project.title;
    document.getElementById('project-description').textContent = project.description;

    const tags = document.getElementById('project-tags');
    tags.replaceChildren(...project.tags.map(tag => {
      const element = document.createElement('span');
      element.className = 'tag';
      element.textContent = tag;
      return element;
    }));

    const highlights = document.getElementById('project-highlights');
    highlights.replaceChildren(...project.highlights.map(highlight => {
      const element = document.createElement('li');
      element.textContent = highlight;
      return element;
    }));
  };

  projectTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => renderProject(tab.dataset.project));
    tab.addEventListener('keydown', event => {
      let nextIndex = index;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % projectTabs.length;
      else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + projectTabs.length) % projectTabs.length;
      else if (event.key === 'Home') nextIndex = 0;
      else if (event.key === 'End') nextIndex = projectTabs.length - 1;
      else return;

      event.preventDefault();
      const nextTab = projectTabs[nextIndex];
      renderProject(nextTab.dataset.project);
      nextTab.focus();
    });
  });

  renderProject(projectTabs.find(tab => tab.getAttribute('aria-selected') === 'true').dataset.project);
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
  const sections = ['home','about','skills','experience','projects','contact']
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
      const topic = document.getElementById('tTopic').value;
      const message = document.getElementById('tMsg').value.trim();

      const subject = encodeURIComponent(`${topic} — portfolio contact from ${name}`);
      const body = encodeURIComponent(`${message}\n\nTopic: ${topic}\n— ${name} (${email})`);
      window.location.href = `mailto:arsalantaqi255@gmail.com?subject=${subject}&body=${body}`;
    });
  }
});
