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
        if (this.mouth) {
            this.mouth.remove();
        }
        this.mouth = this.layout.path('M10,70C40,90,60,90,90,70').attr({ fill: '#CF4D6F' });
        this.nose = this.layout.group(
            this.layout.circle(50, 50, 12).attr({ fill: '#ecc5c4' }),
            this.layout.circle(44, 50, 3).attr({ fill: '#b85f69' }),
            this.layout.circle(56, 50, 3).attr({ fill: '#b85f69' }),
        );
        this.sleepingEyes = this.layout.group(
            this.layout.rect(20, 27, 20, 7),
            this.layout.rect(60, 27, 20, 7)
        );
        this.sleepingEyes.attr({ fill: '#CF4D6F', opacity: 0 });
    }

    animateDeath() {
        this.resetCurrentAnimation();
        this.eyes.attr({ fill: '#000' });
        this.mouth.animate({ d: 'M10,90C40,70,60,70,90,90' }, 1000);
    }

    animateSleep() {
        this.resetCurrentAnimation();
        this.eyes.animate({ opacity: 0 }, 200);
        this.sleepingEyes.animate({ opacity: 1 }, 200);
    }

    animateWaking() {
        this.resetCurrentAnimation();
        this.eyes.animate({ opacity: 1 }, 1500);
        this.sleepingEyes.animate({ opacity: 0 }, 1500);
    }

    animateFeeding() {
        this.resetCurrentAnimation();
        this.battery = this.layout.group(
            this.layout.rect(92, 2, 2, 10),
            this.layout.rect(84, 2, 2, 10),
            this.layout.rect(88, 2, 2, 10),
            this.layout.rect(96, 4, 2, 6)
        );
        this.battery.attr({ fill: '#0dd11a' });
    }

    resetCurrentAnimation() {
        if (this.ears) {
            this.ears.remove();
        }
        if (this.battery) {
            this.battery.remove();
        }
    }

    startSpeech() {
        this.ears = this.layout.group(this.layout.polygon([4, 30, 30, 4, 0, 0]),
            this.layout.polygon([96, 30, 70, 4, 100, 0]));
        this.ears.attr({ fill: '#b85f69' });
    }
}
