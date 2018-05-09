'use strict';

(() => {
    const hunger = document.querySelector('.hunger-lack');
    const feedingButton = document.querySelector('.battery');
    feedingButton.addEventListener('click', () => {
        hunger.style.width = (hunger.offsetWidth - 5) + '%';
    });

    function initBattery(battery) {
        // пишет charging: false, хотя ноутбук заряжается
        // console.info(battery);
        setInterval(() => {
            if (battery.charging) {
                hunger.style.width = (hunger.offsetWidth - 20) + '%';
            }
        }, 1000);
    }

    if (typeof navigator.getBattery === 'function') {
        navigator
            .getBattery()
            .then(initBattery);
    }
})();
