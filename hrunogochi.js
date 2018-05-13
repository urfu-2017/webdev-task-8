import { emptyHandler, bounded } from './utils';

const TICK_INTERVAL = 1500;

const phrases = [
    'Хрю-хрю',
    'Поиграй со мной',
    'Эх...'
];

export default class Hrunogochi {
    constructor(state) {
        this._init(state);
        this._onStart = emptyHandler;
        this._onReset = emptyHandler;
        this._onUpdate = emptyHandler;
        this._onSpeak = emptyHandler;
        this._onDeath = emptyHandler;
    }

    _init(state) {
        this._state = state || this._getInitialState();
        this._eating = false;
        this._sleeping = false;
        this._speaking = false;
    }

    get isDead() {
        const { satiety, energy, mood } = this;

        return [satiety, energy, mood].filter(value => value === 0).length > 1;
    }

    get eating() {
        return this._eating;
    }

    set eating(value) {
        this._eating = value;
    }

    get sleeping() {
        return this._sleeping;
    }

    set sleeping(value) {
        this._sleeping = value;
    }

    get speaking() {
        return this._speaking;
    }

    set speaking(value) {
        this._speaking = value;
    }

    get energy() {
        return this._state.energy;
    }

    set energy(value) {
        this._state.energy = bounded(value);
    }

    get satiety() {
        return this._state.satiety;
    }

    set satiety(value) {
        this._state.satiety = bounded(value);
    }

    get mood() {
        return this._state.mood;
    }

    set mood(value) {
        this._state.mood = bounded(value);
    }

    get state() {
        return this._state;
    }

    _getInitialState() {
        return {
            satiety: 100,
            energy: 90,
            mood: 75
        };
    }

    _setState({ satiety, energy, mood }) {
        this.satiety = satiety;
        this.energy = energy;
        this.mood = mood;

        this.onUpdate();
    }

    _updateState(newState) {
        const mergedState = Object.assign({}, this._state, newState);
        this._setState(mergedState);
    }

    speak(text) {
        this.onSpeak({ text });
    }

    saveState(saveAction) {
        saveAction(this._state);
    }

    start() {
        // eslint-disable-next-line max-statements
        const tick = () => {
            if (this.isDead) {
                this.onDeath();

                return this.stop();
            }

            if (Math.random() > 0.75) {
                const chosenPhrase = phrases[Math.floor(Math.random() * phrases.length)];
                this.speak(chosenPhrase);
            }

            let { satiety, energy, mood } = this;

            if (this.speaking) {
                mood += 3;
            } else if (this.sleeping) {
                energy += 3;
            } else if (this.eating) {
                satiety += 3;
            }

            satiety--;
            energy--;
            mood--;

            this._updateState({
                satiety,
                energy,
                mood
            });

            this._tickId = setTimeout(tick, TICK_INTERVAL);
        };

        tick();
        this.onStart();
    }

    stop() {
        clearTimeout(this._tickId);
    }

    reset() {
        this.onReset();
        this.stop();
        this._setState(this._getInitialState());
        this.start();
    }

    get onStart() {
        return this._onStart;
    }

    set onStart(handler) {
        this._onStart = handler;
    }

    get onUpdate() {
        return this._onUpdate;
    }

    set onUpdate(handler) {
        this._onUpdate = handler;
    }

    get onReset() {
        return this._onReset;
    }

    set onReset(handler) {
        this._onReset = handler;
    }

    get onSpeak() {
        return this._onSpeak;
    }

    set onSpeak(handler) {
        this._onSpeak = handler;
    }

    get onDeath() {
        return this._onDeath;
    }

    set onDeath(handler) {
        this._onDeath = handler;
    }
}
