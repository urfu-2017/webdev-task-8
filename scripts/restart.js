'use strict';
/* eslint-disable */

var restartButton = document.querySelector('.restart-button');
function resetState() {
    localStorage.setItem('satiety', 100);
    localStorage.setItem('energy', 100);
    localStorage.setItem('mood', 100);
    currentState = states.NOTHING;
}
function startGame() {
    satiety.innerHTML = localStorage.getItem('satiety');
    energy.innerHTML = localStorage.getItem('energy');
    mood.innerHTML = localStorage.getItem('mood');
}
restartButton.addEventListener('click', function (e) {
    resetState();
    startGame();
});
