import snap from 'snapsvg';

export default class Animator {
    drawHero() {
        this.layout = snap('.hero__picture');
        this.head = this.layout.circle(50, 50, 50).attr({ fill: '#C5AFA4' });
        this.eyes = this.layout.group(
            this.layout.circle(70, 30, 10),
            this.layout.circle(30, 30, 10)
        );
        this.eyes.attr({ fill: '#CF4D6F' });
        this.mouth = this.layout.path('M10,70C40,90,60,90,90,70').attr({ fill: '#C97282' });
        this.nose = this.layout.path('').attr({ fill: '#76818E' });
        this.nose = this.layout.group(
            this.layout.circle(50, 50, 12).attr({ fill: '#ecc5c4' }),
            this.layout.circle(44, 50, 3).attr({ fill: '#b85f69' }),
            this.layout.circle(56, 50, 3).attr({ fill: '#b85f69' }),
        );
    }

    animateDeath() {
        this.endSpeech();
        this.eyes.attr({ fill: '#000' });
        this.mouth.animate({ d: 'M10,90C40,70,60,70,90,90' }, 1000);
    }

    endSpeech() {
        if (this.ears) {
            this.ears.attr({ opacity: 0 });
        }
    }

    startSpeech() {
        this.ears = this.layout.group(this.layout.polygon([4, 30, 30, 4, 0, 0]),
            this.layout.polygon([96, 30, 70, 4, 100, 0]));
        this.ears.attr({ fill: '#b85f69' });
    }
}
