const readings = { illuminance: 400 };


if ('AmbientLightSensor' in window) {
    const sensor = new window.AmbientLightSensor();

    sensor.addEventListener('reading', function () {
        readings.illuminance = sensor.illuminance;
    });

    sensor.start();
}


export default readings;
