import { STATE } from './state';

const initialState = {
    satiety: 100,
    energy: 100,
    mood: 100,
    state: STATE.IDLE
};

export class Hrunogochi {
    constructor({ satiety, energy, mood, state } = initialState) {
        this.satiety = satiety;
        this.energy = energy;
        this.mood = mood;
        this.state = state;
    }

    get params() {
        return {
            satiety: this.satiety,
            energy: this.energy,
            mood: this.mood,
            state: this.state
        };
    }

    get isDead() {
        return this.energy + this.satiety === 0 ||
            this.energy + this.mood === 0 || this.satiety + this.mood === 0;
    }

    update() {
        if (this.isDead) {
            this.state = STATE.DEAD;
            return;
        }

        this._calculateNewState();
        this._normalizeParams();
        this.setIdle();
    }

    setEnergy() {
        if (this.energy < 100) {
            this.state = STATE.SLEEP;
        }
    }

    setMood() {
        if (this.mood < 100) {
            this.state = STATE.MOOD;
        }
    }

    setSatiety() {
        if (this.satiety < 100) {
            this.state = STATE.SATIETY;
        }
    }

    setIdle() {
        this.state = STATE.IDLE;
    }

    reset() {
        Object.assign(this, initialState);
    }

    _calculateNewState() {
        this.energy--;
        this.satiety--;
        this.mood--;

        // eslint-disable-next-line default-case
        switch (this.state) {
            case STATE.SLEEP: {
                this.energy += 4;
                break;
            }

            case STATE.SATIETY: {
                this.satiety += 4;
                break;
            }

            case STATE.MOOD: {
                this.mood += 4;
                break;
            }
        }
    }

    _normalizeParams() {
        ['satiety', 'energy', 'mood'].forEach(key => {
            this[key] = Math.max(0, this[key]);
            this[key] = Math.min(100, this[key]);
        });
    }
}
