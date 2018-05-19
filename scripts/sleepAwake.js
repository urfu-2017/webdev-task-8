'use strict';
/* eslint-disable */

var sleepButton = document.querySelector('.sleep');
var awakeButton = document.querySelector('.awake');
var sleepAwakeDelay = 500;
function failingASleep() {
    currentState = states.SLEEPING;
    failingASleepAnimation(sleepAwakeDelay);
}
function awakening() {
    currentState = states.NOTHING;
    awakeningAnimation(sleepAwakeDelay);
}
sleepButton.addEventListener('click', function (e) {
    failingASleep();
});
awakeButton.addEventListener('click', function (e) {
    awakening();
});
window.addEventListener('blur', function (e) {
    failingASleep();
});
window.addEventListener('focus', function (e) {
    awakening();
});

if ('AmbientLightSensor' in window) {
    var sensor = new AmbientLightSensor();

    sensor.addEventListener('reading', function (e) {
        if (sensor.illuminance < 50) {
            failingASleep();
        } else {
            awakening();
        }
    });

    sensor.start();
}
