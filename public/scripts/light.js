'use strict';

(() => {
    function* generateLight() {
        yield { background: '#fff', sleeping: false };
        yield { background: '#f9f9f9', sleeping: false };
        yield { background: '#f4f2f2', sleeping: false };
        yield { background: '#eae8e8', sleeping: false };
        yield { background: '#d6d4d4', sleeping: false };
        yield { background: '#afacac', sleeping: false };
        yield { background: '#999797', sleeping: true };

        return { background: '#848181', sleeping: true };
    }

    const background = document.querySelector('html');
    const energy = document.querySelector('.energy-lack');

    let sleepInterval;

    const sleep = () => {
        sleepInterval = setInterval(() => {
            energy.style.width = (energy.offsetWidth - 25) + '%';
        }, 500);
    };

    const startCycle = () => {
        const generator = generateLight();
        const interval = setInterval(() => {
            const current = generator.next();
            background.style.backgroundColor = current.value.background;
            if (current.value.sleeping) {
                sleep();
            } else {
                clearInterval(sleepInterval);
            }
            if (current.done) {
                clearInterval(interval);
                startCycle();
            }
        }, 3000);
    };

    startCycle();

    // if (window.ondevicelight) {
    // if ('AmbientLightSensor' in window) {
})();
