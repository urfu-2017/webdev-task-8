import Hrunogochi from './hrunogochi';
import { emptyHandler } from './utils';
import drawer from './drawer';

const storageKeys = {
    STATE: 'state',
    VOLUME: 'volume'
};

const ILLUMINANCE_THRESHOLD = 20;
const NOTIFICATION_INTERVAL = 5000;

const satietyValue = document.querySelector('.satiety .state-item__value');
const energyValue = document.querySelector('.energy .state-item__value');
const moodValue = document.querySelector('.mood .state-item__value');
const eatButton = document.querySelector('.controls-item.eat');
const resetButton = document.querySelector('.controls-item.reset');
const volume = document.querySelector('.controls-item.volume');
const heroPicture = document.querySelector('.hero__picture');
const heroSpeech = document.querySelector('.hero__speech');

volume.value = localStorage.getItem(storageKeys.VOLUME) || volume.value;
const hruState = JSON.parse(localStorage.getItem(storageKeys.STATE));
const hru = new Hrunogochi(hruState);

eatButton.onclick = () => {
    hru.eating = true;
};

window.onbeforeunload = () => {
    hru.saveState(state => localStorage.setItem(storageKeys.STATE, JSON.stringify(state)));
    localStorage.setItem(storageKeys.VOLUME, volume.value);
};

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
    const recognizer = new SpeechRecognition();
    recognizer.lang = 'ru-RU';
    recognizer.continious = true;

    recognizer.onstart = () => {
        hru.speaking = true;
        heroSpeech.textContent = 'Внимательно тебя слушаю';
        drawer.startSpeak();
    };

    recognizer.onresult = (e) => {
        const index = e.resultIndex;
        if (e.results[index].isFinal) {
            const result = e.results[index][0].transcript.trim();
            heroSpeech.textContent = result;
            recognizer.stop();
        }
    };

    recognizer.onend = () => {
        hru.speaking = false;
        heroSpeech.textContent = 'Я готов поговорить';
        drawer.stopSpeak();
    };

    heroPicture.onclick = () => {
        recognizer.start();
    };
}

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
    eatButton.remove();
    navigator
        .getBattery()
        .then(battery => {
            hru.eating = battery.charging;
            battery.addEventListener('chargingchange', () => {
                hru.eating = battery.charging;
            });
        });
}

let tryNotify = emptyHandler;
if (('Notification' in window)) {
    Notification.requestPermission(permission => {
        if (permission !== 'granted') {
            return;
        }

        let wasRecentlyNotified = false;
        tryNotify = ({ mood, satiety }) => {
            let message = '';

            if (mood < 10) {
                message = 'Запас настроения менее 10%';
            } else if (satiety < 10) {
                message = 'Запас сытости менее 10%';
            }

            if (message && !wasRecentlyNotified && hru.sleeping) {
                // eslint-disable-next-line no-new
                new Notification('Хрюногочи нужно уделить внимание', { body: message });

                wasRecentlyNotified = true;
                setTimeout(() => {
                    wasRecentlyNotified = false;
                }, NOTIFICATION_INTERVAL);
            }
        };
    });
}

hru.onStart = () => {
    drawer.drawHero();
};

hru.onUpdate = () => {
    satietyValue.textContent = hru.satiety;
    energyValue.textContent = hru.energy;
    moodValue.textContent = hru.mood;
    tryNotify(hru.state);
};

hru.onReset = () => {
    heroSpeech.textContent = 'Я готов поговорить';
    drawer.stopSpeak();
};

hru.onDeath = () => {
    drawer.animateDeath();
};

hru.start();
