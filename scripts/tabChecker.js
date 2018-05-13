'use strict';

(() => {
    const energy = document.querySelector('.energy-lack');
    let interval;

    const startSleeping = () => {
        interval = setInterval(() => {
            energy.style.width = (energy.offsetWidth - 20) + '%';
        }, 300);
    };

    const stopSleeping = () => {
        clearInterval(interval);
    };

    function handleVisibilityChange() {
        if (document.visibilityState === 'hidden') {
            startSleeping();
        } else {
            stopSleeping();
        }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange, false);
})();
