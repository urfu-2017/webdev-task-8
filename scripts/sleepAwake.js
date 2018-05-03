'use strict';
/* eslint-disable */

var sleepButton = document.querySelector('.sleep');
var awakeButton = document.querySelector('.awake');
function failingASleep() {
    currentState = states.SLEEPING;
    leftEye.animate({ transform: 's0.5' }, 1000, mina.linear);
    rightEye.animate({ transform: 's0.5' }, 1000, mina.linear);
}
function awakening() {
    currentState = states.NOTHING;
    leftEye.animate({ transform: 's1' }, 1000, mina.linear);
    rightEye.animate({ transform: 's1' }, 1000, mina.linear);
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
window.onblur = () => failingASleep();
window.onfocus = () => awakening();
