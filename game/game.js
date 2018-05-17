import { Hrunogochi } from './hrunogochi';
import { SVG } from './svg';
import { NotificationAPI } from './notifications';
import { STATE } from './state';
import { SoundSystem } from './soundSystem';
import { Recognition } from './recognition';

const heroDisplay = document.querySelector('.svg');
const energyDisplay = document.querySelector('.state__energy span');
const moodDisplay = document.querySelector('.state__mood span');
const satietyDisplay = document.querySelector('.state__satiety span');
const textDisplay = document.querySelector('.text');

let isSatietyMode = false;
let isSleepMode = false;
let isRecognizeMode = false;
let idleTime = Date.now();

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

window.addEventListener('blur', () => isSleepMode = true);
window.addEventListener('focus', () => isSleepMode = false);

const savedState = JSON.parse(localStorage.getItem('state')) || undefined;
const hrunogochi = new Hrunogochi(savedState);
const audio = new SoundSystem(document.querySelector('.volume'), 50);
const recognition = new Recognition(status => isRecognizeMode = status, textDisplay);
const notification = new NotificationAPI();

document.querySelector('.new-game').addEventListener('click', () => hrunogochi.reset());
document.querySelector('.eat').addEventListener('click', () => hrunogochi.setSatiety());
document.querySelector('.say').addEventListener('click',
    () => !isRecognizeMode && recognition.start()
);

const svg = new SVG(heroDisplay, hrunogochi.state);

function draw({ energy, mood, satiety, state }) {
    energyDisplay.textContent = energy;
    moodDisplay.textContent = mood;
    satietyDisplay.textContent = satiety;

    svg.reDraw(state);
}

// eslint-disable-next-line complexity
function setAction({ energy, mood, satiety }) {
    if (isSatietyMode && satiety < 100) {
        hrunogochi.setSatiety();
    }

    if (isRecognizeMode && mood < 100) {
        hrunogochi.setMood();
    } else {
        recognition.stop();
    }

    if (isSleepMode && energy < 100) {
        hrunogochi.setEnergy();
    }
}

(function tick() {
    localStorage.setItem('state', JSON.stringify(Object.assign({}, hrunogochi.params)));

    setAction(hrunogochi.params);
    draw(hrunogochi.params);

    if (hrunogochi.params.state !== STATE.DEAD && isSleepMode) {
        notification.notify(hrunogochi.params);
    }

    if (hrunogochi.params.state !== STATE.IDLE) {
        idleTime = Date.now();
        audio.pause();
    } else if (Date.now() - idleTime > 3000) {
        // включаем звук, если хрюногочи без внимания 3 сек
        audio.play();
    }

    hrunogochi.update();
    setTimeout(tick, 1000);
}());


