const btnContraste = document.getElementById('btn-contraste');

btnContraste.addEventListener<click>('click', () => {
    document.body.classList.toggle('alto-contraste');
    
    if (document.body.classList.contains('alto-contraste')) {
        btnContraste.textContent = 'Modo Normal';
    } else {
        btnContraste.textContent = 'Alto Contraste';
    }
});