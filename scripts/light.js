'use strict';

(() => {
    const energy = document.querySelector('.energy-lack');

    function update(illuminance) {
        // eslint-disable-next-line no-unused-expressions
        illuminance < 50 ? energy.style.width = (energy.offsetWidth - 20) + '%' : null;
    }

    if ('AmbientLightSensor' in window) {
        try {
            // eslint-disable-next-line no-undef
            let sensor = new AmbientLightSensor();
            sensor.addEventListener('reading', () => {
                update(sensor.illuminance);
            });
            sensor.start();
        } catch (e) {
            console.error(e);
        }
    } else if ('ondevicelight' in window) {
        let onUpdateDeviceLight = (event) => {
            update(event.value);
        };
        window.addEventListener('devicelight', onUpdateDeviceLight, false);
    }

})();
