document.addEventListener('DOMContentLoaded', () => {

  // ── Countdown Timer ──
  // Change this date to match your wedding
  const weddingDate = new Date('2027-01-24T15:00:00');

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
  // Replace this URL with your Google Apps Script web app URL (see README)
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwPASsFjzG5uUaQ_BjnmSB3ccp09aT_g6RjD5VxVUBWXsltHxIeRFsLw2oSj3IeRw3KKQ/exec';

  const form = document.getElementById('rsvp-form');
  const successEl = document.getElementById('rsvp-success');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    const iframe = document.createElement('iframe');
    iframe.name = 'rsvp-iframe';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const hiddenForm = document.createElement('form');
    hiddenForm.method = 'POST';
    hiddenForm.action = GOOGLE_SCRIPT_URL;
    hiddenForm.target = 'rsvp-iframe';
    hiddenForm.style.display = 'none';

    const fields = { name: form.name.value, email: form.email.value,
      guests: form.guests.value, attending: form.attending.value,
      dietary: form.dietary.value, message: form.message.value };

    for (const [key, val] of Object.entries(fields)) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = val;
      hiddenForm.appendChild(input);
    }

    document.body.appendChild(hiddenForm);
    hiddenForm.submit();

    setTimeout(() => {
      form.classList.add('hidden');
      successEl.classList.remove('hidden');
      hiddenForm.remove();
      iframe.remove();
    }, 2000);
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
