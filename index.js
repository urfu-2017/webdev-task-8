'use srtict';

import Hrunogochi from './hrunogochi';
import drawer from './drawer';

const illuminance = 20;
const notificationInterval = 4000;

const bellyfulValue = document.querySelector('.bellyful .state__item__value');
const energyValue = document.querySelector('.energy .state__item__value');
const moodValue = document.querySelector('.mood .state__item__value');
const feedButton = document.querySelector('.controls__item.feed');
const volume = document.querySelector('.controls__item.volume');
const heroSpeech = document.querySelector('.hero__speech');

volume.value = localStorage.getItem('volume') || volume.value;
const hruState = JSON.parse(localStorage.getItem('state'));
const hru = new Hrunogochi(hruState);

feedButton.addEventListener('click', () => {
    hru.eating = true;
});

window.addEventListener('beforeunload', () => {
    hru.saveState(state => localStorage.setItem('state', JSON.stringify(state)));
    localStorage.setItem('volume', volume.value);
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
    const recognizer = new SpeechRecognition();
    recognizer.lang = 'ru-RU';
    recognizer.continious = true;

    recognizer.addEventListener('start', () => {
        hru.speaking = true;
        heroSpeech.textContent = 'Слушаю тебя!';
        drawer.startSpeak();
    });

    recognizer.addEventListener('result', (e) => {
        const index = e.resultIndex;
        if (e.results[index].isFinal) {
            const result = e.results[index][0].transcript.trim();
            heroSpeech.textContent = result;
            recognizer.stop();
        }
    });

    recognizer.addEventListener('end', () => {
        hru.speaking = false;
        drawer.stopSpeak();
    });

    document.querySelector('.hero__picture')
        .addEventListener('click', () => recognizer.start());
}

window.addEventListener('blur', () => {
    hru.sleeping = true;
});

window.addEventListener('focus', () => {
    hru.sleeping = false;
});

document.querySelector('.controls__item.reset')
    .addEventListener('click', () => hru.reset());

if (window.speechSynthesis) {
    hru.onSpeak = (text) => {
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
        if (sensor.illuminance < illuminance) {
            hru.sleep();
        }
    });

    sensor.start();
}

if (navigator.getBattery) {
    feedButton.remove();
    navigator
        .getBattery()
        .then(battery => {
            hru.eating = battery.charging;
            battery.addEventListener('chargingchange', () => {
                hru.eating = battery.charging;
            });
        });
}

// eslint-disable-next-line no-empty-function
let sendNotify = () => {};
if (('Notification' in window)) {
    Notification.requestPermission(permission => {
        if (permission !== 'granted') {
            return;
        }

        let wasRecentlyNotified = false;
        sendNotify = ({ mood, bellyful }) => {
            let message = '';

            if (mood < 10) {
                message = 'Эй, я скучаю!';
            } else if (bellyful < 10) {
                message = 'Я хочу кушать!';
            }

            if (message && !wasRecentlyNotified && hru.sleeping) {
                // eslint-disable-next-line no-new
                new Notification('Хрюногочи', { body: message });

                wasRecentlyNotified = true;
                setTimeout(() => {
                    wasRecentlyNotified = false;
                }, notificationInterval);
            }
        };
    });
}

hru.onStart = () => {
    drawer.drawHero();
};

hru.onUpdate = () => {
    bellyfulValue.textContent = hru.bellyful;
    energyValue.textContent = hru.energy;
    moodValue.textContent = hru.mood;
    sendNotify(hru.state);
};

hru.onReset = () => {
    heroSpeech.textContent = 'Готов поговорить с тобой!';
    drawer.stopSpeak();
};

hru.onDeath = () => {
    drawer.animateDeath();
};

hru.start();
