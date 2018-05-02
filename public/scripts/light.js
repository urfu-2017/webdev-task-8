'use strict';

function onUpdateDeviceLight(event) {
    console.info(event.value);
}

if ('AmbientLightSensor' in window || 'ondevicelight' in window) {
    // второе условие выполняется в Firefox, но eventListener не срабатывает
    const sensor = new AmbientLightSensor(); // eslint-disable-line

    sensor.addEventListener('reading', function () {
        console.info(sensor.illuminance + ' lux');
    });

    sensor.start();

    window.addEventListener('devicelight', onUpdateDeviceLight);
}
