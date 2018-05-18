let DOM;

// Drawing

const HRUN_COLORS = {
    body: '#ffe793',
    eye: '#fefffe',
    dark: '#333333',
    nose: '#edafB8'
};

class HrunDrawer {
    constructor() {
        this.snap = Snap('.hrun-shape'); // eslint-disable-line

        const positions = {
            leftEye: { x: 75, y: 95 },
            rightEye: { x: 155, y: 95 },
            nose: { x: 115, y: 165 }
        };

        const body = this.snap
            .circle(125, 125, 125)
            .attr({ fill: HRUN_COLORS.body })
            .addClass('hrun-shape__body');

        const leftEye = {
            wrapper: this.snap
                .ellipse(positions.leftEye.x, positions.leftEye.y, 30, 30)
                .attr({ fill: HRUN_COLORS.eye }),
            eyeball: this.snap
                .ellipse(positions.leftEye.x + 7, positions.leftEye.y + 5, 15, 15)
                .attr({ fill: HRUN_COLORS.dark })
        };

        const rightEye = {
            wrapper: this.snap
                .ellipse(positions.rightEye.x, positions.rightEye.y, 30, 30)
                .attr({ fill: HRUN_COLORS.eye }),
            eyeball: this.snap
                .ellipse(positions.rightEye.x + 4, positions.rightEye.y + 5, 15, 15)
                .attr({ fill: HRUN_COLORS.dark })
        };

        const nose = {
            wrapper: this.snap
                .circle(positions.nose.x, positions.nose.y, 35)
                .attr({ fill: '#ff8d8e' }),
            nostrils: [
                this.snap
                    .circle(positions.nose.x - 10, positions.nose.y, 7)
                    .attr({ fill: HRUN_COLORS.dark }),
                this.snap
                    .circle(positions.nose.x + 10, positions.nose.y, 7)
                    .attr({ fill: HRUN_COLORS.dark })
            ]
        };

        this.hrun = {
            body,
            leftEye, rightEye,
            nose: this.snap.group(nose.wrapper, ...nose.nostrils)
        };
    }

    // eslint-disable-next-line
    animate(element, startAttrs, endAttrs, time = 1500, count = Infinity) {
        if (count === 0) {
            return;
        }
    
        element.animate(startAttrs, time / 2, () => {
            element.animate(endAttrs, time / 2, () => {
                this.animate(element, startAttrs, endAttrs, time, --count);
            });
        });
    }

    stopAnimation(element) {
        element.stop();
        element.animate({ transform: 't0,0 r0 s1' }, 100);
    }

    startEating() {
        this.animate(
            this.hrun.nose,
            { transform: 't0,3' }, { transform: 't0,0' }
        );
    }

    stopEating() {
        this.stopAnimation(this.hrun.nose);
    }
}

// Behaviour

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
        return Hrun._savedProps ? new Hrun(Hrun._savedProps) : new Hrun();
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
        this[prop] = Math.min(this[prop] + delta, Hrun.LIMITS[prop]);
    }

    decrease(prop, delta = 1) {
        this.increase(prop, -delta);
    }

    died() {
        return [this.satiety, this.energy, this.mood]
            .filter(prop => prop > 0).length < 2;
    }

    /* eslint-disable no-unused-expressions, complexity */
    carpeDiem() {
        const delta = 2;

        this._state === Hrun.STATES.eating
            ? this.increase(Hrun.PROPS.satiety, delta)
            : this.decrease(Hrun.PROPS.satiety);

        this._state === Hrun.STATES.communicating
            ? this.increase(Hrun.PROPS.mood, delta)
            : this.decrease(Hrun.PROPS.mood);

        this._state === Hrun.STATES.sleeping
            ? this.increase(Hrun.PROPS.energy, delta)
            : this.decrease(Hrun.PROPS.energy);

        if (!this.active) {
            if (this.satiety < Hrun.LIMITS.satiety * 0.1) {
                // createNotification('Я голодный :(');
            }
            if (this.mood < Hrun.LIMITS.mood * 0.1) {
                // createNotification('Мне грустно :с');
            }
        }

        if (this.died()) {
            clearInterval(this.intervalId);
        }
    }

    /* eslint-enable no-unused-expressions */

    startEating() {
        this._state = Hrun.STATES.eating;
    }

    stopEating() {
        if (this._state === Hrun.STATES.eating) {
            this._state = Hrun.STATES.resting;
        }
    }
}

Hrun.PROPS = {
    satiety: 'satiety',
    energy: 'energy',
    mood: 'mood'
}

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

Hrun.CYCLE_INTERVAL = 2500;

Hrun.STORAGE_KEY = 'hrun-props';

// Game

class Game {
    constructor() {
        this.hrun = Hrun.tryLoad();
        this.drawer = new HrunDrawer();

        this.updateProps();
        setInterval(() => this.updateProps(), Hrun.CYCLE_INTERVAL);

        this.trackBattery();
    }

    updateProps() {
        DOM.info.satiety.innerHTML = this.hrun.satiety;
        DOM.info.energy.innerHTML = this.hrun.energy;
        DOM.info.mood.innerHTML = this.hrun.mood;
    }

    enableFeedButton() {
        DOM.buttons.feed.style.display = 'block';
    }

    async trackBattery() {
        if (!navigator.getBattery) {
            this.enableFeedButton();

            return;
        }

        const battery = await navigator.getBattery();

        const checkBattery = () => {
            if (battery.charging) {
                // stopListening();
                this.hrun.startEating();
                this.drawer.startEating();
            } else {
                this.hrun.stopEating();
                this.drawer.stopEating();
            }
        };

        checkBattery();
        battery.addEventListener('chargingchange', checkBattery);
    }

    run() {
        return;
    }

    save() {
        this.hrun.save();
    }

    reset() {
        this.hrun = new Hrun();
        this.drawer = new HrunDrawer();

        this.updateProps();
        setInterval(() => this.updateProps(), Hrun.CYCLE_INTERVAL);

        this.trackBattery();
    }
}

function main() {
    DOM = {
        info: {
            satiety: document.querySelector('.satiety-value'),
            energy: document.querySelector('.energy-value'),
            mood: document.querySelector('.mood-value')
        },
        hrun: document.querySelector('.hrun-shape'),
        recognizedText: document.querySelector('.recognized-text'),
        buttons: {
            feed: document.querySelector('.buttons__feed'),
            reset: document.querySelector('.buttons__reset')
        }
    };

    const hrunogochi = new Game();
    hrunogochi.run();

    DOM.buttons.reset.onclick = () => hrunogochi.reset();

    window.onunload = () => hrunogochi.save();
}

window.onload = main;
