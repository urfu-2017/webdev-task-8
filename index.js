const Hrundel = require('./scripts/models/hrundel');

const moodContainer = document.querySelector('.stats__mood .stats__value');
const energyContainer = document.querySelector('.stats__energy .stats__value');
const satietyContainer = document.querySelector('.stats__satiety .stats__value');
const restartButton = document.querySelector('.restart');

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
    hrundel.greet();

    hrundel.initLifecycle(onStateChange, () => {}, () => {}, onOverslept);
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

function onOverslept() {
    if (document.hasFocus()) {
        hrundel.awake();
    }
}

window.onfocus = () => {
    hrundel.awake();
};

window.onblur = () => {
    hrundel.sleep();
};

