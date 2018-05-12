import { emptyHandler, bounded } from './utils';

export default class Hrunogochi {
    constructor(state) {
        this._init(state);
        this._onStart = emptyHandler;
        this._onUpdate = emptyHandler;
        this._onSpeak = emptyHandler;
    }

    _init(state = this._getInitialState()) {
        this._state = state;
        this._eating = false;
        this._sleeping = false;
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
        const tick = () => {
            if (this.isDead) {
                return this.stop();
            }

            if (Math.random() > 0.75) {
                this.speak('Хрю-хрю');
            }

            let { satiety, energy, mood } = this;

            if (this.eating) {
                satiety += 3;
            }

            if (this.sleeping) {
                energy += 3;
            }

            satiety--;
            energy--;
            mood--;

            this._updateState({
                satiety,
                energy,
                mood
            });

            this._tickId = setTimeout(tick, 1000);
        };

        tick();

        this.onStart();
    }

    stop() {
        clearTimeout(this._tickId);
    }

    reset() {
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

    get onSpeak() {
        return this._onSpeak;
    }

    set onSpeak(handler) {
        this._onSpeak = handler;
    }
}
