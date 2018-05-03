'use strict';
/* eslint-disable */

var volume = document.querySelector('.volume');
function playSound(path, volume) {
    let sound = new Audio(path);
    sound.volume = volume;
    sound.play();
}
let soundInterval = setInterval(() => playSound('./hru.mp3', parseInt(volume.value) / 10), 15000);
