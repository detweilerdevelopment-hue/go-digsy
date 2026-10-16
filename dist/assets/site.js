'use strict';

const scene = document.querySelector('#scene');
const art = document.querySelector('#adventure-art');
const feedback = document.querySelector('#feedback');
const pause = document.querySelector('#pause');
const colors = [...document.querySelectorAll('.color-choice[data-leaf-color]')];
const colorNote = document.querySelector('#color-note');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
let paused = motion.matches;
let found = false;
let layersReady = false;
let layerError = false;
let greetingTimer;
let rustleTimer;

function syncColors() {
  const coloring = scene.classList.contains('coloring');
  colors.forEach(button => { button.disabled = coloring || !layersReady; });
  colorNote.hidden = !coloring && !layerError;
  colorNote.textContent = coloring
    ? 'Leaf colors are available on the full-color page.'
    : 'Leaf colors could not load. The story and find activity still work.';
}

function syncPause() {
  document.body.classList.toggle('paused', paused);
  pause.setAttribute('aria-pressed', String(paused));
  pause.disabled = motion.matches;
  pause.textContent = motion.matches ? 'Movement off' : paused ? 'Play movement' : 'Pause movement';
  pause.title = motion.matches
    ? 'Your device’s reduced-motion setting is on.'
    : 'Pause or resume the owl, leaves, and gentle celebration';
}
syncPause();
motion.addEventListener('change', event => {
  if (event.matches) paused = true;
  syncPause();
});
pause.addEventListener('click', () => { paused = !paused; syncPause(); });

function clearGreeting() {
  // A pause in the middle of the greeting keeps the original character frozen in place.
  if (paused && !motion.matches) return;
  scene.classList.remove('greet');
}
function greet() {
  clearTimeout(greetingTimer);
  scene.classList.remove('greet');
  void scene.offsetWidth;
  scene.classList.add('greet');
  feedback.textContent = 'Whooo, hello! Owl is happy you stopped by.';
  greetingTimer = setTimeout(clearGreeting, 2200);
}
scene.addEventListener('animationend', event => {
  if (event.animationName === 'owl-hello') scene.classList.remove('greet');
});
document.querySelector('#greet').addEventListener('click', greet);
document.querySelector('.owl').addEventListener('click', greet);

document.querySelector('#hint').addEventListener('click', () => {
  document.querySelector('#find').open = true;
  if (!found) scene.classList.add('hinting');
  feedback.textContent = found
    ? 'You found it! Choose Play again to look once more.'
    : 'Look on Owl’s wing, just below its face. A little green leaf is tucked into the feathers.';
});
document.querySelector('.leaf').addEventListener('click', () => {
  if (found) return;
  found = true;
  scene.classList.remove('hinting');
  scene.classList.add('found');
  feedback.textContent = 'You found the little leaf! Wonderful looking, woodland explorer!';
  document.querySelector('.leaf').setAttribute('aria-label', 'Leaf found! Choose Play again to reset.');
});
document.querySelectorAll('.canopy, .canopy-lower').forEach(button => button.addEventListener('click', () => {
  clearTimeout(rustleTimer);
  scene.classList.remove('rustle');
  void scene.offsetWidth;
  scene.classList.add('rustle');
  feedback.textContent = found
    ? 'Rustle, rustle! The big leaf says well done, explorer!'
    : 'Rustle, rustle! The big leaf says hello. Can you find the tiny one?';
  rustleTimer = setTimeout(() => { if (!paused) scene.classList.remove('rustle'); }, 1200);
}));
scene.addEventListener('animationend', event => {
  if (event.animationName === 'leaf-rustle') scene.classList.remove('rustle');
});

function setLeafColor(color) {
  scene.dataset.leafColor = color;
  colors.forEach(button => {
    const selected = button.dataset.leafColor === color;
    button.setAttribute('aria-pressed', String(selected));
    button.textContent = selected ? '✓' : '';
  });
}
colors.forEach(button => button.addEventListener('click', () => {
  setLeafColor(button.dataset.leafColor);
  feedback.textContent = `${button.getAttribute('aria-label')}! Your woodland can be different.`;
}));

document.querySelector('#reset').addEventListener('click', () => {
  found = false;
  clearTimeout(greetingTimer);
  clearTimeout(rustleTimer);
  scene.classList.remove('hinting', 'found', 'greet', 'rustle');
  setLeafColor('green');
  document.querySelector('#find').open = false;
  document.querySelector('.leaf').setAttribute('aria-label', 'Small green leaf on the owl’s wing');
  feedback.textContent = 'A tiny discovery is waiting for you.';
});

document.querySelector('[data-art-toggle]').hidden = false;
document.querySelector('[data-art-toggle]').addEventListener('click', event => {
  const button = event.currentTarget;
  const original = button.getAttribute('aria-pressed') !== 'true';
  art.src = original ? art.dataset.original : art.dataset.color;
  art.alt = original
    ? 'Original coloring-book illustration of an owl on a branch, with a little leaf on its wing.'
    : 'Full-color illustration of an owl on a branch, with a little green leaf on its wing.';
  button.setAttribute('aria-pressed', String(original));
  button.textContent = original ? 'See the colored page' : 'See the coloring page';
  document.querySelector('#art-caption').textContent = original
    ? 'The original coloring-book illustration.'
    : 'A colored companion to your book. Your colors can be different!';
  scene.classList.toggle('coloring', original);
  syncColors();
});
document.querySelector('[data-text-size]').hidden = false;
document.querySelector('[data-text-size]').addEventListener('click', event => {
  const on = document.querySelector('.story').classList.toggle('large');
  event.currentTarget.setAttribute('aria-pressed', String(on));
  event.currentTarget.textContent = on ? 'Standard text' : 'Larger text';
});
document.querySelector('a[href="#find"]').addEventListener('click', () => {
  document.querySelector('#find').open = true;
});

// Load prepared artwork locally. If unavailable, the original picture remains fully visible.
const cleanPlate = new Image();
cleanPlate.src = new URL('woodland-clean-plate.webp', art.src).href;
cleanPlate.decode().then(() => {
  layersReady = true;
  scene.classList.add('layers-ready');
  syncColors();
}).catch(() => { layerError = true; syncColors(); });
