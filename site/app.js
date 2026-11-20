const adventures = [
  {
    id: 'prison', name: 'Prison Island', lines: ['Prison', 'Island'], art: 'prison.svg', photo: 'prison-retrato.webp', alt: 'Dos niños con trajes de presos y carteles de ficha policial',
    place: 'Benalmádena, Málaga',
    thought: 'Aquí nos vamos a picar.',
    detail: 'Estamos encerrados en una isla prisión. Vamos como equipo de sala en sala. Hay pruebas de reflejos, de fuerza y de pensar. Si no somos unos mantecaos, podremos escapar'
  },
  {
    id: 'arcano', name: 'El Amuleto Arcano', lines: ['El Amuleto', 'Arcano'], art: 'arcano.svg', photo: 'arcano-retrato.webp', alt: 'Dos pequeños aventureros con un amuleto dorado y un mapa',
    place: 'Torrenigma · Torre del Mar, Málaga',
    thought: 'Tú, yo y un amuleto raro.',
    detail: 'Nos perdemos en un bosque siniestro y llegamos a una mansión extraña. La única forma de salir es encontrar un amuleto... y lograr salir con él. Si no lo conseguimos, al menos ya tenemos un pisito donde vivir (para siempre)'
  },
  {
    id: 'terra', name: 'Terra Mítica', lines: ['Terra', 'Mítica'], art: 'terra.svg', photo: 'terra-retrato.webp', alt: 'Dos niños con los brazos en alto en una montaña rusa',
    place: 'Benidorm, Alicante',
    thought: 'Los dos gritando como idiotas.',
    detail: 'Un día de montañas rusas y de decir «venga, otra vez».',
    note: 'Ahora mismo ha terminado la temporada, en cuanto abra podemos buscar fecha'
  }
];
const artwork = (item) => './art/' + item.art;
const chapters = document.querySelector('#chapters');
chapters.innerHTML = adventures.map((item) => `
  <section class="chapter ${item.id}" id="${item.id}" aria-labelledby="${item.id}-title">
    <div class="stage">
      <div class="scene" aria-hidden="true">
        <img src="${artwork(item)}" alt="" ${item.id === 'prison' ? '' : 'loading="lazy"'} decoding="async">
        <div class="effect"></div>
        ${item.id === 'terra' ? '<svg class="ride" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice"><path id="rail" d="M0 552c163 2 190-375 383-281 115 56 88 229 243 219 109-7 106-174 213-172 111 2 122 214 361 153" fill="none"/><g id="train"><path d="M-31-5h59l7-11-7-8H-31z" fill="#b94e38" stroke="#ffcf8b" stroke-width="2"/><path d="M-26-17h12m7 0H5m7 0h12" stroke="#f7d8a4" stroke-width="4"/></g></svg>' : ''}
      </div>
    </div>
    <div class="chapter-beats">
      <div class="title-block beat">
        <p class="kicker">${item.place}</p>
        <h2 id="${item.id}-title">${item.lines.join('<br>')}</h2>
      </div>
      <div class="beat detail-beat">
        <div class="detail-layout">
          <img class="adventure-photo" src="./art/${item.photo}" alt="${item.alt}" width="1100" height="1100" loading="lazy" decoding="async">
        <div class="detail-copy">
          <h3>${item.thought}</h3>
          <p>${item.detail}</p>
          ${item.note ? '<p class="visit-note">' + item.note + '</p>' : ''}
          ${item.id === 'prison' ? '<div class="score" aria-hidden="true">PUNTOS <span>000</span></div>' : ''}
        </div>
        </div>
      </div>
    </div>
  </section>`).join('');

const cards = document.querySelector('#cards');
cards.innerHTML = adventures.map((item) => `
  <article class="card ${item.id}">
    <img src="${artwork(item)}" alt="" loading="lazy" decoding="async">
    <div class="card-copy"><h3>${item.name}</h3>
    <button data-choice="${item.id}" aria-label="Elegir ${item.name}">Esta</button></div>
  </article>`).join('');

const confirmDialog = document.querySelector('#confirm');
const result = document.querySelector('#result');
const options = document.querySelector('#options');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const storageKey = 'viki-aventura';
let selectedButton;
let pending;

