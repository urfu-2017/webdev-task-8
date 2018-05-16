const { alternate, reset } = require('../../scripts/helpers/animation');
const { initState } = require('../../scripts/helpers/init-state');

module.exports = class Hrundel {
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

    initLifecycle(onUpdate, onFed, onEnjoyed, onOverslept) {
        this.isEating = false;
        this.isEnjoying = false;
        this.isSleeping = false;

        this.deathLine = setInterval(() => {
            this.tick(onUpdate);
        }, 1000);

        this.lifeLine = setInterval(() => {
            this.fill(onUpdate, onFed, onEnjoyed, onOverslept);
        }, 250);
    }

    tick(cb) {
        if (this.isDead()) {
            clearInterval(this.deathLine);
            clearInterval(this.lifeLine);
            this.die();

            return;
        }
        cb(this.state);

        this.state.energy -= this.isSleeping ? 0 : 1;
        this.state.mood -= this.isEnjoying ? 0 : 1;
        this.state.satiety -= this.isEating ? 0 : 1;
    }

    fill(cb, onFed, onEnjoyed, onOverslept) {
        this.checkState(onFed, onEnjoyed, onOverslept);
        cb(this.state);

        this.state.energy += this.isSleeping ? 1 : 0;
        this.state.mood += this.isEnjoying ? 1 : 0;
        this.state.satiety += this.isEating ? 1 : 0;
    }

    checkState(onFed, onEnjoyed, onOverslept) {
        if (this.state.energy === 100) {
            this.isSleeping = false;
            onOverslept();
        }
        if (this.state.satiety === 100) {
            this.isEating = false;
            onFed();
        }
        if (this.state.mood === 100) {
            this.isEnjoying = false;
            onEnjoyed();
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

    awake() {
        this.resetPosition(700);
        this.openEyes(700);
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

    sleep() {
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

        this.hrundel.path('M55 29 L65 39 M65 29 L 55 39 M98 29 L108 39 M 108 29 L 98 39')
            .attr({
                stroke: '#000',
                strokeWidth: 2,
                opacity: 0
            })
            .animate({
                opacity: 1
            }, 500);

        this.leftEye.animate({
            opacity: 0
        }, 500);

        this.rightEye.animate({
            opacity: 0
        }, 500);
    }
};
