'use strict';

let HRUNDEL;

const URL = 'http://localhost/';

const MAX_STAT_VALUE = 100;
const CRIT_STAT_VALUE = 10;

const Notification = window.Notification || window.webkitNotification;
const AudioContext = window.AudioContext || window.webkitAudioContext;
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const HRUNDEL_STATE = {
    happy: 'happy',
    common: 'common',
    sad: 'sad',
    dead: 'dead',
    eating: 'eating',
    sleeping: 'sleeping',
    listening: 'listening'
};

const DEFAULT_HRUNDEL_INFO = {
    satiety: MAX_STAT_VALUE,
    energy: MAX_STAT_VALUE,
    mood: MAX_STAT_VALUE,
    state: HRUNDEL_STATE.happy
};

function createListener(callback) {
    let listener;

    if (SpeechRecognition) {
        listener = new SpeechRecognition();
        listener.lang = 'en-US';
        listener.continuous = true;
        listener.interimResults = true;
        listener.onresult = callback;
    }

    return listener;
}

class Hrundel {
    constructor({ satiety, energy, mood, state }) {
        this.satiety = satiety;
        this.energy = energy;
        this.mood = mood;
        this.state = state;
        this.speech = '';
        this.listener = createListener((event) => this.updateSpeech(event));
        this.player = new AudioContext();
        this.source = undefined;
        this._source = this._loadSource('sounds/pig.wav');

        setInterval(() => this.play(), 8000);

        this.updateState();
    }

    isDead() {
        return this.satiety === 0 && this.energy === 0 ||
        this.satiety === 0 && this.mood === 0 ||
        this.energy === 0 && this.mood === 0;
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

        if (this.satiety === CRIT_STAT_VALUE) {
            this.say('Хочу есть =(');
        }

        if (this.energy === CRIT_STAT_VALUE) {
            this.say('Хочу спать =(');
        }

        if (this.mood === CRIT_STAT_VALUE) {
            this.say('Поговори со мной!');
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
            }, 2000);
        } else if (this.state === HRUNDEL_STATE.listening) {
            if (this.mood === MAX_STAT_VALUE - 1) {
                this.state = undefined;
                this.updateState();
            }
        } else {
            this.state = this._getMoodState();
        }
    }

    eat(satiety = 10) {
        if (this.state !== HRUNDEL_STATE.dead && this.satiety !== MAX_STAT_VALUE) {
            this.satiety = this._increase(this.satiety, satiety);
        }
    }

    sleep(energy = 4) {
        if (this.state !== HRUNDEL_STATE.dead && this.energy !== MAX_STAT_VALUE) {
            this.energy = this._increase(this.energy, energy);
        }
    }

    async say(phrase) {
        if (!Notification || Notification.permission === 'denied') {
            return;
        }

        const permission = await Notification.requestPermission();

        if (permission === 'granted') {
            return new Notification(phrase, { body: 'Хрюногочи' });
        }
    }

    listen() {
        if (!SpeechRecognition || this.state === HRUNDEL_STATE.dead) {
            return;
        }

        this.state = HRUNDEL_STATE.listening;
        this.listener.start();
    }

    updateSpeech(speechEvent) {
        if (this.state !== HRUNDEL_STATE.listening) {
            this.listener.stop();

            return;
        }

        this.speech = '';
        this.mood = this._increase(this.mood, 10);

        for (let i = speechEvent.resultIndex; i < event.results.length; i += 1) {
            this.speech += speechEvent.results[i][0].transcript;
        }
    }

    async play() {
        if (this.state === HRUNDEL_STATE.sleeping || this.state === HRUNDEL_STATE.dead) {
            return;
        }

        if (!this.source) {
            this.source = await this._source;
        }

        this.source.start(this.player.currentTime);

        const sourceCopy = this.player.createBufferSource();
        sourceCopy.buffer = this.source.buffer;
        sourceCopy.connect(this.player.destination);

        this.source = sourceCopy;
    }

    _getMoodState() {
        if (this.mood >= 75) {
            return HRUNDEL_STATE.happy;
        }

        if (this.mood >= 50) {
            return HRUNDEL_STATE.common;
        }

        return HRUNDEL_STATE.sad;
    }

    async _loadSource(path) {
        const url = `${URL}${path}`;
        const arrayBuffer = await fetch(url).then(res => res.arrayBuffer());
        const buffer = await this.player.decodeAudioData(arrayBuffer);
        const source = this.player.createBufferSource();

        source.buffer = buffer;
        source.connect(this.player.destination);

        return source;
    }

    _increase(value, delta = 1) {
        return Math.min(value + delta, MAX_STAT_VALUE);
    }

    _decrease(value, delta = 1) {
        return Math.max(value - delta, 0);
    }
}

const render = change => {
    HRUNDEL.update(change);

    document.querySelector('.stat__satiety_value').textContent = `${HRUNDEL.satiety}%`;
    document.querySelector('.stat__energy_value').textContent = `${HRUNDEL.energy}%`;
    document.querySelector('.stat__mood_value').textContent = `${HRUNDEL.mood}%`;
    document.querySelector('.hrundel-face').src = `/images/${HRUNDEL.state}.svg`;
    document.querySelector('.speech').textContent = HRUNDEL.speech;

    const hrundelInfo = {
        satiety: HRUNDEL.satiety,
        energy: HRUNDEL.energy,
        mood: HRUNDEL.mood,
        state: HRUNDEL.state
    };

    document.cookie = `hrundelInfo=${JSON.stringify(hrundelInfo)}`;
};

const feed = () => {
    if (HRUNDEL.state !== HRUNDEL_STATE.eating) {
        HRUNDEL.eat();
        HRUNDEL.state = HRUNDEL_STATE.eating;
        render(false);
    }
};

const restart = () => {
    HRUNDEL = new Hrundel(DEFAULT_HRUNDEL_INFO);
    render(false);
};

window.onload = () => {
    if (document.cookie) {
        const hrundelInfo = JSON.parse(document.cookie.split('=')[1]);
        HRUNDEL = new Hrundel(hrundelInfo);
    } else {
        HRUNDEL = new Hrundel(DEFAULT_HRUNDEL_INFO);
    }

    document.querySelector('.feed').onclick = feed;
    document.querySelector('.restart').onclick = restart;
    document.querySelector('.hrundel').onclick = () => HRUNDEL.listen();

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
