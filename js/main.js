document.addEventListener('DOMContentLoaded', () => {
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

  const shots = document.querySelectorAll('.gallery-photo img, .hero-photo img');
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
