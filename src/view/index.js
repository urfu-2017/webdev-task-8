/* eslint-disable complexity,no-undef */
import Snap from 'snapsvg';

import { ACTIONS } from '../lib/actions';


const SKEWS = {
    left: (new Snap.Matrix()).skew(-5, 5),
    neutral: new Snap.Matrix(),
    right: (new Snap.Matrix()).skew(5, 5)
};


export default class View {
    constructor(surface) {
        this._snap = new Snap(surface);
        this._shapes = {};
        this._overlay = [];
        this._previousAction = null;

        this._drawFace();
    }

    draw(action) {
        if (action === this._previousAction) {
            return;
        }
        this._previousAction = action;
        switch (action) {
            case ACTIONS.DEAD:
                this._drawDead();

                return;
            case ACTIONS.SLEEP:
                this._drawSleep();
                break;
            case ACTIONS.EAT:
                this._drawEat();
                break;
            case ACTIONS.LISTEN:
                this._drawListen();
                break;
            default:
                this._drawIdle();
                break;
        }
        if (action !== ACTIONS.SLEEP) {
            this._drawIdle();
        }
    }

    clear() {
        this._snap.clear();
    }

    _drawFace() {
        this._shapes.base = this._snap.circle(150, 150, 150);
        this._shapes.base.attr({
            fill: 'pink',
            stroke: 'white',
            strokeWidth: 15,
            strokeOpacity: 0.5
        });

        const earsStyle = { fill: 'pink' };
        this._shapes.leftEar = this._snap.path('M30,90L20,0,140,20')
            .attr(earsStyle);
        this._shapes.rightEar = this._snap.path('M270,90L280,0,160,20')
            .attr(earsStyle);
        this._shapes.ears = this._snap.group(
            this._shapes.leftEar,
            this._shapes.rightEar,
        );

        this._shapes.nose = this._snap.ellipse(150, 190, 70, 40)
            .attr({ fill: 'white', opacity: 0.5 });

        const nostrilsStyle = { fill: 'black', opacity: 0.2 };

        this._shapes.nostrils = this._snap.group(
            this._snap.circle(120, 190, 20)
                .attr(nostrilsStyle),
            this._snap.circle(180, 190, 20)
                .attr(nostrilsStyle)
        );

        const eyesStyle = {
            fill: 'white', stroke: 'black',
            strokeWidth: 5, strokeOpacity: 0.4
        };
        this._shapes.eyes = this._snap.group(
            this._snap.ellipse(100, 100, 25, 25)
                .attr(eyesStyle),
            this._snap.ellipse(200, 100, 25, 25)
                .attr(eyesStyle)
        );
    }

    _drawIdle() {
        this._shapes.eyes
            .animate({ transform: 's1 1' }, 1000);
    }

    _drawSleep() {
        this._shapes.eyes
            .animate({ transform: 's1 .05' }, 1000);
    }

    _drawEat(inverse = false) {
        if (this._previousAction !== ACTIONS.EAT && inverse) {
            return;
        }
        this._shapes.nostrils.animate({
            transform: inverse ? 's1 1' : 's.8 .8'
        }, 800, mina.easeinout, () => this._drawEat(!inverse));
    }

    _drawListen(skew = 'right', direction = 1) {
        if (this._previousAction !== ACTIONS.LISTEN && skew !== 'neutral') {
            return;
        }
        const nextSkew = skew === 'neutral'
            ? (direction === 1 && 'right' || 'left')
            : 'neutral';
        const nextDirection = skew === 'neutral' ? direction : -direction;
        this._shapes.ears
            .animate({
                transform: SKEWS[skew]
            }, 500, mina.easeout, () => this._drawListen(nextSkew, nextDirection));

    }

    _drawDead() {
        this._clearOverlay();

        this._shapes.eyes.remove();

        this._shapes.leftEar.animate({
            d: 'M30,90L20,40,140,20'
        }, 1000, mina.easeout);
        this._shapes.rightEar.animate({
            d: 'M270,90L280,40,160,20'
        }, 1000, mina.easeout);

        const lineStyle = {
            strokeWidth: 5,
            stroke: 'black'
        };
        const leftEye = this._snap.group(
            this._snap.line(70, 100, 120, 100)
                .attr(lineStyle),
            this._snap.line(95, 75, 95, 125)
                .attr(lineStyle)
        ).transform('r45');
        leftEye.clone()
            .transform('t100 0r45');
    }

    _clearOverlay() {
        this._overlay.map(shape => shape.remove());
        this._overlay = [];
    }
}
