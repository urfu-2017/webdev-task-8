import { states } from './model';

const htmlSatiety = document.querySelector('.state_satiety');
const htmlEnergy = document.querySelector('.state_energy');
const htmlMood = document.querySelector('.state_mood');
export const htmlSpeech = document.querySelector('.speech');

export const feedButton = document.querySelector('.hrundel__controls-feed');
export const resetButton = document.querySelector('.hrundel__controls-reset');

const hrundelPortrets = document.querySelectorAll('.hrundel__controls-portret');

const hrundelIdle = document.querySelector('.portret-idle');
const hrundelListen = document.querySelector('.portret-listen');
const hrundelSleep = document.querySelector('.portret-sleep');
const hrundelEat = document.querySelector('.portret-eat');
const hrundelDie = document.querySelector('.portret-die');

const hrundelAudio = document.querySelector('.hrundel__audio');
const volumeControl = document.querySelector('.hrundel__controls-volume');

hrundelAudio.volume = 0.5;
volumeControl.oninput = () => (hrundelAudio.volume = volumeControl.value);

const randomInteger = (min, max) => Math.round(min - 0.5 + Math.random() * (max - min + 1));

const makeNoise = () => setTimeout(() => {
    hrundelAudio.play();
    makeNoise();
}, randomInteger(1000, 60000));

makeNoise();

export const setState = ({ satiety, energy, mood, state }) => {
    htmlSatiety.innerHTML = `${satiety}%`;
    htmlEnergy.innerHTML = `${energy}%`;
    htmlMood.innerHTML = `${mood}%`;

    htmlSatiety.style.width = `${satiety}%`;
    htmlEnergy.style.width = `${energy}%`;
    htmlMood.style.width = `${mood}%`;

    hrundelPortrets.forEach(node => (node.style.display = 'none'));

    if (state.has(states.DIE)) {
        hrundelDie.style.display = 'block';

        return;
    }

    switch (Array.from(state.values()).pop()) {
        case states.EATING: hrundelEat.style.display = 'block';
            break;
        case states.SLEEPING: hrundelSleep.style.display = 'block';
            break;
        case states.SPEAKING: hrundelListen.style.display = 'block';
            break;
        default: hrundelIdle.style.display = 'block';
    }
};
