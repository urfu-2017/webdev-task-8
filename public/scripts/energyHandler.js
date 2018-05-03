'use strict';

function onUpdateDeviceLight(event) {
    // это не работает ни в одном браузере

    console.info(event.value);
}

if ('AmbientLightSensor' in window || 'ondevicelight' in window) {
    const sensor = new AmbientLightSensor(); // eslint-disable-line

    sensor.addEventListener('reading', function () {
        // это не работает ни в одном браузере
        console.info(sensor.illuminance + ' lux');
    });

    sensor.start();

    window.addEventListener('devicelight', onUpdateDeviceLight);
}

let interval;

const startSleeping = () => {
    interval = setInterval(() => {
        let newEnergyValue = Number(localStorage.getItem('energy')) + 5;
        if (newEnergyValue > 100) {
            newEnergyValue = 100;
        }
        localStorage.setItem('energy', newEnergyValue);
    }, 500);
};

const stopSleeping = () => {
    clearInterval(interval);
};

document.addEventListener('blur', startSleeping, true);
document.addEventListener('focus', stopSleeping, true);
