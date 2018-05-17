'use strict';
/* eslint-disable */

if ('AmbientLightSensor' in window) {
    const sensor = new AmbientLightSensor();
    sensor.addEventListener('reading', function () {
        if (sensor.illuminance < 500 && hrundel.characteristics.energy < 100) {
            svgSleep();
            hrundel.characteristics.state = 'sleeping';
        }
        if (hrundel.characteristics.energy === 100) {
            svgLife();
            hrundel.characteristics.state = 'life';
        }
    });
    sensor.start();
}