function showChoice(item, celebrate = false) {
  options.hidden = Boolean(item);
  result.hidden = !item;
  if (!item) return;
  const message = '¡Ya he elegido mi regalo de cumpleaños! 🎁 Mi aventura es: ' + item.name + '.';
  result.className = 'result ' + item.id + (celebrate ? ' celebrate' : '');
  result.innerHTML = `
    <img class="result-art" src="${artwork(item)}" alt="">
    <div class="result-copy">
      <h3 id="result-title" tabindex="-1">¡Pues ya tenemos plan!</h3>
      <p>Feliz cumpleaños, Viki ❤️</p>
      <p>Me hace mucha ilusión ir contigo. Te quiero.</p>
      <p>Nos vamos a <strong>${item.name}</strong>.</p>
      <div class="actions"><button id="share">Compartir mi elección</button>
      <a class="share-link" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(message)}">WhatsApp</a></div>
      <textarea id="share-text" aria-label="Mensaje para copiar" readonly hidden></textarea>
      <p id="share-status" role="status"></p>
      <button class="secondary" id="change">Cambiar mi elección</button>
    </div>`;
  result.querySelector('#share').onclick = async () => {
    const status = result.querySelector('#share-status');
    status.textContent = '';
    if (typeof navigator.share === 'function') {
      try { await navigator.share({text: message}); return; }
      catch (error) { if (error.name === 'AbortError') return; }
    }
    try {
      await navigator.clipboard.writeText(message);
      status.textContent = 'Mensaje copiado.';
    } catch {
      const field = result.querySelector('#share-text');
      field.value = message;
      field.hidden = false;
      field.focus();
      field.select();
      status.textContent = 'Copia el mensaje seleccionado o compártelo por WhatsApp.';
    }
  };
  result.querySelector('#change').onclick = () => {
    // Keep the saved choice until a replacement is confirmed.
    showChoice(null);
    (selectedButton ?? cards.querySelector('button')).focus();
  };
  if (celebrate) result.querySelector('#result-title').focus();
}

cards.addEventListener('click', (event) => {
  const button = event.target.closest('[data-choice]');
  if (!button) return;
  selectedButton = button;
  pending = adventures.find((item) => item.id === button.dataset.choice);
  document.querySelector('#confirm-name').textContent = pending.name;
  confirmDialog.returnValue = '';
  confirmDialog.showModal();
});
confirmDialog.addEventListener('close', () => {
  if (confirmDialog.returnValue !== 'accept' || !pending) return;
  try { localStorage.setItem(storageKey, pending.id); } catch {}
  showChoice(pending, true);
});
try {
  const saved = adventures.find((item) => item.id === localStorage.getItem(storageKey));
  if (saved) showChoice(saved);
} catch {}

const stages = [...document.querySelectorAll('.stage')];
const score = document.querySelector('.score span');
const rail = document.querySelector('#rail');
const train = document.querySelector('#train');
const railLength = rail.getTotalLength();
const clamp = (value) => Math.max(0, Math.min(1, value));
let frame = 0;
function draw() {
  frame = 0;
  if (motion.matches) return;
  const height = innerHeight;
  for (const stage of stages) {
    const chapter = stage.closest('.chapter');
    const bounds = chapter.getBoundingClientRect();
    const progress = clamp((height * .7 - bounds.top) / (bounds.height - height * .15));
    stage.style.setProperty('--p', progress.toFixed(3));
    if (chapter.classList.contains('terra')) {
      const distance = Math.min(railLength - 2, railLength * progress);
      const point = rail.getPointAtLength(distance);
      const next = rail.getPointAtLength(distance + 2);
      const angle = Math.atan2(next.y - point.y, next.x - point.x) * 180 / Math.PI;
      train.setAttribute('transform', 'translate(' + point.x + ' ' + point.y + ') rotate(' + angle + ')');
    }
  }
  const progress = clamp((height - score.getBoundingClientRect().top) / (height * .55));
  score.textContent = String(Math.round(progress * 300)).padStart(3, '0');
}
function update() {
  if (!frame) frame = requestAnimationFrame(draw);
}
addEventListener('scroll', update, {passive: true});
addEventListener('resize', update);
motion.addEventListener('change', () => {
  if (motion.matches) score.textContent = '300';
  update();
});
if (motion.matches) score.textContent = '300';
update();
if ('IntersectionObserver' in window) {
  const reveals = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  }, { threshold: .2 });
  for (const beat of document.querySelectorAll('.detail-copy, .adventure-photo, .card')) {
    beat.classList.add('reveal');
    reveals.observe(beat);
  }
}