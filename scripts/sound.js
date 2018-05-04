'use strict';
/* eslint-disable */

var volume = document.querySelector('.volume');
var range = 10;
var backgroundSoundDelay = 15000;
function playSound(path, volume) {
    let sound = new Audio(path);
    sound.volume = volume;
    sound.play();
}
function playBackgroundSound() {
    let normalizedVolume = parseInt(volume.value) / range;
    playSound('./hru.mp3', normalizedVolume);
}
let soundInterval = setInterval(() => playBackgroundSound(), backgroundSoundDelay);
