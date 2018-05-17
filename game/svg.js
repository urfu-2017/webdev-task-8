import Snap from 'snapsvg';
import { STATE } from './state';

export class SVG {
    constructor(svg, state) {
        const s = new Snap(svg);
        this.face = s.circle(100, 100, 100);
        this.face.attr({ fill: '#ff94a6' });

        this.leftEye = s.ellipse(50, 80, 20, 25);
        this.rightEye = s.ellipse(150, 80, 20, 25);
        this.leftEye.attr({ fill: '#fff' });
        this.rightEye.attr({ fill: '#fff' });

        this.leftPoint = s.circle(50, 80, 10);
        this.rightPoint = s.circle(150, 80, 10);
        this.leftPoint.attr({ fill: 'green' });
        this.rightPoint.attr({ fill: 'green' });

        this.mouth = s.ellipse(100, 150, 50, 10);
        this.mouth.attr({ fill: 'white', stroke: 'white', strokeWidth: 4 });

        this.reDraw(state);
    }

    reDraw(newState) {
        if (this.state !== newState) {
            this._reset();
            this.state = newState;

            switch (newState) {
                case STATE.SLEEP:
                    this._drawSleep();
                    return;

                case STATE.MOOD:
                    this._drawMood();
                    return;

                case STATE.SATIETY:
                    this._drawSatiety();
                    return;

                case STATE.DEAD:
                    this._drawDeath();
                    return;

                default:
                    this._reset();
            }
        }
    }

    _drawSleep() {
        this.leftPoint.attr({ fill: 'black' });
        this.rightPoint.attr({ fill: 'black' });

        this.leftEye.attr({ fill: 'black' });
        this.rightEye.attr({ fill: 'black' });
    }

    _drawMood() {
        this.mouth.attr({ rx: 60, ry: 20 }, 300);
        this.leftPoint.attr({ r: 15 });
        this.rightPoint.attr({ r: 15 });

    }

    _drawSatiety() {
        this.mouth.attr({ strokeWidth: 6, fill: 'red', stroke: 'red' }, 300);
    }


    _drawDeath() {
        this.leftPoint.attr({ fill: 'green', r: 0 });
        this.rightPoint.attr({ fill: 'green', r: 0 });

        this.leftEye.attr({ fill: 'red' });
        this.rightEye.attr({ fill: 'red' });

        this.mouth.attr({ fill: 'red', stroke: 'red' });
    }

    _reset() {
        this.leftPoint.attr({ fill: 'green', r: 10 });
        this.rightPoint.attr({ fill: 'green', r: 10 });

        this.leftEye.attr({ fill: 'white' });
        this.rightEye.attr({ fill: 'white' });

        this.mouth.attr({ rx: 50, ry: 10, stroke: 'white', fill: 'white' });
    }
}
