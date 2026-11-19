const adventures = [
  {
    id: 'prison', number: '01', name: 'Prison Island', lines: ['Prison', 'Island'], art: 'prison.svg',
    kicker: '¿Aceptas el desafío?', short: 'Retos, competición y risas.',
    paragraphs: ['Una prisión llena de desafíos donde tendremos que poner a prueba nuestra inteligencia, nuestros reflejos y nuestra capacidad para trabajar en equipo.', 'Habitaciones con pruebas diferentes, retos inesperados y una misión: conseguir tantos puntos como podamos.'],
    facts: [['Ubicación', 'Benalmádena, Málaga'], ['Tipo', 'Desafíos físicos, mentales y de habilidad'], ['Modalidad', 'Cooperativa y competitiva'], ['Ideal para', 'Reírnos, picarnos y superar retos juntos']],
    quote: 'Dos jugadores. Un montón de desafíos. ¿Cuántos conseguiremos superar?'
  },
  {
    id: 'arcano', number: '02', name: 'El Amuleto Arcano', lines: ['El Amuleto', 'Arcano'], art: 'arcano.svg',
    kicker: 'La magia nos está llamando', short: 'Magia, fantasía y misterio.',
    paragraphs: ['Un mundo lleno de secretos, enigmas y magia nos espera.', 'Tendremos que explorar, investigar y resolver misterios para descubrir los secretos que esconde el Amuleto Arcano. Una aventura donde cada descubrimiento nos acercará un poco más a la verdad.'],
    facts: [['Ubicación', 'Torrenigma · Torre del Mar, Málaga'], ['Tipo', 'Aventura fantástica y enigmas'], ['Modalidad', 'Experiencia inmersiva para dos'], ['Ideal para', 'Vivir una historia de fantasía juntos']],
    quote: 'Toda aventura comienza con una elección. Esta podría ser la nuestra.'
  },
  {
    id: 'terra', number: '03', name: 'Terra Mítica', lines: ['Terra', 'Mítica'], art: 'terra.svg',
    kicker: '¿Preparada para gritar?', short: 'Montañas rusas y adrenalina.',
    paragraphs: ['Esta vez no tendremos que resolver enigmas.', 'Nos esperan montañas rusas, caídas, velocidad y atracciones que pondrán a prueba nuestros nervios. Un día entero para gritar, reírnos y disfrutar de un parque de atracciones de verdad.'],
    facts: [['Ubicación', 'Benidorm, Alicante'], ['Tipo', 'Parque de atracciones'], ['Experiencia', 'Montañas rusas, adrenalina y diversión'], ['Fecha', 'A concretar durante la próxima temporada de apertura']],
    quote: 'La aventura más grande. Las caídas más fuertes. Y nosotros dos gritando como idiotas.'
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
      <div class="title-block">
        <p class="kicker">${item.number} / ${item.kicker}</p>
        <h2 id="${item.id}-title">${item.lines.join('<br>')}</h2>
      </div>
    </div>
    <div class="story">
      <div class="story-copy">${item.paragraphs.map((p) => '<p>' + p + '</p>').join('')}
      ${item.id === 'prison' ? '<div class="score" aria-hidden="true">MARCADOR DE PRUEBA <span>000</span></div>' : ''}</div>
      <dl>${item.facts.map(([label, value]) => '<div><dt>' + label + '</dt><dd>' + value + '</dd></div>').join('')}</dl>
      <blockquote>«${item.quote}»</blockquote>
    </div>
  </section>`).join('');

const cards = document.querySelector('#cards');
cards.innerHTML = adventures.map((item) => `
  <article class="card ${item.id}">
    <img src="${artwork(item)}" alt="" loading="lazy" decoding="async">
    <div class="card-copy"><h3>${item.name}</h3><p>${item.short}</p>
    <button data-choice="${item.id}" aria-label="Elegir ${item.name}">Elegir esta aventura</button></div>
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
      <h3 id="result-title" tabindex="-1">Aventura elegida.</h3>
      <p>Feliz cumpleaños, Viki ❤️</p>
      <p>Lo importante no es dónde vayamos.<br>Es que vamos juntos.<br>Te quiero.</p>
      <p>Tu aventura seleccionada es <strong>${item.name}</strong>.</p>
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
    const bounds = stage.getBoundingClientRect();
    const progress = clamp((height - bounds.top) / (height + bounds.height * .65));
    stage.style.setProperty('--p', progress.toFixed(3));
    if (stage.closest('.terra')) {
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