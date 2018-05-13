'use strict';

(() => {
    const hunger = document.querySelector('.hunger-lack');
    const feedingButton = document.querySelector('.feed');
    feedingButton.addEventListener('click', () => {
        hunger.style.width = (hunger.offsetWidth - 5) + '%';
    });

    let initBattery = battery =>{
        setInterval(() => {
            if (battery.charging) {
                hunger.style.width = (hunger.offsetWidth - 20) + '%';
            }
        }, 4000);
    };

    if (typeof navigator.getBattery === 'function') {
        navigator
            .getBattery()
            .then(initBattery);
    }
})();
