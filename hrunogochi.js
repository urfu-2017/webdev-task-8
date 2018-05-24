'use srtict';

// eslint-disable-next-line no-empty-function
const bounded = (value) => Math.max(0, Math.min(100, value));
const tickInterval = 1750;

const phrases = [
    'хрю-хрю-хрю',
    'давай играть',
    'ох-ох'
];

export default class Hrunogochi {
    constructor(state) {
        this.init(state);
    }

    init(state) {
        this.state = state || this.getState();
        this.eating = false;
        this.sleeping = false;
        this.speaking = false;
    }

    getState() {
        return {
            'bellyful': 100,
            'energy': 100,
            'mood': 100
        };
    }

    isDead() {
        const { bellyful, energy, mood } = this;

        return [bellyful, energy, mood].filter(value => value === 0).length > 1;
    }

    get energy() {
        return this.state.energy;
    }

    set energy(value) {
        this.state.energy = bounded(value);
    }

    get bellyful() {
        return this.state.bellyful;
    }

    set bellyful(value) {
        this.state.bellyful = bounded(value);
    }

    get mood() {
        return this.state.mood;
    }

    set mood(value) {
        this.state.mood = bounded(value);
    }

    setState({ bellyful, energy, mood }) {
        this.bellyful = bellyful;
        this.energy = energy;
        this.mood = mood;

        this.onUpdate();
    }

    updateState(newState) {
        const mergedState = Object.assign({}, this.state, newState);
        this.setState(mergedState);
    }

    saveState(saveAction) {
        saveAction(this.state);
    }

    start() {
        // eslint-disable-next-line max-statements
        const tick = () => {
            if (this.isDead()) {
                this.onDeath();

                return this.stop();
            }

            if (Math.random() > 0.8) {
                const text = phrases[Math.floor(Math.random() * phrases.length)];
                this.onSpeak(text);
            }

            let { bellyful, energy, mood } = this;

            if (this.speaking) {
                mood += 4;
            } else if (this.sleeping) {
                energy += 4;
            } else if (this.eating) {
                bellyful += 4;
            }

            bellyful--;
            energy--;
            mood--;

            this.updateState({
                bellyful,
                energy,
                mood
            });

            this.tickId = setTimeout(tick, tickInterval);
        };

        tick();
        this.onStart();
    }

    stop() {
        clearTimeout(this.tickId);
    }

    reset() {
        this.onReset();
        this.stop();
        this.setState(this.getState());
        this.start();
    }

}
