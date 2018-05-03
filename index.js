/* eslint-disable */
import style from './index.css';

import Hrundel from './Hrundel';
import Game from './Game';
import PixelProgressBar from './PixelProgressBar';
import SVGPixelDrawer from './SVGPixelDrawer';

let lowNotification = null;
let dieNotification = null;

const hrundelDrawer = new SVGPixelDrawer(document.querySelector('#hrundel'), 4, 1);
const energyPbDrawer = new SVGPixelDrawer(document.querySelector('#pb-energy'), 4, 1);
const fullnessPbDrawer = new SVGPixelDrawer(document.querySelector('#pb-fullness'), 4, 1);
const moodPbDrawer = new SVGPixelDrawer(document.querySelector('#pb-mood'), 4, 1);

const hrundel = new Hrundel(hrundelDrawer);
const energyPb = new PixelProgressBar(energyPbDrawer, {
    color: 'green',
    width: 40,
    height: 8
});
const fullnessPb = new PixelProgressBar(fullnessPbDrawer, {
    color: 'red',
    width: 40,
    height: 8
});
const moodPb = new PixelProgressBar(moodPbDrawer, {
    color: 'yellow',
    width: 40,
    height: 8
});

const currentGame = tryRestore(hrundel);

currentGame.onEnergy = changePb.bind(null, currentGame, energyPb);
currentGame.onFullness = changePb.bind(null, currentGame, fullnessPb);
currentGame.onMood = changePb.bind(null, currentGame, moodPb);
currentGame.onRestart = () => {
    lowNotification = null;
    dieNotification = null;

    initBatteryApi()
        .then(() => console.info('Battery API Initialized'))
        .catch(() => console.info('Your browser not support battery API!'));
};

document.onvisibilitychange = (e) => {
    if (e.target.visibilityState === 'hidden') {
        currentGame.sleep();
    } else {
        currentGame.awake();
    }
};

const SR =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    window.mozSpeechRecognition ||
    window.msSpeechRecognition;

if (SR) {
    const recognition = new SR();
    recognition.interimResults = true;
    recognition.lang = 'ru-Ru';
    recognition.onresult = (event) => {
        if (event.results[event.resultIndex].isFinal) {
            currentGame.stopFun();
            document.querySelector('#transcript').innerHTML = '';
        } else {
            document.querySelector('#transcript').innerHTML +=
                event.results[event.resultIndex][0].transcript + ' ';
            hrundel.note();
        }
    };
    document.querySelector('#hrundel').onclick = () => {
        recognition.start();
        currentGame.startFun();
    };
}

document.querySelector('#feed-button').onclick = () => {
    currentGame.fastFood();
};

document.querySelector('#restart-button').onclick = () => {
    currentGame.restart();
};

if ('Notification' in window) {
    if (Notification.permission !== 'granted') {
        Notification.requestPermission();
    }
}

if (currentGame.isDie) {
    currentGame.restart();
} else {
    currentGame.start();
}

initBatteryApi()
    .then(() => console.info('Battery API Initialized'))
    .catch(() => console.info('Your browser not support battery API!'));


function tryRestore(person) {
    const energy = parseInt(localStorage.getItem('energy'));
    const fullness = parseInt(localStorage.getItem('fullness'));
    const mood = parseInt(localStorage.getItem('mood'));

    const currentState = {
        energy,
        fullness,
        mood
    };

    const game = new Game(person, currentState);

    if (game.isDie) {
        localStorage.clear();
    } else {
        energyPb.set(game.energy);
        fullnessPb.set(game.fullness);
        moodPb.set(game.mood);
    }

    return game;
}

function save(game) {
    localStorage.setItem('energy', game.energy);
    localStorage.setItem('fullness', game.fullness);
    localStorage.setItem('mood', game.mood);
}

function changePb(game, pb, value) {
    const focus = document.visibilityState !== 'hidden';

    notificateValue(value, focus);
    notificateDead(game, focus);

    pb.set(value);
    save(game);
}

function notificateValue(value, focus) {
    if (value < 10 && Notification.permission === 'granted' && !lowNotification && !focus) {
        lowNotification = new Notification('Хрюндель', {
            body: 'Хрю-хрю, братан, мне плохо без тебя!',
            icon: '/icon.png'
        });
    }
}

function notificateDead(game, focus) {
    if (game.isDie && Notification.permission === 'granted' && !dieNotification && !focus) {
        dieNotification = new Notification('Хрюндель', {
            body: 'Я сдох...',
            icon: '/icon.png'
        });
    }
}

async function initBatteryApi() {
    if (navigator.getBattery) {
        const battery = await navigator.getBattery();

        if (battery.charging) {
            currentGame.startEat();
        }

        battery.addEventListener('chargingchange', () => {
            if (battery.charging) {
                currentGame.startEat();
            } else {
                currentGame.stopEat();
            }
        });
    } else {
        throw new Error('No battery API!');
    }
}
