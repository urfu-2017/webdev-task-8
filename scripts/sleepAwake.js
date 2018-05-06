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
