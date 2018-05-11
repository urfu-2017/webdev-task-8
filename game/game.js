import { Hrunogochi } from './hrunogochi';
import { SVG } from './svg';
import { notify } from './notifications';
import { STATE } from './state';
import * as Audio from './audio';

const savedState = JSON.parse(localStorage.getItem('state')) || undefined;
const hrunogochi = new Hrunogochi(savedState);

const heroDisplay = document.querySelector('.svg');
const energyDisplay = document.querySelector('.state__energy span');
const moodDisplay = document.querySelector('.state__mood span');
const satietyDisplay = document.querySelector('.state__satiety span');
const textDisplay = document.querySelector('.text');

let isSatietyMode = false;
let isSleepMode = false;
let isRecognizeMode = false;

if ('AmbientLightSensor' in window) {
    const sensor = new window.AmbientLightSensor();

    sensor.addEventListener('reading', function () {
        if (sensor.illuminance < 400) {
            isSatietyMode = true;
        }
    });

    sensor.start();
}

if (navigator.getBattery) {
    navigator.getBattery().then(battery => {
        document.querySelector('.eat').remove();
        isSatietyMode = battery.charging;
        battery.onchargingchange = event => isSatietyMode = event.currentTarget.charging;
    });
}

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognizer = new SpeechRecognition();
recognizer.lang = 'ru-RU';
recognizer.interimResults = true;

recognizer.onstart = () => isRecognizeMode = true;
recognizer.onend = () => isRecognizeMode = false;
recognizer.onresult = (event) => {
    const result = event.results[0][0];
    textDisplay.textContent = result.transcript;
};

window.addEventListener('blur', () => isSleepMode = true);
window.addEventListener('focus', () => isSleepMode = false);

document.querySelector('.new-game').addEventListener('click', () => hrunogochi.reset());
document.querySelector('.eat').addEventListener('click', () => isSatietyMode = true);
document.querySelector('.say').addEventListener('click', () => recognizer.start());

const svg = new SVG(heroDisplay, hrunogochi.state);

function draw({ energy, mood, satiety, state }) {
    energyDisplay.textContent = energy;
    moodDisplay.textContent = mood;
    satietyDisplay.textContent = satiety;

    svg.reDraw(state);
}

// eslint-disable-next-line complexity
function setAction({ energy, mood, satiety }) {
    hrunogochi.setIdle();

    if (isSatietyMode && satiety < 100) {
        hrunogochi.setSatiety();
    }

    if (isRecognizeMode && mood < 100) {
        hrunogochi.setMood();
    } else {
        recognizer.stop();
    }

    if (isSleepMode && energy < 100) {
        hrunogochi.setEnergy();
    }
}

(function tick() {
    localStorage.setItem('state', JSON.stringify(Object.assign({}, hrunogochi.params)));
    const params = hrunogochi.params;

    draw(params);
    setAction(params);

    if (params.state !== STATE.DEAD && isSleepMode) {
        notify(params);
    }

    if (params.state !== STATE.IDLE) {
        Audio.stop();
    } else if (Math.random() > 0.15) {
        Audio.play();
    }

    hrunogochi.update();
    setTimeout(tick, 1000);
}());


