// ═══════════════════════════════
//  CONFIGURACIÓN SLIDER RESEÑAS
// ═══════════════════════════════
const REVIEWS_INTERVAL    = 4000;  // ms entre reseñas (autoplay)
const REVIEWS_TRANSITION  = 500;   // ms de la transición (igualar al CSS)
// ═══════════════════════════════

const track  = document.getElementById('sliderReviews');
const dotsEl = document.getElementById('sliderDots');
const cards  = track.querySelectorAll('.review');
const total  = cards.length;
let current  = 0;
let paused   = false;
let timer    = null;

// Crear puntos
cards.forEach((_, idx) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (idx === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(idx));
    dotsEl.appendChild(dot);
});

const dots = dotsEl.querySelectorAll('.dot');

function goTo(index) {
    current = (index + total) % total;
    const cardWidth = cards[0].offsetWidth + 20; // ancho + gap
    track.style.transform = `translateX(-${current * cardWidth}px)`;
    dots.forEach(d => d.classList.remove('active'));
    dots[current].classList.add('active');
}

function next() { goTo(current + 1); }
function prev() { goTo(current - 1); }

function startTimer() {
    timer = setInterval(() => { if (!paused) next(); }, REVIEWS_INTERVAL);
}

// Pausa en hover
track.addEventListener('mouseenter', () => { paused = true; });
track.addEventListener('mouseleave', () => { paused = false; });

// Arrastre con click (drag)
let startX = 0;
let isDragging = false;

track.addEventListener('mousedown', e => {
    startX = e.clientX;
    isDragging = true;
    paused = true;
    track.style.transition = 'none';
});

document.addEventListener('mouseup', e => {
    if (!isDragging) return;
    isDragging = false;
    paused = false;
    track.style.transition = `transform ${REVIEWS_TRANSITION}ms ease`;
    const diff = e.clientX - startX;
    if (diff < -50) next();
    else if (diff > 50) prev();
    else goTo(current); // vuelve a posición si no hay suficiente arrastre
});

// Soporte táctil
track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; paused = true; });
track.addEventListener('touchend', e => {
    paused = false;
    const diff = e.changedTouches[0].clientX - startX;
    if (diff < -50) next();
    else if (diff > 50) prev();
});

startTimer();