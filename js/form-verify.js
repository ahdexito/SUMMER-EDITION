document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const phoneInput = document.getElementById('telefono');

    form.addEventListener('submit', (e) => {
        // Verificación del Honeypot (Seguridad Anti-Bot)
        const honey = document.getElementById('hp_field').value;
        if (honey.length > 0) {
            console.warn("Bot detectado");
            e.preventDefault();
            return;
        }

        // Verificación de Teléfono (Solo números y longitud mínima)
        const phoneRegex = /^[0-9+ ]{9,15}$/;
        if (!phoneRegex.test(phoneInput.value)) {
            alert("Por favor, introduce un número de teléfono válido.");
            phoneInput.focus();
            e.preventDefault();
            return;
        }

        // Feedback visual al enviar
        const btn = form.querySelector('.button');
        btn.innerText = "ENVIANDO...";
        btn.style.opacity = "0.7";
        btn.style.pointerEvents = "none";
    });
});