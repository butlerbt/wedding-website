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

  // ── Guest List ──
  // Regenerate with: node import-guests.js guests.csv
  // PASTE_GUEST_DATA_HERE

  async function hashValue(val) {
    const normalized = val.trim().toLowerCase();
    const encoded = new TextEncoder().encode(normalized);
    const hash = await crypto.subtle.digest('SHA-256', encoded);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async function findGroup(input) {
    if (!GUEST_LOOKUP || Object.keys(GUEST_LOOKUP).length === 0) return null;
    const h = await hashValue(input);
    const groupId = GUEST_LOOKUP[h];
    if (!groupId) return null;
    return { id: groupId, ...GUEST_GROUPS[groupId] };
  }

  // ── RSVP Form ──
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwPASsFjzG5uUaQ_BjnmSB3ccp09aT_g6RjD5VxVUBWXsltHxIeRFsLw2oSj3IeRw3KKQ/exec';

  const searchEl = document.getElementById('rsvp-search');
  const lookupInput = document.getElementById('rsvp-lookup');
  const findBtn = document.getElementById('rsvp-find-btn');
  const guestError = document.getElementById('guest-error');
  const form = document.getElementById('rsvp-form');
  const guestsContainer = document.getElementById('rsvp-guests');
  const successEl = document.getElementById('rsvp-success');

  // Step 1: Find reservation
  findBtn.addEventListener('click', async () => {
    const input = lookupInput.value.trim();
    if (!input) return;

    findBtn.textContent = 'Searching...';
    findBtn.disabled = true;

    const group = await findGroup(input);

    if (!group) {
      guestError.classList.remove('hidden');
      findBtn.textContent = 'Find Reservation';
      findBtn.disabled = false;
      return;
    }

    guestError.classList.add('hidden');
    buildGuestForm(group);
    searchEl.classList.add('hidden');
    form.classList.remove('hidden');
  });

  lookupInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); findBtn.click(); }
  });

  lookupInput.addEventListener('input', () => {
    guestError.classList.add('hidden');
  });

  // Step 2: Build per-person form
  function buildGuestForm(group) {
    guestsContainer.innerHTML = '';
    group.names.forEach((name, i) => {
      const card = document.createElement('div');
      card.className = 'guest-card';
      card.innerHTML = `
        <h3>${name}</h3>
        <div class="form-group">
          <label>Will you attend?</label>
          <div class="radio-group">
            <label class="radio-label">
              <input type="radio" name="attending_${i}" value="yes" required>
              <span>Joyfully accepts</span>
            </label>
            <label class="radio-label">
              <input type="radio" name="attending_${i}" value="no">
              <span>Regretfully declines</span>
            </label>
          </div>
        </div>
        <div class="form-group">
          <label for="dietary_${i}">Dietary Restrictions</label>
          <input type="text" id="dietary_${i}" name="dietary_${i}" placeholder="e.g., vegetarian, gluten-free">
        </div>
      `;
      guestsContainer.appendChild(card);
    });
  }

  // Step 3: Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    const cards = guestsContainer.querySelectorAll('.guest-card');
    const responses = [];
    cards.forEach((card, i) => {
      const name = card.querySelector('h3').textContent;
      const attending = card.querySelector(`input[name="attending_${i}"]:checked`);
      const dietary = card.querySelector(`input[name="dietary_${i}"]`);
      responses.push({
        name,
        attending: attending ? attending.value : '',
        dietary: dietary ? dietary.value : ''
      });
    });

    const message = form.querySelector('#message').value;
    const data = { responses: JSON.stringify(responses), message, submittedBy: lookupInput.value };

    const iframe = document.createElement('iframe');
    iframe.name = 'rsvp-iframe';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const hiddenForm = document.createElement('form');
    hiddenForm.method = 'POST';
    hiddenForm.action = GOOGLE_SCRIPT_URL;
    hiddenForm.target = 'rsvp-iframe';
    hiddenForm.style.display = 'none';

    for (const [key, val] of Object.entries(data)) {
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
