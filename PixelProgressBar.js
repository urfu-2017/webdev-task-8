export default class PixelProgressBar {
    get value() {
        return this._value;
    }

    constructor(drawer, options = {}) {
        this._drawer = drawer;
        this._color = options.color || 'red';
        this._width = options.width || 20;
        this._height = options.height || 4;
        this._value = options.value || 0;

        this._drawBorder();
        this._drawFill();
    }

    set(value) {
        this._value = value;

        this._drawer.clear();
        this._drawBorder();
        this._drawFill();
    }

    _drawBorder() {
        this._drawer.drawLine(0, 0, this._width - 1, 0, 'black');
        this._drawer.drawLine(0, this._height - 1, this._width - 1, this._height - 1, 'black');
        this._drawer.drawLine(0, 0, 0, this._height - 1, 'black');
        this._drawer.drawLine(this._width - 1, 0, this._width - 1, this._height - 1, 'black');
    }

    _drawFill() {
        const fillWidth = Math.floor((this._width - 2) * (this._value / 100));

        if (!fillWidth) {
            return;
        }

        for (let i = 1; i <= this._height - 2; i++) {
            this._drawer.drawLine(1, i, fillWidth, i, this._color);
        }
    }
}
