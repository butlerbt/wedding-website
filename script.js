document.addEventListener('DOMContentLoaded', () => {

  // ── Countdown Timer ──
  // Change this date to match your wedding
  const weddingDate = new Date('2026-09-12T15:00:00');

  function updateCountdown() {
    const now = new Date();
    const diff = weddingDate - now;

    if (diff <= 0) {
      document.getElementById('countdown').innerHTML =
        '<p style="font-family: var(--font-display); font-size: 1.5rem; font-style: italic;">Today is the day!</p>';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('countdown').innerHTML = `
      <div class="countdown-unit">
        <span class="countdown-number">${days}</span>
        <span class="countdown-label">Days</span>
      </div>
      <div class="countdown-unit">
        <span class="countdown-number">${hours}</span>
        <span class="countdown-label">Hours</span>
      </div>
      <div class="countdown-unit">
        <span class="countdown-number">${minutes}</span>
        <span class="countdown-label">Minutes</span>
      </div>
      <div class="countdown-unit">
        <span class="countdown-number">${seconds}</span>
        <span class="countdown-label">Seconds</span>
      </div>
    `;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ── Navbar scroll effect ──
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // ── RSVP Form ──
  const form = document.getElementById('rsvp-form');
  const successEl = document.getElementById('rsvp-success');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        form.classList.add('hidden');
        successEl.classList.remove('hidden');
      } else {
        throw new Error('Form submission failed');
      }
    } catch {
      btn.textContent = 'Send RSVP';
      btn.disabled = false;
      alert('Something went wrong. Please try again or contact us directly.');
    }
  });

  // ── Scroll reveal animations ──
  const fadeEls = document.querySelectorAll('.detail-card, .gallery-item, .faq-item');
  fadeEls.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  fadeEls.forEach(el => observer.observe(el));

});
