document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    const applyIcon = () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      themeToggle.textContent = isLight ? '☾' : '☀';
    };
    applyIcon();
    themeToggle.addEventListener('click', () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      if (isLight) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('taktyn-theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('taktyn-theme', 'light');
      }
      applyIcon();
    });
  }

  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('main-nav');

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  const clock = document.getElementById('header-clock');
  if (clock) {
    const tick = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      clock.textContent = `${hh}:${mm}:${ss}`;
    };
    tick();
    setInterval(tick, 1000);
  }

  const term = document.getElementById('terminal-body');
  if (term) {
    const isFr = document.documentElement.lang === 'fr';
    const lines = isFr ? [
      { text: '$ ./taktyn --status', cls: 'tl-cmd' },
      { text: '[ok] carte tactique......... EN LIGNE', cls: 'tl-ok' },
      { text: '[ok] chat chiffré AES-256.... ACTIF', cls: 'tl-ok' },
      { text: '[ok] radio LoRa 868MHz....... EN VEILLE', cls: 'tl-ok' },
      { text: '[ok] hébergement.............. SUISSE', cls: 'tl-ok' },
      { text: '[--] connexion internet...... COUPÉE', cls: 'tl-warn' },
      { text: '[ok] bascule radio auto...... < 30s', cls: 'tl-ok' },
      { text: 'Coordination maintenue.', cls: 'tl-info' },
    ] : [
      { text: '$ ./taktyn --status', cls: 'tl-cmd' },
      { text: '[ok] tactical map............ ONLINE', cls: 'tl-ok' },
      { text: '[ok] AES-256 encrypted chat.. ACTIVE', cls: 'tl-ok' },
      { text: '[ok] LoRa radio 868MHz....... STANDBY', cls: 'tl-ok' },
      { text: '[ok] hosting.................. SWITZERLAND', cls: 'tl-ok' },
      { text: '[--] internet connection..... DOWN', cls: 'tl-warn' },
      { text: '[ok] auto radio failover..... < 30s', cls: 'tl-ok' },
      { text: 'Coordination maintained.', cls: 'tl-info' },
    ];

    let i = 0;
    const typeLine = () => {
      if (i >= lines.length) {
        const cursor = document.createElement('div');
        cursor.className = 'tl-row tl-cursor-row';
        cursor.innerHTML = '<span class="tl-prompt">$</span><span class="tl-cursor"></span>';
        term.appendChild(cursor);
        return;
      }
      const row = document.createElement('div');
      row.className = `tl-row ${lines[i].cls}`;
      row.textContent = lines[i].text;
      term.appendChild(row);
      i += 1;
      setTimeout(typeLine, 340);
    };
    typeLine();
  }

  const revealTargets = document.querySelectorAll(
    '.section-head, .feature-card, .gallery-shot, .sector-card, .step, .compare-col, .pricing-card, .security-card, .field-rack-card, .field-diagram, .stat'
  );
  if (revealTargets.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealTargets.forEach((el, i) => {
      el.classList.add('reveal-init');
      el.style.transitionDelay = `${(i % 6) * 70}ms`;
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach((el) => io.observe(el));
  }

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const isFr = document.documentElement.lang === 'fr';
    const statusEl = document.getElementById('contact-status');
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalLabel = submitBtn.textContent;

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      submitBtn.disabled = true;
      submitBtn.textContent = isFr ? 'Envoi...' : 'Sending...';
      statusEl.textContent = '';
      statusEl.className = 'form-status';

      try {
        const res = await fetch(contactForm.action, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: new FormData(contactForm),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || 'submit failed');

        contactForm.reset();
        statusEl.textContent = isFr
          ? 'Message envoyé — réponse sous quelques jours.'
          : 'Message sent — reply within a few days.';
        statusEl.classList.add('form-status-ok');
      } catch (err) {
        statusEl.textContent = isFr
          ? "Échec de l'envoi — réessayez ou écrivez à itgenl@proton.me."
          : 'Failed to send — please retry or email itgenl@proton.me.';
        statusEl.classList.add('form-status-error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      }
    });
  }

  const shots = document.querySelectorAll('.gallery-shot img');
  if (shots.length) {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = '<button class="lightbox-close" aria-label="Close">&times;</button><figure><img alt=""><figcaption></figcaption></figure>';
    document.body.appendChild(overlay);
    const lbImg = overlay.querySelector('img');
    const lbCap = overlay.querySelector('figcaption');

    const open = (img) => {
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      const cap = img.parentElement.querySelector('figcaption');
      lbCap.textContent = cap ? cap.textContent : '';
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    };
    const close = () => {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    };

    shots.forEach((img) => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => open(img));
    });
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target.closest('.lightbox-close')) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });
  }
});
