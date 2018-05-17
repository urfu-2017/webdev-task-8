'use strict';
/* eslint-disable */

if ('AmbientLightSensor' in window) {
    const sensor = new AmbientLightSensor();
    sensor.addEventListener('reading', function () {
        let energy = hrundel.getCharacteristic('energy');
        if (sensor.illuminance < 500 && energy < 100) {
            svgSleep();
            hrundel.setState('sleeping');
        }
        if (energy === 100) {
            svgLive();
            hrundel.setState('live');
        }
    });
    sensor.start();
}
