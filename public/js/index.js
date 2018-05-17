'use strict';

let HRUNDEL;

const HRUNDEL_STATE = {
    happy: 'happy',
    common: 'common',
    sad: 'sad',
    dead: 'dead',
    eating: 'eating',
    sleeping: 'sleeping'
};

const HRUNDEL_STATE_ICON = {
    happy: 'https://s4.aconvert.com/convert/p3r68-cdx67/cb4lu-e8b8y.svg',
    common: 'https://s4.aconvert.com/convert/p3r68-cdx67/cbggr-zec5y.svg',
    sad: 'https://s4.aconvert.com/convert/p3r68-cdx67/cb4s3-2oh6a.svg',
    dead: 'https://s4.aconvert.com/convert/p3r68-cdx67/cb61n-wtnnj.svg',
    eating: 'https://s4.aconvert.com/convert/p3r68-cdx67/cbmw6-rorvq.svg',
    sleeping: 'https://s4.aconvert.com/convert/p3r68-cdx67/cburn-kmre8.svg'
};

const DEFAULT_HRUNDEL_INFO = {
    satiety: 100,
    energy: 100,
    mood: 100,
    state: HRUNDEL_STATE.happy
};

class Hrundel {
    constructor({ satiety, energy, mood, state }) {
        this.satiety = satiety;
        this.energy = energy;
        this.mood = mood;
        this.state = state;
        this.updateState();
    }

    update(change) {
        if (this.state === HRUNDEL_STATE.dead) {
            return;
        }

        if (change) {
            this.satiety = this._decrease(this.satiety);
            this.energy = this._decrease(this.energy);
            this.mood = this._decrease(this.mood);
        }

        this.updateState();
    }

    updateState() {
        if (this.isDead()) {
            this.satiety = 0;
            this.energy = 0;
            this.mood = 0;
            this.state = HRUNDEL_STATE.dead;
        } else if (this.state === HRUNDEL_STATE.sleeping) {
            this.sleep();
        } else if (this.state === HRUNDEL_STATE.eating) {
            setTimeout(() => {
                this.state = undefined;
            }, 2);
            this.eat();
        } else if (this.mood >= 75) {
            this.state = HRUNDEL_STATE.happy;
        } else if (this.mood >= 50) {
            this.state = HRUNDEL_STATE.common;
        } else {
            this.state = HRUNDEL_STATE.sad;
        }
    }

    eat(satiety = 10) {
        this.satiety = this._increase(this.satiety, satiety);
    }

    sleep(energy = 4) {
        if (this.state === HRUNDEL_STATE.dead) {
            return;
        }

        this.energy = this._increase(this.energy, energy);
    }

    isDead() {
        return this.satiety === 0 && this.energy === 0 ||
        this.satiety === 0 && this.mood === 0 ||
        this.energy === 0 && this.mood === 0;
    }

    _increase(value, delta = 1) {
        return value + delta > 100 ? 100 : value + delta;
    }

    _decrease(value, delta = 1) {
        return value - delta < 0 ? 0 : value - delta;
    }
}

const render = change => {
    HRUNDEL.update(change);

    document.querySelector('.stat__satiety_value').textContent = `${HRUNDEL.satiety}%`;
    document.querySelector('.stat__energy_value').textContent = `${HRUNDEL.energy}%`;
    document.querySelector('.stat__mood_value').textContent = `${HRUNDEL.mood}%`;
    document.querySelector('.hrundel-face').src = HRUNDEL_STATE_ICON[HRUNDEL.state];

    const hrundelInfo = {
        satiety: HRUNDEL.satiety,
        energy: HRUNDEL.energy,
        mood: HRUNDEL.mood,
        state: HRUNDEL.state
    };

    document.cookie = `hrundelInfo=${JSON.stringify(hrundelInfo)}`;
};

const feed = () => {
    HRUNDEL.state = HRUNDEL_STATE.eating;
    render(false);
};

const restart = () => {
    HRUNDEL = new Hrundel(DEFAULT_HRUNDEL_INFO);
    render(false);
};

window.onload = () => {
    document.querySelector('.feed').onclick = feed;
    document.querySelector('.restart').onclick = restart;

    if (document.cookie) {
        const hrundelInfo = JSON.parse(document.cookie.split('=')[1]);
        HRUNDEL = new Hrundel(hrundelInfo);
    } else {
        HRUNDEL = new Hrundel(DEFAULT_HRUNDEL_INFO);
    }

    render(false);

    if (HRUNDEL.state === HRUNDEL_STATE.sleeping) {
        HRUNDEL.state = undefined;
    }

    setInterval(() => render(true), 1500);
};

window.onblur = () => {
    HRUNDEL.state = HRUNDEL_STATE.sleeping;
};

window.onfocus = () => {
    HRUNDEL.state = undefined;
};
