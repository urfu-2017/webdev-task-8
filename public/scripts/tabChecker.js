'use strict';

(() => {
    const energy = document.querySelector('.energy-lack');
    let interval;

    const startSleeping = () => {
        interval = setInterval(() => {
            energy.style.width = (energy.offsetWidth - 20) + '%';
        }, 500);
    };

    const stopSleeping = () => {
        clearInterval(interval);
    };

    document.addEventListener('blur', startSleeping, true);
    document.addEventListener('focus', stopSleeping, true);
})();
