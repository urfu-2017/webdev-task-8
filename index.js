import Hrunogochi from './hrunogochi';
import { emptyHandler } from './utils';

const storageKeys = {
    STATE: 'state',
    VOLUME: 'volume'
};

const ILLUMINANCE_THRESHOLD = 20;

const satiety = document.querySelector('.satiety .state-item__value');
const energy = document.querySelector('.energy .state-item__value');
const mood = document.querySelector('.mood .state-item__value');
const resetButton = document.querySelector('.controls-item.reset');
const speakButton = document.querySelector('.controls-item.speak');
const volume = document.querySelector('.controls-item.volume');
const log = document.querySelector('.log');

volume.value = localStorage.getItem(storageKeys.VOLUME) || volume.value;
const hruState = JSON.parse(localStorage.getItem(storageKeys.STATE));
const hru = new Hrunogochi(hruState);

const draw = () => {
    satiety.textContent = hru.satiety;
    energy.textContent = hru.energy;
    mood.textContent = hru.mood;
};

window.onbeforeunload = () => {
    hru.saveState(state => localStorage.setItem(storageKeys.STATE, JSON.stringify(state)));
    localStorage.setItem(storageKeys.VOLUME, volume.value);
};

window.onblur = () => {
    hru.sleeping = true;
};

window.onfocus = () => {
    hru.sleeping = false;
};

resetButton.onclick = () => hru.reset();

if (window.speechSynthesis) {
    hru.onSpeak = ({ text }) => {
        const speechSynthesis = window.speechSynthesis;
        const message = new SpeechSynthesisUtterance(text);
        message.lang = 'ru-RU';
        message.volume = volume.value / 100;

        speechSynthesis.speak(message);
    };
}

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
    const recognizer = new SpeechRecognition();
    recognizer.lang = 'ru-RU';
    recognizer.contionious = true;
    recognizer.interimResults = true;

    speakButton.onclick = () => {
        log.textContent = 'Хрюндель слушает вас';
        recognizer.start();
    };

    recognizer.onresult = (e) => {
        const index = e.resultIndex;
        const result = e.results[index][0].transcript.trim();

        log.textContent = result;
    };

    recognizer.onend = () => {
        log.textContent = 'Начните говорить';
    };
}

if ('AmbientLightSensor' in window) {
    // eslint-disable-next-line no-undef
    var sensor = new AmbientLightSensor();

    sensor.addEventListener('reading', () => {
        if (sensor.illuminance < ILLUMINANCE_THRESHOLD) {
            hru.sleep();
        }
    });

    sensor.start();
}

if (navigator.getBattery) {
    navigator
        .getBattery()
        .then(battery => {
            hru.eating = battery.charging;
            battery.addEventListener('chargingchange', () => {
                hru.eating = battery.charging;
            });
        });
}

let notify = emptyHandler;
if (('Notification' in window)) {
    Notification.requestPermission(permission => {
        if (permission !== 'granted') {
            return;
        }

        notify = ({ mood, satiety }) => {
            let message = '';

            if (mood < 10) {
                message = 'Запас настроения менее 10%';
            } else if (satiety < 10) {
                message = 'Запас сытости менее 10%';
            }

            if (message) {
                // eslint-disable-next-line no-new
                new Notification('Хрюногочи нужнл уделить внимание', { body: message });
            }
        };
    });
}

hru.onStart = () => console.info('start game with state', hru._state);
hru.onUpdate = draw;
hru.start();
