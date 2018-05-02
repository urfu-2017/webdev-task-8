import snap from 'snapsvg';

const COLORS = {
    ears: '#fe9923',
    head: '#fedbab',
    nose: '#fe9923',
    nostrils: '#fedbab',
    eyes: '#ff6e23',
    mouth: '#333',
    crosses: '#333',
    closedEyes: '#333'
};

const SAD_MOUTH_PATH = 'M50,118C65,111,85,111,100,118';
const HAPPY_MOUTH_PATH = 'M50,118C65,130,85,130,100,118';
const STRAIGH_MOUTH_PATH = 'M50,118L100,118';
const CROSSES_PATH = 'M50,52L61,63M61,52L50,63 M90,52L101,63M101,52L90,63';
const CLOSED_EYES_PATH = 'M46,58C51,63,59,63,64,58M104,58C99,63,91,63,86,58';
const HRUNDEL_SVG_CLASS = '.hrundel__img';

export default class Drawer {
    drawHrundel() {
        this.paper = snap(HRUNDEL_SVG_CLASS);

        this._drawEars();
        this._drawHead();
        this._drawNose();
        this._drawNostrils();
        this._drawEyes();
        this._drawMouth();
        this._drawCrosses();
        this._drawClosedEyes();
    }

    _drawEars() {
        this.ears = this.paper.group(this.paper.polygon([20, 60, 60, 20, 10, 5]),
            this.paper.polygon([130, 60, 90, 20, 140, 5]));
        this.ears.attr({ fill: COLORS.ears });
    }

    _drawHead() {
        this.head = this.paper.circle(75, 75, 60);
        this.head.attr({ fill: COLORS.head });
    }

    _drawNose() {
        this.nose = this.paper.ellipse(75, 90, 30, 20);
        this.nose.attr({ fill: COLORS.nose });
    }

    _drawNostrils() {
        this.nostrils = this.paper.group(this.paper.circle(65, 90, 5),
            this.paper.circle(85, 90, 5));
        this.nostrils.attr({ fill: COLORS.nostrils });
    }

    _drawEyes() {
        this.eyes = this.paper.group(this.paper.circle(55, 58, 5),
            this.paper.circle(95, 58, 5));
        this.eyes.attr({ fill: COLORS.eyes });
    }

    _drawMouth() {
        this.mouth = this.paper.path(HAPPY_MOUTH_PATH);
        this.mouth.attr({ fill: COLORS.head, stroke: COLORS.mouth, strokeWidth: 4 });
    }

    _drawCrosses() {
        this.crosses = this.paper.path(CROSSES_PATH);
        this.crosses.attr({ fill: COLORS.head, stroke: COLORS.crosses,
            strokeWidth: 4, opacity: 0 });
    }

    _drawClosedEyes() {
        this.closedEyes = this.paper.path(CLOSED_EYES_PATH);
        this.closedEyes.attr({ fill: COLORS.head,
            stroke: COLORS.closedEyes, strokeWidth: 4, opacity: 0 });
    }

    makeSadFace(duration) {
        this.mouth.animate({ d: SAD_MOUTH_PATH }, duration);
    }

    makeHappyFace(duration) {
        this.mouth.animate({ d: HAPPY_MOUTH_PATH }, duration);
    }

    makePokerFace(duration) {
        this.mouth.animate({ d: STRAIGH_MOUTH_PATH }, duration);
    }

    makeDeadEyes(duration) {
        this.crosses.animate({ opacity: 1 }, duration);
        this.closedEyes.animate({ opacity: 0 }, duration);
        this.eyes.animate({ opacity: 0 }, duration);
    }

    makeAliveEyes(duration) {
        this.crosses.animate({ opacity: 0 }, duration);
        this.closedEyes.animate({ opacity: 0 }, duration);
        this.eyes.animate({ opacity: 1 }, duration);
    }

    makeSleepingEyes(duration) {
        this.crosses.animate({ opacity: 0 }, duration);
        this.closedEyes.animate({ opacity: 1 }, duration);
        this.eyes.animate({ opacity: 0 }, duration);
    }

    startBlinking(time) {
        clearInterval(this.blinkTimerId);
        this.blinkTimerId = setInterval(() => {
            this.makeSleepingEyes(130);
            setTimeout(() => {
                this.makeAliveEyes(130);
            }, 300);
        }, time);
    }

    stopBlinking() {
        clearInterval(this.blinkTimerId);
    }
}
