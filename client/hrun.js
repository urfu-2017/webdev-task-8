import Snap from 'snapsvg';

export default class Hrun {
    constructor(selector) {
        this.snap = Snap(selector); // eslint-disable-line new-cap

        this.styles = {
            head: {
                fill: '#db7093',
                stroke: '#000000',
                strokeWidth: 2
            },
            eyeOuter: {
                fill: '#ffffff',
                stroke: '#000000',
                strokeWidth: 2
            },
            nose: {
                fill: '#db7093',
                stroke: '#000000',
                strokeWidth: 2
            },
            ear: {
                fill: '#db7093',
                stroke: '#000000',
                strokeWidth: 2
            }
        };

        this.dynamicElements = [];

        this.chruAudios = [new Audio('/static/audio/chru.mp3')];
    }

    get element() {
        return this.snap.node;
    }

    say() {
        this.chruAudios[0].play();
    }

    setSleepState(isSleeping) {
        const animateOpenEye = (eyeOuter, eye, rOuter, rEye) => {
            setTimeout(() => {
                eyeOuter.animate({ ry: rEye }, 1000);
                eye.animate({ ry: rEye }, 1000);
                setTimeout(() => {
                    eyeOuter.animate({ ry: rOuter }, 500);
                }, 1000);
            }, 500);
        };

        const animateCloseEye = (eyeOuter, eye, rOuter, rEye) => {
            eyeOuter.animate({ ry: rEye }, 500);
            setTimeout(() => {
                eye.animate({ ry: 1 }, 1000);
                eyeOuter.animate({ ry: 1 }, 1000);
            }, 500);
        };

        if (!isSleeping) {
            animateOpenEye(this.rightEyeOuter, this.rightEye, 15, 10);
            animateOpenEye(this.leftEyeOuter, this.leftEye, 15, 10);
        } else {
            animateCloseEye(this.rightEyeOuter, this.rightEye, 15, 10);
            animateCloseEye(this.leftEyeOuter, this.leftEye, 15, 10);
        }
    }

    clear() {
        for (let el of this.dynamicElements) {
            el.remove();
        }
        this.dynamicElements = [];
    }

    death() {
        this.leftEyeOuter.remove();
        this.leftEye.remove();
        this.rightEye.remove();
        this.rightEyeOuter.remove();

        this.dynamicElements.push(this.snap.line(40, 70, 70, 40).attr({
            stroke: '#000000',
            strokeWidth: 2
        }));
        this.dynamicElements.push(this.snap.line(40, 40, 70, 70).attr({
            stroke: '#000000',
            strokeWidth: 2
        }));
        this.dynamicElements.push(this.snap.line(130, 70, 160, 40).attr({
            stroke: '#000000',
            strokeWidth: 2
        }));
        this.dynamicElements.push(this.snap.line(130, 40, 160, 70).attr({
            stroke: '#000000',
            strokeWidth: 2
        }));
    }

    draw() {
        this.clear();

        // ear left
        this.snap.path('M10,50L0,0,80,30').attr(this.styles.ear);
        // ear right
        this.snap.path('M190,50L210,0,160,20').attr(this.styles.ear);

        // head
        this.snap.ellipse(100, 80, 100, 80).attr(this.styles.head);

        // eye left
        this.leftEyeOuter = this.snap.ellipse(60, 50, 15, 15).attr(this.styles.eyeOuter);
        this.leftEye = this.snap.ellipse(60, 50, 10, 10);

        // eye right
        this.rightEyeOuter = this.snap.ellipse(140, 50, 15, 15).attr(this.styles.eyeOuter);
        this.rightEye = this.snap.ellipse(140, 50, 10, 10);

        // nose
        this.snap.ellipse(100, 100, 20, 15).attr(this.styles.nose);
        this.snap.circle(92, 100, 3);
        this.snap.circle(108, 100, 3);

        // mouth
        this.snap.path('M80,130S100,150,120,130');
    }
}
