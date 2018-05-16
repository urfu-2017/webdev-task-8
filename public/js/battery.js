(() => {
    'use strict';
    const feedButton = document.querySelector('.control__feed');
    feedButton.addEventListener('click', () => {
        window.Pig.states.changeHunger(window.Pig.speed.eating);
    });
    const batteryCheckInterval = 1000;
    function initBattery(battery) {
        if (!battery) {
            feedButton.classList.add('control__feed_visible');
        }
        setInterval(() => {
            if (battery.charging) {
                window.Pig.startEating();
            } else {
                window.Pig.finishEating();
            }
        }, batteryCheckInterval);
    }

    if (typeof navigator.getBattery === 'function') {
        navigator
            .getBattery()
            .then(initBattery);
    }
})();
