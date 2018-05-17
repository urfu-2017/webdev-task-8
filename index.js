const Hrundel = require('./scripts/models/hrundel');
const { enableBatteryActivityListeners } = require('./scripts/helpers/battery');
const { activeTabCheck } = require('./scripts/helpers/active-tab-check');
const { lightnessCheck } = require('./scripts/helpers/lightness-check');

const moodContainer = document.querySelector('.stats__mood .stats__value');
const energyContainer = document.querySelector('.stats__energy .stats__value');
const satietyContainer = document.querySelector('.stats__satiety .stats__value');
const restartButton = document.querySelector('.restart');
const feedButton = document.querySelector('.feed');

let hrundel = new Hrundel(Snap('#hrundel'));

moodContainer.innerHTML = hrundel.state.mood;
satietyContainer.innerHTML = hrundel.state.satiety;
energyContainer.innerHTML = hrundel.state.energy;

restartButton.addEventListener('click', () => {
    hrundel.clear();
    hrundel = new Hrundel(Snap('#hrundel'));

    start();
});

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

    hrundel.initLifecycle(onStateChange, onFed, () => {}, onOverslept);
}

function onStateChange(state) {
    const { mood, satiety, energy } = state;

    moodContainer.innerHTML = String(mood);
    energyContainer.innerHTML = String(energy);
    satietyContainer.innerHTML = String(satiety);
}

function onOverslept() {
    if (document.hasFocus()) {
        hrundel.awake();
    }
}

function onFed() {
    hrundel.enjoy();
}
