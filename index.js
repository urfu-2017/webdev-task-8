const Hrundel = require('./scripts/models/hrundel');
const Recognition = require('./scripts/models/recognition');
const Notifier = require('./scripts/models/notification');
const { enableBatteryActivityListeners } = require('./scripts/helpers/battery');
const { activeTabCheck } = require('./scripts/helpers/active-tab-check');
const { lightnessCheck } = require('./scripts/helpers/lightness-check');

const hrundelElement = document.getElementById('hrundel');
const moodContainer = document.querySelector('.stats__mood .stats__value');
const energyContainer = document.querySelector('.stats__energy .stats__value');
const satietyContainer = document.querySelector('.stats__satiety .stats__value');
const restartButton = document.querySelector('.restart');
const feedButton = document.querySelector('.feed');
const replyBox = document.querySelector('.reply');
const hruSound = document.querySelector('.sound-hru');
const soundControl = document.querySelector('.volume');

let hrundel = new Hrundel(Snap('#hrundel'));

moodContainer.innerHTML = hrundel.state.mood;
satietyContainer.innerHTML = hrundel.state.satiety;
energyContainer.innerHTML = hrundel.state.energy;

let interval = setInterval(() => {
    if (hrundel.isDead()) {
        clearInterval(interval);
    }

    hruSound.play();
}, 5000);

setListeners();
start();

function start() {
    if (!enableBatteryActivityListeners(hrundel)) {
        feedButton.style.display = 'inline-block';

        feedButton.addEventListener('click', function () {
            hrundel.eat();
            hrundel.feedUp();
        });
    }

    activeTabCheck(hrundel);
    lightnessCheck(hrundel);

    hrundel.greet();

    hrundel.initLifecycle({
        onUpdate,
        onFed,
        onEnjoyed,
        onOverslept,
        onHungry,
        onUpset
    });
}

const notifier = new Notifier();

if (notifier.isAvaliable) {
    notifier.requestPermission();
}

const recognition = new Recognition();

if (recognition.isAvaliable) {
    hrundelElement.addEventListener('click', () => {
        if (hrundel.isDead()) {
            return;
        }

        if (hrundel.isEnjoying) {
            hrundel.stopListening();
            recognition.stop();

            replyBox.innerHTML = '';

            return;
        }

        hrundel.listen();
        recognition.start();
    });

    recognition.recognizer.onresult = event => {
        let last = event.results.length - 1;

        replyBox.innerHTML = event.results[last][0].transcript;
        hrundel.moodUp();
    };
}

function onEnjoyed() {
    hrundel.enjoy();

    if (recognition.isAvaliable) {
        recognition.stop();
    }

    replyBox.innerHTML = '';
}

function onOverslept() {
    if (document.hasFocus()) {
        hrundel.awake();
    }
}

function onFed() {
    hrundel.enjoy();
}

function onUpset() {
    if (!notifier.isAvaliable) {
        return;
    }

    notifier.notify('Мне скучно...');
}

function onHungry() {
    if (!notifier.isAvaliable) {
        return;
    }

    notifier.notify('Хочу есть...');
}

function onUpdate(state) {
    const { mood, satiety, energy } = state;

    moodContainer.innerHTML = String(mood);
    energyContainer.innerHTML = String(energy);
    satietyContainer.innerHTML = String(satiety);
}

function setListeners() {
    restartButton.addEventListener('click', () => {
        hrundel.clear();
        hrundel = new Hrundel(Snap('#hrundel'));

        start();
    });

    hruSound.volume = 0.5;

    soundControl.addEventListener('change', () => {
        hruSound.volume = Number(soundControl.value) / 100;
    });
}
