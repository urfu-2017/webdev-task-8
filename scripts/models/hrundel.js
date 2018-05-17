const { alternate, reset } = require('../../scripts/helpers/animation');
const { initState, saveState, clearState } = require('../helpers/state');

module.exports = class {
    constructor(hrundel) {
        this.hrundel = hrundel;
        this.leftHand = hrundel.select('#left-hand');
        this.rightHand = hrundel.select('#right-hand');
        this.leftLeg = hrundel.select('#left-leg');
        this.rightLeg = hrundel.select('#right-leg');
        this.body = hrundel.select('#body');

        this.leftEar = hrundel.select('#left-ear');
        this.rightEar = hrundel.select('#right-ear');
        this.leftEye = hrundel.select('#left-eye');
        this.rightEye = hrundel.select('#right-eye');
        this.nose = hrundel.select('#nose');
        this.head = hrundel.select('#Head');

        this.state = initState();
    }

    initLifecycle(data) {
        this.isEating = false;
        this.isEnjoying = false;
        this.isSleeping = false;

        this.deathLine = setInterval(() => {
            this.tick(data);
        }, 1000);

        this.lifeLine = setInterval(() => {
            this.fill(data);
        }, 250);
    }

    tick({ onUpdate, onHungry, onUpset }) {
        if (this.isDead()) {
            clearInterval(this.deathLine);
            clearInterval(this.lifeLine);
            this.die();

            return;
        }
        this.checkReduce({ onUpset, onHungry });

        this.state.energy -= this.needDecreaseEnergy() ? 1 : 0;
        this.state.mood -= this.needDecreaseMood() ? 1 : 0;
        this.state.satiety -= this.needDecreaseSatiety() ? 1 : 0;

        onUpdate(this.state);
        saveState(this.state);
    }

    fill({ onUpdate, onFed, onEnjoyed, onOverslept }) {
        this.checkFill({ onFed, onEnjoyed, onOverslept });

        this.state.energy += this.isSleeping ? 1 : 0;
        this.state.satiety += this.isEating ? 1 : 0;

        onUpdate(this.state);
        saveState(this.state);
    }

    needDecreaseEnergy() {
        return !(this.isSleeping || this.state.energy === 0);
    }

    needDecreaseMood() {
        return !(this.isEnjoying || this.state.mood === 0);
    }

    needDecreaseSatiety() {
        return !(this.isEating || this.state.satiety === 0);
    }

    // eslint-disable-next-line
    checkFill({ onFed, onEnjoyed, onOverslept }) {
        if (this.state.energy === 100) {
            if (this.isSleeping) {
                this.state.energy = 99;
                onOverslept();
            }
        }
        if (this.state.satiety === 100) {
            if (this.isEating) {
                onFed();
            }

            this.isEating = false;
        }
        if (this.state.mood === 100) {
            if (this.isEnjoying) {
                onEnjoyed();
            }

            this.isEnjoying = false;
        }
    }

    checkReduce({ onUpset, onHungry }) {
        if (this.state.satiety === 10) {
            onHungry();
        }

        if (this.state.mood === 10) {
            onUpset();
        }
    }

    isDead() {
        const { energy, satiety, mood } = this.state;

        return (!energy && !satiety) || (!energy && ! mood) || (!satiety && !mood);
    }

    resetPosition(time) {
        [
            this.hrundel,
            this.leftHand,
            this.rightHand,
            this.leftLeg,
            this.rightLeg,
            this.body,
            this.leftEar,
            this.rightEar,
            this.leftEye,
            this.rightEye,
            this.nose,
            this.head
        ].forEach(element => reset(element, time));
    }

    openEyes(time) {
        this.rightEye.animate({
            r: 5
        }, time);

        this.leftEye.animate({
            r: 5
        }, time);
    }

    clear() {
        clearInterval(this.lifeLine);
        clearInterval(this.deathLine);
        this.resetPosition(0);

        let path = this.hrundel.select('path');
        if (path) {
            path.remove();
        }

        let text = this.hrundel.select('text');
        if (text) {
            text.remove();
        }

        clearState();
    }

    eat() {
        this.isEating = true;
    }

    stopEating() {
        this.isEating = false;
    }

    feedUp() {
        this.state.satiety = 100;
    }

    listen() {
        this.isEnjoying = true;
    }

    stopListening() {
        this.isEnjoying = false;
    }

    moodUp() {
        this.state.mood = this.state.mood <= 90 ? this.state.mood + 10 : 100;
    }

    greet() {
        alternate(this.hrundel, {
            transform: 't0,-30'
        }, {
            transform: 't0,0'
        }, 300, 2);

        alternate(this.leftHand, {
            transform: 'r10,100,120'
        }, {
            transform: 'r0,100,120'
        }, 200, 3);
    }

    enjoy() {
        alternate(this.hrundel, {
            transform: 't0,-30'
        }, {
            transform: 't0,0'
        }, 300, 2);
    }

    awake() {
        if (this.isDead()) {
            return;
        }

        this.isSleeping = false;

        this.resetPosition(700);
        this.openEyes(700);
    }

    sleep() {
        if (this.isDead()) {
            return;
        }

        this.isSleeping = true;
        this.isEnjoying = false;
        this.isEating = false;

        const duration = 1000;

        this.leftEye.animate({
            r: 0.5
        }, duration);

        this.rightEye.animate({
            r: 0.5
        }, duration);

        this.leftEar.animate({
            transform: 't0,5'
        }, duration);

        this.rightEar.animate({
            transform: 't0,5'
        }, duration);

        this.head.animate({
            transform: 't0,10 r-10, 80.33, 118.91'
        }, duration);
    }

    die() {
        const text = this.hrundel.text(0, 140, ['W', 'A', 'S', 'T', 'E', 'D']);
        text.attr({
            'font-size': 38
        });

        const tspans = text.selectAll('tspan').attr({
            opacity: 0
        });

        for (let i = 0; i < tspans.length; i++) {
            tspans[i].animate({
                opacity: 1
            }, 1500);
        }

        this.head.path('M55 29 L65 39 M65 29 L 55 39 M98 29 L108 39 M 108 29 L 98 39')
            .attr({
                stroke: '#000',
                strokeWidth: 2,
                opacity: 0
            })
            .attr({
                opacity: 1
            });

        this.leftEye.attr({
            opacity: 0
        });

        this.rightEye.attr({
            opacity: 0
        });
    }
};
