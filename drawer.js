/* global mina:true*/
import snap from 'snapsvg';

class Drawer {

    drawHero() {
        this.layout = snap('.hero__picture');
        this.head = this.layout.circle(60, 50, 50).attr({ fill: '#cca0a0' });
        this.eyes = this.layout.group(
            this.layout.circle(80, 30, 10),
            this.layout.circle(40, 30, 10)
        );
        this.eyes.attr({ fill: '#CF4D6F' });
        this.mouth = this.layout.path('M20,70C40,90,80,90,100,70').attr({ fill: '#C97282' });
        this.nose = this.layout.path('').attr({ fill: '#76818E' });
        this.nose = this.layout.group(
            this.layout.circle(60, 50, 12).attr({ fill: '#ecc5c4' }),
            this.layout.circle(54, 50, 3).attr({ fill: '#b85f69' }),
            this.layout.circle(66, 50, 3).attr({ fill: '#b85f69' }),
        );
        this.paws = this.layout.group(
            this.layout.circle(10, 55, 10),
            this.layout.circle(110, 55, 10),
            this.layout.circle(40, 100, 10),
            this.layout.circle(80, 100, 10)
        );
        this.paws.attr({ fill: '#ecc5c4' });
    }

    animateDeath() {
        this.stopSpeak();
        this.eyes.attr({ fill: '#000' });
        this.mouth.animate({ d: 'M20,80C40,60,80,60,100,80' }, 1000);
    }

    animateWake() {
        this.eyes.attr({ fill: 'none' }).animate({ fill: '#CF4D6F' }, 1500, mina.easeinout);
        this.paws.animate({ transform: 't0, 2' }, 500, mina.easein, () => {
            this.paws.animate({ transform: 't0, -2' }, 500, mina.easein);
        });
    }

    stopSpeak() {
        if (this.ears) {
            this.ears.attr({ opacity: 0 });
        }
    }

    startSpeak() {
        this.ears = this.layout.group(this.layout.polygon([14, 30, 40, 4, 0, 0]),
            this.layout.polygon([106, 30, 80, 4, 110, 0]));
        this.ears.attr({ fill: '#b85f69' }, 10000, mina.easein);
    }
}

export default new Drawer();
