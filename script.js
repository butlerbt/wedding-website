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

  // ── Guest List (SHA-256 hashed names and emails) ──
  // Generate hashes with: node generate-hashes.js "Name,email" "Name,email" ...
  const GUEST_HASHES = new Set([
    // Group 1: Sam Bennett & Gisela Bennett
    '47c3c95dc5a5a7e26a548be8ac69f461e53a3d423b3a872367fcb792627bcaf4',
    '6ae20ed40db69c77da773aaafbf44f53005c2699425029e59a1dad17d4856500',
    '038b00fff62d7f838a905be924df7fbf9405755b46cea5d067599b8e68207577',
    '7db04e17126e5d92bf3330248b876ad81d3909cd940846aeb7c4721233d3b3a6',
    // Group 2: Susan Butler
    'f91780a05553d4d1275cef8cace00a1c7d3f2df67c25d6c9b159216e6ce3466c',
    '5a8ed336af5aea766f1f160292d7ec79747147483d25a8b0353268e9de5ac2dc',
    // Group 3: Stephanie Harwood & Will Harwood
    '8eb2cf1c003a832ce7b2078ca647e61925967563f53faa233deaed47118aee0a',
    '2a20db46d1645bfbdc2f5ee9ad71034088984cabc4a308af74f28460f1aa1660',
    'daca3b54e8f809c2dd266321c8028f5fa1772495eefd99162e6d0875c512ec0c',
    '628f9e128c9f9de524ea5531ff6b1951e207bb08f340441aadfe85ed1657aff6',
    // Group 4: Alan Butler & Amelia Height
    '575d9441258ba24b9573fa276a1f4a1f317cdd71af077948254bee2cc45d20f8',
    'fc304a31e4e70114d312ff3e1bdddc11e3cc12e1266f97ca5c57145cfc81ba94',
    '1669eff134a26c8e4016b40211e058e5376cf8f9b08efbcac752b3f868f9389f',
    '41c2e1af6495d23b0a2fe9ea360c98f9411235105e1ed3e96669b1f15efaba3a',
    // Group 5: Bob Butler
    'bc1d743b3bb75d2d20b81996395622e1c1248dc1c32df22fe54b5d4ab9fd2b1b',
    'ed17bcc351850ed194213dcd14dae5f5332682d5f3e11dc73d4c53bf73674399',
    // Group 6: Christoph von Ruexleben & Jenn Cizek
    'f90e9718027b6a39e191aba36422be6634ecae0b1d63a8ce8d7f0aad9c68ca29',
    '8da050685e205e1022c93c55d83027117f7b5fdaf858f5bef3eaadece3a5be9f',
    '125a8e89c115410d020cbd21369522b56f03e78d93a9b9eaee02610b32fb4d7b',
    'a766331c3fcfb03486d8608a163e0dbc2b759e0e8907eff7de309fb5aaf02db4',
    // Group 7: Clare Gallagher & LT Nickell
    '8db0054cfa42033f240f8c2d6b3dc476cfe29622e7fc93f12b53ac08404d3995',
    '810ce3bb45c7e6ea41ef4404a186ba4048ae4df78c851e5caf0dd76e1db7d5ba',
    'd6b9ac2f5f9251f210c79bee18a04846e2a42c27d5a0059078d98594fbc74e0d',
    '12c34557b97e4b345f566dc6eccb4c74d7b6e239457ce7bbfb3e9290cccd9d69',
    // Group 8: Anna Callahan & Mike Coyle
    'a2b09e9ba75e1592cb5066d85b53ea27f139e62032be5e46930e0c7da42e7a9e',
    '9f39c14e388055bd834e83e398b556e8fe3b39ebfb46729b3fd10b72e855d68d',
    '1ce6a7cc5634e18a5b3b047d8552c5e0525e2e62640ba7ee1d1545677ce3738b',
    'f79d5c4c1ca0d9ecef4f5e0df4017ed42d9e79feb288604a5459884958f3ef8e',
    // Group 9: Will Buckner
    'aff7b233677cf9486c8defbf2c7ea4013a6ba220ecce657006f8a06d8ca18c96',
    '4396a8326903e6dd441a7509cf395dadc131071261690e1aeb4f5a66181a6e02',
    // Group 10: Jesse Pine & Hannah Pine
    '79c632fea741244803c946daba0d1dd52c7453016e1d4e24878c66d5e28074d9',
    '4702f125da87ebbc3c16bf1e0e62444820b70a0a1bcbb768555cfddcd6353cca',
    'dcfb4f90de02c72f07059f7d826cf98d710b45524bed3237bf89762c2bd8a52c',
    '19dbc3801c9b087f324d3d5645dd432754f8a1d4d6fd02407537ce2845ec170b',
    // Group 11: Grace Carpenter & Jonathan McLaren
    'f9114532938d71eab31171c3398e0a50e7001d7262476cac7b88a8393946a567',
    'ccb0f24b02096228fdb612ff515ba84493118771f24a86e1fa83db5e19416c9a',
    '48541203df035d48eda48e7ff73da0c77fc8259000e11f018ff1f4241045d13c',
    'b18adb6902c79641a9383640de8c90fc2db26e818d248fa73325d21a2f4a6b94',
    // Group 12: Zach Lovell & Syd Knadler
    'e9d3548299709beb923a1ff4da149a5d4ac75407263e196e620dc0239f78c681',
    '74faa63f58a75fb4cfc4b041bcdd10cf4aae0d8b63eb691ec87a430dc9202960',
    'b0915b4f60407e7a3b3ac9f0aa23a2f66e93638741e2addd2023c5a9aea92363',
    '5c7d33983e26dc73bb7a4bafb8013dc4d66ebe53e7c66208d1244f7c06297191',
    // Group 13: Alex Pollard Lipkis & Victoria Arling
    'e786abc964e2a14ae2ae78ee5580ac292c62758937babd52df1046c83aa3461a',
    'b2ed719790a25e05efd0490ad404d585013e0d38296af72dbfb2982c0b725adb',
    '2f60238ff278dc6e7409876f8357064383c9570eacb7779a333d411f4672aeaa',
    '73264405d2775b496254b464865f1ee390b43d8e573b4526c0745d9626582592',
    // Group 14: Angelina DiFransesco
    'c5389d5cf6163b60064a774e180f609efd09c74f63dccbb8d1028a14f24d25f9',
    'cf212014dba10d9e7723bd199deeff05ce3e278a6ccb841f6f932d8b8c317507',
    // Group 15: Keith Mody & CC Canepa
    'b5f48909de96e5b91b074bbe6bb2359c51ce9c9dcb9b287807e6394c74ca32e5',
    '539c5456eed57070b4f21e0c657905c1eec8a95c3335a103d0c774c4f64212cc',
    '800c75a1336b3c36abdf2e294d0eb9138fb4a60d8edf6ea39b613ee73e155714',
    '508d1feb4260a07926cfec42c332278de19f10c9f0de3674c62572e252e42da2',
    // Group 16: Sean Kuusinen & Maggie Kuusinen
    'd8cad9586e356152408c9361719ecae9a013e8b1f040ba833f0b7f9878f47df3',
    '94d33e86fa902e3a169dedbbe5c42311e4301b6f384532c15ad769d0c7991375',
    '0174c265aba0e3a996903c85dc3af2fade292abdcdc0d618e4e387a31c8ed200',
    'd9673ea21de30d57b90612f91b9294591d6fd7ed859cf7ed81f16c3ef55ebbab',
    // Group 17: Zander Buteaux
    '8ada383622bd32aa25dfe1c9ac30ce50d33b02ee4a0c99c8377470ce0d0ee7a4',
    '86f26aeb8681b44aedf720d9ac9895e33e972ae852fddb0f1d3a9adc1fd33001',
    // Group 18: Jeff Dobroni & Sam Wilits
    '1079e3c338410b345fef5416a48bd10d8c1de4d4b238b6a58228d1e7894c3556',
    '3a1e94602608d8932b0d9b09a1fce6c07bb140447b7805144240a9f35c605236',
    '9c4eb103cb68617c1df8e04ad498696c4dc70025b164390eac1edbb7f2c6557c',
    'f17e11615a70e3a94409e19a21ac3657db69795cc0a86db2f108f167cc0291ce',
    // Group 19: Eva Krechova
    '25da1c3de5560744c3f5fe283c2c4b7a7c4d2a7bc573e8e24ea68aa8a300dd37',
    'a72ba1a40164e32b0bfc508fb94a4c2c057e2ab3f0c668f4fe4f2fa3c7e47e6c',
    // Group 20: Kirill Langer
    '3211e04054503a80f8783144b8307019be31d7ca85fc1fb41b72987840f610b8',
    '900b83f74d6e3403c4349fe4fd1703c2c137c7c2a8b6500d06f4a2b4a8b389bf',
    // Group 21: Steve Griffin & Taylor Griffin
    'a831c1567473507cc7c0db3253adedb452965201cd7489a65743c749e0a51764',
    '2383bd979def3e020c375ac2b3123182c60e4af7b5d48d042d167c7fb44f3f44',
    '3acaad9becd51d2a180c3a7d92ae4f31c71c764cf3e53a3398308bd4dfb63dbe',
    'b63953d9b4fdad6958d6a82b1bc68e32bd5572708e94a2ba12df005cbfce007a',
    // Group 22: Jared Carlson & Hannah Bare
    '8585e45a3918026360c693222a537e3678297a6e74f3d0c572e0ac7d460bfe38',
    '447d4b185448309a4055c9c798459512e5c39406f46ff42882d042e11af25d2e',
    'd02436fcf097610e71f2ca7fb7f4f98dc8061a8d3d314d5fdf81a3d5ef648efa',
    'a2b479734e84f9876ddc6f604d58003bb1a3487af3d007cff1adbd440b7c642f',
    // Group 23: David Alexander & Zoe 
    'd509c47e1fa3e1ce40e3f697975cdf6b1a7a227939a1651844e82fceae516cb3',
    '3d4307178bdbdc81de7b63b7046968557c43864ff30cf77ac30d29cee5b1cb87',
    '9d017e2681b7f31725e1c0fbe2612e89079c22806b02cf7a894b500dd5a219c1',
    '35f0b0ccb00ec9bd5c2565d4ad03fa7951b2a725b297b7a8c9d68a32a19d1a70',
    // Group 24: Rick Cotton
    '5ac805433ecc42ee5e882fd512263a3d4dbf220cd5c0568eace1d681e797121c',
    '326e0b9c40e798aa01a9929395feee61666552ee1a96cfb415a985bd9f50210a',
    // Group 25: Laura Boese & Arne Boese
    '19c86fd8bd05b3e53efc5357e05c72324288d569669f5e0648d4ae09de524b21',
    '3d19fee3b077faa920eea3aa77937451ed7da5ac21e52412d49434ef4f130134',
    'a39fa3757ee0747e8bd9305dd7db8a5fa9907e731d3420009bcbdc4f418d8dc2',
    // Group 26: Julianna Burrill
    'c01d9e0ed84962842367d6032319af8ba2e13c6ab25e45b62b50b71e3113867e',
    'ed928d4d367983a254a36c97075d8b591e15df5d249cf6da57a5d1decfed15db',
    // Group 27: Ethan Harden & Natalie Harden
    '3e0b0d015b7c947f36b4a3e7d8e44815f1f2f5d2a9539b8043027e06b026e1c4',
    'b986c9ef813ff94243a06695b50413021d17ff7b4148cf7b3a71dc8974b6805b',
    'c9ba1ec0725f2e2d4328f50a03203fa399919722568f430a90e778951061fcd2',
    '1f2217d8c380305e6f2fa28e2443a71095f6e916b96d3a4d80687633650dd054',
    // Group 28: Tommy Joyce & Brit Joyce
    'afb2a5dc860028faca6435192d3c8fc7d06fc577e447d65a70a95df4d4f80afb',
    '13f8b85e22d7c64d52d2ef6f3c25f73b237e2e3f266452050658e8a74502c7d4',
    '75d4db7185002ad28a8e3f28a327036d51d7e1e519e41832695af860d8b21a6a',
    '8018c56e4281233829e45d358f6abfa49bd646467c395fcd9eae619cdfbedade',
    // Group 29: Sarah Yeung & Cam Eibl
    '7d9a3bbc1c83ebe19b095b365447585e8fb7925af380751b4625da60e1d61737',
    '52d2a1322dd136c82034bfa730ecd5c77e77ada199d3fd810ea7772635fbac7c',
    '3271fe4f9908a5b51120a26c53cdf421a48232e112ccb7869a8375bb2556cc38',
    'caf64fde1ccf0518c5ac5bb417ca19a3de359c71f42a1fdf8617e2baf8d511db',
    // Group 30: Andre Shprengel
    'a3604df3ffb57a4cb199d2ebd7aefd3ede18c6332507d1e4c0971589cc0ba180',
    '04beb016ea409211c0c7f67d907f720fe00b92a0ea057ce44d090f918a40de6f',
  ]);

  async function hashValue(val) {
    const normalized = val.trim().toLowerCase();
    const encoded = new TextEncoder().encode(normalized);
    const hash = await crypto.subtle.digest('SHA-256', encoded);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async function isOnGuestList(name, email) {
    if (GUEST_HASHES.size === 0) return true;
    const [nameHash, emailHash] = await Promise.all([hashValue(name), hashValue(email)]);
    return GUEST_HASHES.has(nameHash) || GUEST_HASHES.has(emailHash);
  }

  // ── RSVP Form ──
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwPASsFjzG5uUaQ_BjnmSB3ccp09aT_g6RjD5VxVUBWXsltHxIeRFsLw2oSj3IeRw3KKQ/exec';

  const form = document.getElementById('rsvp-form');
  const successEl = document.getElementById('rsvp-success');
  const guestError = document.getElementById('guest-error');
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const allowed = await isOnGuestList(form.name.value, form.email.value);
    if (!allowed) {
      guestError.classList.remove('hidden');
      return;
    }
    guestError.classList.add('hidden');

    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

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
