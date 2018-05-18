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

        const leftEye = {
            wrapper: this.snap
                .ellipse(positions.leftEye.x, positions.leftEye.y, 30, 30)
                .attr({ fill: HRUN_COLORS.eye }),
            eyeball: this.snap
                .ellipse(positions.leftEye.x + 7, positions.leftEye.y + 5, 15, 15)
                .attr({ fill: HRUN_COLORS.dark })
        };

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
    animate(element, startAttrs, endAttrs, time = 1500, count = Infinity) {
        if (count === 0) {
            return;
        }

        element.animate(startAttrs, time / 2, () => {
            element.animate(endAttrs, time / 2, () => {
                this.animate(element, startAttrs, endAttrs, time, --count);
            });
        });
    }

    stopAnimation(element) {
        element.stop();
        element.animate({ transform: 't0,0 r0 s1' }, 100);

        if (element === this.hrun.nose) {
            this.breathe();
        }
    }

    breathe() {
        this.animate(
            this.hrun.nose,
            { transform: 't0,3' }, { transform: 't0,0' }
        );
    }

    calm() {
        this.stopAnimation(this.hrun.body);
        this.stopAnimation(this.hrun.leftEye);
        this.stopAnimation(this.hrun.rightEye);
        this.animate(
            this.hrun.nose,
            { transform: 't0,3' }, { transform: 't0,0' }
        );
    }

    die() {
        this.stopAnimation(this.hrun.nose);
    }

    startEating() {
        this.animate(
            this.hrun.nose,
            { transform: 't0,3' }, { transform: 't0,0' }
        );
    }

    stopEating() {
        this.stopAnimation(this.hrun.nose);
    }

    startSleeping() {
        this.animate(
            this.hrun.leftEye.wrapper,
            { transform: 't0,3' }, { transform: 't0,0' }
        );
        this.animate(
            this.hrun.rightEye.wrapper,
            { transform: 't0,3' }, { transform: 't0,0' }
        );
    }

    stopSleeping() {
        this.stopAnimation(this.hrun.leftEye.wrapper);
        this.stopAnimation(this.hrun.rightEye.wrapper);
    }
}
