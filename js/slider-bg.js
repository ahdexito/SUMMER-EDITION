// ═══════════════════════════════
//  CONFIGURACIÓN DEL SLIDER
// ═══════════════════════════════
const SLIDES        = [
    'img/slider/slide1.jpg', 
    'img/slider/slide2.jpg', 
    'img/slider/slide3.jpg', 
    'img/slider/slide4.jpg', 
    'img/slider/slide5.jpg', 
    'img/slider/slide6.jpg'
];
const INTERVAL      = 5000;   // ms entre slides
const FADE_DURATION = 1500;   // ms que dura el fundido cruzado
const ZOOM_SCALE    = 1.08;   // nivel de zoom (1.05 = sutil, 1.15 = pronunciado)
// ═══════════════════════════════

const section = document.getElementById('landing');
let i = 0;

// Precarga todas las imágenes al inicio
const preloaded = SLIDES.map(src => {
    const img = new Image();
    img.src = src;
    return img;
});

function createLayer(src, zIndex) {
    const el = document.createElement('div');
    el.style.cssText = `
        position: absolute; inset: 0;
        background: url(${src}) center/cover no-repeat;
        transition: opacity ${FADE_DURATION}ms ease, transform ${INTERVAL + FADE_DURATION}ms ease-out;
        z-index: ${zIndex};
        opacity: 0;
    `;
    return el;
}

function startZoom(layer) {
    layer.style.transform = 'scale(1)';
    requestAnimationFrame(() => requestAnimationFrame(() => {
        layer.style.transform = `scale(${ZOOM_SCALE})`;
    }));
}

// Espera a que la primera imagen cargue antes de mostrarla
function init() {
    const current_layer = createLayer(SLIDES[0], 1);
    section.prepend(current_layer);

    preloaded[0].onload = () => showLayer(current_layer);
    // Si ya estaba cacheada, onload no se dispara — comprobamos complete
    if (preloaded[0].complete) showLayer(current_layer);

    startSlider(current_layer);
}

function showLayer(layer) {
    requestAnimationFrame(() => requestAnimationFrame(() => {
        layer.style.opacity = '1';
        startZoom(layer);
    }));
}

function startSlider(initial) {
    let current = initial;

    setInterval(() => {
        const next = (i + 1) % SLIDES.length;
        const nextLayer = createLayer(SLIDES[next], 0);
        section.prepend(nextLayer);

        // Solo hace la transición cuando la imagen ya está cargada
        const doTransition = () => {
            showLayer(nextLayer);
            current.style.opacity = '0';

            setTimeout(() => {
                current.remove();
                nextLayer.style.zIndex = 1;
                current = nextLayer;
                i = next;
            }, FADE_DURATION);
        };

        preloaded[next].onload = doTransition;
        if (preloaded[next].complete) doTransition();

    }, INTERVAL);
}

init();