const HRUN_COLORS = {
    body: '#ffe793',
    eye: '#fefffe',
    dark: '#333333',
    nose: '#edafB8'
};

/* eslint-disable-next-line */
class HrunDrawer {
    constructor() {
        this.snap = Snap('.hrun-shape'); // eslint-disable-line

        const positions = {
            leftEye: { x: 75, y: 95 },
            rightEye: { x: 155, y: 95 },
            nose: { x: 115, y: 165 }
        };

        const body = this.snap
            .circle(125, 125, 125)
            .attr({ fill: HRUN_COLORS.body })
            .addClass('hrun-shape__body');

        this.snap
            .rect(positions.leftEye.x - 15, positions.leftEye.y, 30, 5)
            .attr({ fill: HRUN_COLORS.dark, transform: 'r45' });
        this.snap
            .rect(positions.leftEye.x - 15, positions.leftEye.y, 30, 5)
            .attr({ fill: HRUN_COLORS.dark, transform: 'r-45' });

        const leftEye = {
            wrapper: this.snap
                .ellipse(positions.leftEye.x, positions.leftEye.y, 30, 30)
                .attr({ fill: HRUN_COLORS.eye }),
            eyeball: this.snap
                .ellipse(positions.leftEye.x + 7, positions.leftEye.y + 5, 15, 15)
                .attr({ fill: HRUN_COLORS.dark })
        };

        this.snap
            .rect(positions.rightEye.x - 15, positions.rightEye.y, 30, 5)
            .attr({ fill: HRUN_COLORS.dark, transform: 'r45' });
        this.snap
            .rect(positions.rightEye.x - 15, positions.rightEye.y, 30, 5)
            .attr({ fill: HRUN_COLORS.dark, transform: 'r-45' });

        const rightEye = {
            wrapper: this.snap
                .ellipse(positions.rightEye.x, positions.rightEye.y, 30, 30)
                .attr({ fill: HRUN_COLORS.eye }),
            eyeball: this.snap
                .ellipse(positions.rightEye.x + 4, positions.rightEye.y + 5, 15, 15)
                .attr({ fill: HRUN_COLORS.dark })
        };

        const nose = {
            wrapper: this.snap
                .circle(positions.nose.x, positions.nose.y, 35)
                .attr({ fill: '#ff8d8e' }),
            nostrils: [
                this.snap
                    .circle(positions.nose.x - 10, positions.nose.y, 7)
                    .attr({ fill: HRUN_COLORS.dark }),
                this.snap
                    .circle(positions.nose.x + 10, positions.nose.y, 7)
                    .attr({ fill: HRUN_COLORS.dark })
            ]
        };

        this.hrun = {
            body,
            leftEye, rightEye,
            nose: this.snap.group(nose.wrapper, ...nose.nostrils)
        };

        this.breathe();
    }

    // eslint-disable-next-line
    cycle(element, startAttrs, endAttrs, time = 1500, count = Infinity) {
        if (element.anims) {
            element.stop();
        }

        if (count === 0) {
            return;
        }

        element.animate(startAttrs, time / 2, () => {
            element.animate(endAttrs, time / 2, () => {
                this.cycle(element, startAttrs, endAttrs, time, --count);
            });
        });
    }

    stopAnimation(element) {
        element.stop();
        element.animate({ transform: 't0,0 r0 s1' }, 100);
    }

    breathe() {
        this.cycle(
            this.hrun.nose,
            { transform: 't0,3' }, { transform: 't0,0' }
        );
    }

    calm() {
        this.stopAnimation(this.hrun.body);
        this.stopAnimation(this.hrun.leftEye.eyeball);
        this.stopAnimation(this.hrun.rightEye.eyeball);
        this.cycle(
            this.hrun.nose,
            { transform: 't0,3' }, { transform: 't0,0' }
        );
    }

    die() {
        this.calm();
        this.stopAnimation(this.hrun.nose);

        this.hrun.leftEye.wrapper.attr({ visibility: 'hidden' });
        this.hrun.leftEye.eyeball.attr({ visibility: 'hidden' });
        this.hrun.rightEye.wrapper.attr({ visibility: 'hidden' });
        this.hrun.rightEye.eyeball.attr({ visibility: 'hidden' });
    }

    startEating() {
        this.calm();

        this.cycle(
            this.hrun.nose,
            { transform: 't1,3 r-5' }, { transform: 't0,-1 r-5' },
            500
        );
    }

    stopEating() {
        this.stopAnimation(this.hrun.nose);
        this.breathe();
    }

    startSleeping() {
        this.calm();

        this.hrun.leftEye.wrapper.attr({ fill: HRUN_COLORS.dark, ry: 20 }, 1000);
        this.hrun.rightEye.wrapper.attr({ fill: HRUN_COLORS.dark, ry: 20 }, 1000);
    }

    stopSleeping() {
        this.hrun.leftEye.wrapper.animate({ fill: HRUN_COLORS.eye, ry: 30 }, 1000);
        this.hrun.rightEye.wrapper.animate({ fill: HRUN_COLORS.eye, ry: 30 }, 1000);
    }

    startCommunicating() {
        this.cycle(
            this.hrun.leftEye.eyeball,
            { transform: 't-2,-2' }, { transform: 't2,-1' },
            1000
        );
        this.cycle(
            this.hrun.rightEye.eyeball,
            { transform: 't-2,-2' }, { transform: 't2,-1' },
            1000
        );
    }

    stopCommunicating() {
        this.stopAnimation(this.hrun.leftEye.eyeball);
        this.stopAnimation(this.hrun.rightEye.eyeball);
    }
}
