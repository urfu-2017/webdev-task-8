export default class Hrundel {
    constructor(drawer) {
        this._drawer = drawer;
        this._hrun = this._drawer.newGroup();


        this.drawNormalHrun(0, 0);

        this._sleepInterval = null;
    }

    sleep() {
        this._sleepInterval = setInterval(() => {
            const drawer = this._drawer.newGroup();

            this.drawZ(drawer, 20, 4);

            drawer.move(50, -10).then(() => drawer.destroy());
        }, 1500);
    }

    async note() {
        const note = this._drawer.newGroup();
        this.drawNote(note, 20, 4);

        await note.move(70, -10);
        note.destroy();
    }

    awake() {
        clearInterval(this._sleepInterval);
    }

    die() {
        console.info('DIE');
    }

    drawNote(drawer, x, y) {
        drawer.drawLine(x + 1, y + 5, x + 2, y + 5);
        drawer.drawLine(x + 0, y + 4, x + 3, y + 4);
        drawer.drawLine(x + 1, y + 3, x + 2, y + 3);

        drawer.drawLine(x + 3, y + 3, x + 3, y + 0);
        drawer.drawLine(x + 3, y + 0, x + 5, y + 0);
    }

    drawZ(drawer, x, y) {
        drawer.drawLine(x + 0, y + 0, x + 4, y + 0);
        drawer.drawLine(x + 4, y + 0, x + 0, y + 4);
        drawer.drawLine(x + 0, y + 4, x + 4, y + 4);
    }

    drawNormalHrun(x, y) {
        this._drawEar(this._hrun, x + 0, y + 0);
        this._drawHead(this._hrun, x + 3, y + 1);
        this._drawEar(this._hrun, x + 13, y + 0);
        this._drawEyes(this._hrun, x + 7, y + 4);
        this._drawNose(this._hrun, x + 6, x + 6);
    }

    _drawEar(drawer, x, y, color = 'black') {
        drawer.drawLine(x + 0, y + 2, x + 2, y + 0, color);
        drawer.drawLine(x + 3, y + 0, x + 5, y + 2, color);
        drawer.drawLine(x + 1, y + 3, x + 4, y + 3, color);
        drawer.drawLine(x + 2, y + 2, x + 3, y + 2, color);
    }

    _drawHead(drawer, x, y, color = 'black') {
        drawer.drawLine(x + 0, y + 3, x + 0, y + 10, color);
        drawer.drawLine(x + 0, y + 10, x + 3, y + 12);

        drawer.drawLine(x + 1, y + 2, x + 2, y + 1, color);
        drawer.drawLine(x + 3, y + 0, x + 9, y + 0, color);
        drawer.drawLine(x + 10, y + 1, x + 11, y + 2, color);

        drawer.drawLine(x + 12, y + 3, x + 12, y + 10, color);
        drawer.drawLine(x + 12, y + 10, x + 9, y + 12);

        drawer.drawLine(x + 3, y + 12, x + 9, y + 12);
    }

    _drawEyes(drawer, x, y, color = 'black') {
        drawer.drawPixel(x + 0, y + 0, color);
        drawer.drawPixel(x + 3, y + 0, color);
    }

    _drawNose(drawer, x, y, color = 'black') {
        drawer.drawLine(x + 0, y + 1, x + 0, y + 3, color);
        drawer.drawLine(x + 1, y + 0, x + 4, y + 0, color);
        drawer.drawLine(x + 5, y + 1, x + 5, y + 3, color);
        drawer.drawLine(x + 1, y + 4, x + 4, y + 4, color);
        drawer.drawLine(x + 2, y + 1, x + 2, y + 3, color);
        drawer.drawLine(x + 3, y + 1, x + 3, y + 3, color);
    }
}
