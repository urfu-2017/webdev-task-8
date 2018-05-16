'use strict';
/* eslint-disable */

const satiety = document.getElementsByClassName('hrundel_states_satiety')[0];
const mood = document.getElementsByClassName('hrundel_states_mood')[0];
const energy = document.getElementsByClassName('hrundel_states_energy')[0];
const feed = document.getElementsByClassName('hrundel_controls_feed')[0];
const sleep = document.getElementsByClassName('hrundel_controls_sleep')[0];
const regame = document.getElementsByClassName('regame')[0];
const defaultCharacteristics = {
    satiety: 100,
    mood: 100,
    energy: 100,
    state: 'live'
};
let hrundel;

function startGame(characteristics) {
    satiety.innerHTML = `Satiety: ${characteristics.satiety}%`;
    mood.innerHTML = `Mood: ${characteristics.mood}%`;
    energy.innerHTML = `Energy: ${characteristics.energy}%`;
    hrundel = new Hrundel(characteristics);
}

window.onload = () => {
    if (document.cookie) {
        const characteristics = JSON.parse(document.cookie.split('=')[1]);
        startGame(characteristics);
    } else {
        startGame(defaultCharacteristics);
    }
    const hello = new SpeechSynthesisUtterance('Привет хозяин');
    window.speechSynthesis.speak(hello);
    speak();
};


window.onblur = () => {
    svgSleep();
    hrundel.characteristics.state = 'sleeping';
};

window.onfocus = () => {
    svgLife();
    hrundel.characteristics.state = 'life';
};

regame.onclick = () => {
    hrundel.die();
    startGame({
        satiety: 100,
        mood: 100,
        energy: 100,
        state: 'live'
    });
};
