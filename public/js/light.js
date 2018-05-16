'use strict';

(() => {
    const limitIlluminance = 10;
    const sleepInDark = (illuminance) => {
        if (limitIlluminance < illuminance) {
            window.Pig.startSleeping();
        } else {
            window.Pig.finishSleeping();
        }
    };

    if ('AmbientLightSensor' in window) {
        var sensor = new AmbientLightSensor(); /* eslint-disable-line */
        sensor.onreading = function () {
            console.info('Current light level:', sensor.illuminance);
            sleepInDark(sensor.illuminance);
        };
        sensor.onerror = function (event) {
            console.info(event.error.name, event.error.message);
        };
        sensor.start();
    } else {
        window.addEventListener('devicelight', function (event) {
            sleepInDark(event.value);
        });
    }
})();
