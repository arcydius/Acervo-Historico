// Lógica para el botón de Alto Contraste
const btnContraste = document.getElementById('btn-contraste');

if (btnContraste) {
    btnContraste.addEventListener('click', () => {
        document.body.classList.toggle('alto-contraste');
        
        if (document.body.classList.contains('alto-contraste')) {
            btnContraste.textContent = 'Modo Normal';
        } else {
            btnContraste.textContent = 'Alto Contraste';
        }
    });
}

// Lógica para la barra de navegación pegajosa (Sticky/Fixed) con fondo negro al hacer scroll
const navbar = document.querySelector('.navbar');

if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}
