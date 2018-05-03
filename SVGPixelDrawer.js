/* eslint-disable */
import * as snap from 'snapsvg-cjs';

export default class SVGPixelDrawer {
    constructor(svg, pixelSize = 8, pixelSpan = 2) {
        this._svg = svg;
        this._svgns = 'http://www.w3.org/2000/svg';
        this._snap = snap(this._svg);

        this._pixelSize = pixelSize;
        this._pixelSpan = pixelSpan;
    }

    newGroup() {
        const group = document.createElementNS(this._svgns, 'g');
        this._svg.appendChild(group);

        return new SVGPixelDrawer(group, this._pixelSize, this._pixelSpan);
    }

    move(x, y) {
        return new Promise(resolve => {
            this._snap.animate({
                transform: `t${x},t${y}`
            }, 2 * 1000, mina.linear, resolve);
        });
    }

    clear() {
        this._svg.innerHTML = '';
    }

    destroy() {
        this._svg.remove();
    }

    drawPixel(x, y, color = 'black') {
        const rect = document.createElementNS(this._svgns, 'rect');
        rect.setAttribute('x', this._pixelSize * x + this._pixelSpan * x);
        rect.setAttribute('y', this._pixelSize * y + this._pixelSpan * y);
        rect.setAttribute('width', this._pixelSize);
        rect.setAttribute('height', this._pixelSize);
        rect.setAttribute('fill', color);

        this._svg.appendChild(rect);
    }

    drawLine(fromX, fromY, toX, toY, color = 'black') {
        const deltaX = Math.abs(fromX - toX);
        const deltaY = Math.abs(fromY - toY);
        const signX = fromX < toX ? 1 : -1;
        const signY = fromY < toY ? 1 : -1;

        let error = deltaX - deltaY;
        this.drawPixel(toX, toY, color);

        while (fromX !== toX || fromY !== toY) {
            this.drawPixel(fromX, fromY, color);
            const error2 = error * 2;

            if (error2 > - deltaY) {
                error -= deltaY;
                fromX += signX;
            }

            if (error2 < deltaX) {
                error += deltaX;
                fromY += signY;
            }
        }
    }
}
