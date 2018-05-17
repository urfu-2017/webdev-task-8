/* eslint-disable no-unused-vars */

'use strict';

let sound = new Audio();
sound.src = './audio/sound.mp3';
sound.volume = 0;

let intervalIden;

let isEnergyVal;
let isFunVal;
let isHungerVal;

intervalIden = setInterval(() => {
    isEnergyVal = localStorage.getItem('energy') > 0 ? 1 : 0;
    isFunVal = localStorage.getItem('fun') > 0 ? 1 : 0;
    isHungerVal = localStorage.getItem('hungry') > 0 ? 1 : 0;
    if (isEnergyVal + isFunVal + isHungerVal < 2) {
        clearInterval(intervalIden);
    } else {
        sound.play();
    }
}, 6000);

let soundControl = document.getElementById('sound-control');

function changeVolume() {
    sound.volume = soundControl.value * 0.01;
}
