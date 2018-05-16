const Hrundel = require('./scripts/models/hrundel');

const moodContainer = document.querySelector('.stats__mood .stats__value');
const energyContainer = document.querySelector('.stats__energy .stats__value');
const satietyContainer = document.querySelector('.stats__satiety .stats__value');

const hrundel = new Hrundel(Snap('#hrundel'));

function start() {
    hrundel.initLifecycle(onStateChange, () => {}, () => {}, () => {});
}

function onStateChange(state) {
    const { mood, satiety, energy } = state;

    moodContainer.innerHTML = String(mood);
    energyContainer.innerHTML = String(energy);
    satietyContainer.innerHTML = String(satiety);
}

function onFed() {
    hrundel.enjoy();
}

start();


