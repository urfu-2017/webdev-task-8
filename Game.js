export default class Game {
    get energy() {
        return this._energy;
    }

    get fullness() {
        return this._fullness;
    }

    get mood() {
        return this._mood;
    }

    get isDie() {
        return [
            this._energy <= 0,
            this._fullness <= 0,
            this._mood <= 0
        ].filter(x => x).length >= 2;
    }

    get isSleep() {
        return this._sleep;
    }

    constructor(person, initStates = {}) {
        this._person = person;

        this._energy = initStates.energy !== undefined ? initStates.energy : 100;
        this._fullness = initStates.fullness !== undefined ? initStates.fullness : 100;
        this._mood = initStates.mood !== undefined ? initStates.mood : 100;
        this._sleep = initStates.sleep !== undefined ? initStates.sleep : false;

        this._eatInterval = null;
        this._sleepInterval = null;

        this.onDie = null;
        this.onEnergy = null;
        this.onFullness = null;
        this.onMood = null;
        this.onRestart = null;
    }

    start() {
        if (this.isDie) {
            return;
        }

        this._energyInterval = setInterval(this._onChange.bind(this, 'energy'), 1000);
        this._fullnessInterval = setInterval(this._onChange.bind(this, 'fullness'), 1000);
        this._moodInterval = setInterval(this._onChange.bind(this, 'mood'), 1000);
    }

    stop() {
        clearInterval(this._sleepInterval);
        clearInterval(this._eatInterval);
        clearInterval(this._fullnessInterval);
        clearInterval(this._moodInterval);
        clearInterval(this._energyInterval);
    }

    restart() {
        this.stop();

        this._energy = 100;
        this._fullness = 100;
        this._mood = 100;
        this._sleep = false;

        if (this.onEnergy) {
            this.onEnergy(100);
        }

        if (this.onFullness) {
            this.onFullness(100);
        }

        if (this.onMood) {
            this.onMood(100);
        }

        this.start();

        if (this.onRestart) {
            this.onRestart();
        }
    }

    sleep() {
        this._person.sleep();
        if (this.isDie) {
            return;
        }

        clearInterval(this._energyInterval);

        this._sleep = true;
        this._sleepInterval = setInterval(this._getInterval('energy'), 1000);
    }

    awake() {
        this._person.awake();
        if (this.isDie) {
            return;
        }

        this._sleep = false;

        clearInterval(this._sleepInterval);
        this._fullnessInterval = setInterval(this._onChange.bind(this, 'energy'), 1000);
    }

    startFun() {
        if (this.isDie) {
            return;
        }

        clearInterval((this._moodInterval));
        this._funInterval = setInterval(this._getInterval('mood'), 1000);
    }

    stopFun() {
        if (this.isDie) {
            return;
        }

        clearInterval((this._funInterval));
        this._moodInterval = setInterval(this._onChange.bind(this, 'mood'), 1000);
    }

    startEat() {
        if (this.isDie) {
            return;
        }

        clearInterval(this._fullnessInterval);

        this._eatInterval = setInterval(this._getInterval('fullness'), 1000);
    }

    stopEat() {
        if (this.isDie) {
            return;
        }

        clearInterval(this._eatInterval);
        this._fullnessInterval = setInterval(this._onChange.bind(this, 'fullness'), 1000);
    }

    fastFood() {
        if (this.isDie) {
            return;
        }

        this._fullness = 100;

        if (this.onFullness) {
            this.onFullness(this._fullness);
        }
    }

    _onChange(param) {
        const paramName = `_${param}`;
        const eventName = `on${param.charAt(0).toUpperCase() + param.slice(1)}`;

        this[paramName]--;
        this[eventName](this[paramName]);

        if (this[paramName] <= 0) {
            clearInterval(this[`_${param}Interval`]);

            if (this.isDie) {
                this.stop();
                this._person.die();
            }

            if (this.isDie && this.onDie) {
                this.onDie();
            }
        }
    }

    _getInterval(param) {
        const paramName = `_${param}`;
        const eventName = `on${param.charAt(0).toUpperCase() + param.slice(1)}`;

        return () => {
            if (this[paramName] + 3 <= 100) {
                this[paramName] += 3;
            } else {
                this[paramName] = 100;
            }

            if (this[eventName]) {
                this[eventName](this[paramName]);
            }
        };
    }

}
