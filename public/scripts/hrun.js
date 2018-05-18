class Hrun {
    constructor({ satiety, energy, mood, state } = {
        satiety: Hrun.LIMITS.satiety,
        energy: Hrun.LIMITS.energy,
        mood: Hrun.LIMITS.mood,
        state: Hrun.STATES.resting
    }) {
        this.satiety = satiety;
        this.energy = energy;
        this.mood = mood;
        this._state = state;

        this.active = true;

        this.intervalId = setInterval(() => this.carpeDiem(), Hrun.CYCLE_INTERVAL);
    }

    static get _savedProps() {
        return JSON.parse(localStorage.getItem(Hrun.STORAGE_KEY));
    }

    static set _savedProps(props) {
        localStorage.setItem(Hrun.STORAGE_KEY, JSON.stringify(props));
    }

    static tryLoad() {
        return /* Hrun._savedProps ? new Hrun(Hrun._savedProps) : */ new Hrun();
    }

    save() {
        Hrun._savedProps = {
            satiety: this.satiety,
            energy: this.energy,
            mood: this.mood,
            state: this._state
        };
    }

    increase(prop, delta = 1) {
        this[prop] = delta > 0
            ? Math.min(this[prop] + delta, Hrun.LIMITS[prop])
            : Math.max(this[prop] + delta, 0);
    }

    get died() {
        return [this.satiety, this.energy, this.mood]
            .filter(prop => prop > 0).length < 2;
    }

    /* eslint-disable no-unused-expressions, complexity */
    carpeDiem() {
        const increment = 2;

        this.increase(
            Hrun.PROPS.satiety,
            this._state === Hrun.STATES.eating ? increment : -1
        );

        this.increase(
            Hrun.PROPS.mood,
            this._state === Hrun.STATES.communicating ? increment : -1
        );

        this.increase(
            Hrun.PROPS.energy,
            this._state === Hrun.STATES.sleeping ? increment : -1
        );

        if (this.died) {
            clearInterval(this.intervalId);
            this.active = false;
        }
    }

    /* eslint-enable no-unused-expressions */

    start(state) {
        if (!this.died) {
            this._state = state;
        }
    }

    stop(state) {
        if (this._state === state) {
            this._state = Hrun.STATES.resting;
        }
    }

    calm() {
        this.start(Hrun.STATES.resting);
    }

    startEating() {
        this.start(Hrun.STATES.eating);
    }

    stopEating() {
        this.stop(Hrun.STATES.eating);
    }

    startSleeping() {
        this.start(Hrun.STATES.sleeping);
        this.active = false;
    }

    get sleeping() {
        return this._state === Hrun.STATES.sleeping;
    }

    stopSleeping() {
        this.stop(Hrun.STATES.sleeping);
        this.active = true;
    }

    startCommunicating() {
        this.start(Hrun.STATES.communicating);
    }

    stopCommunicating() {
        this.stop(Hrun.STATES.communicating);
    }
}

Hrun.PROPS = {
    satiety: 'satiety',
    energy: 'energy',
    mood: 'mood'
};

Hrun.LIMITS = {
    satiety: 100,
    energy: 100,
    mood: 100
};

Hrun.STATES = {
    resting: 'resting',
    eating: 'resting-and-eating',
    communicating: 'resting-and-communicating',
    sleeping: 'hard-resting'
};

Hrun.CYCLE_INTERVAL = 100;

Hrun.STORAGE_KEY = 'hrun-props';
