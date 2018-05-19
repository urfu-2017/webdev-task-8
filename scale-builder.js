(function () {
    function trimFloat(number) {
        return Number(number.toFixed(5));
    }
    class ScaleBuilder {
        constructor(options) {
            this.options = options;
        }

        getStatScale(collectionName) {
            const { polylinearScale, hruStorage, hrundel } = window;
            const { MAX_STAT_LEVEL, decreaseSpeedConfig, REGEN_RATE } = this.options;
            const X = [0];
            const Y = [MAX_STAT_LEVEL];

            const periods = hruStorage.getObject(collectionName);
            const decreaseSpeed = decreaseSpeedConfig[collectionName];
            if (periods) {
                periods.forEach(period => {
                    const start = period[0];
                    const end = period[1] || hrundel.age;
                    addPoint(start, -decreaseSpeed);
                    addPoint(end, decreaseSpeed * REGEN_RATE);
                });
            }

            if (periods && periods.length === 0 || periods[periods.length - 1].length !== 1) {
                addPoint(hrundel.age, -decreaseSpeed);
            }


            function pushPoint(x, y) {
                X.push(x);
                Y.push(y);
            }


            function addPoint(x, k) {
                const x0 = X[X.length - 1];
                const b = Y[Y.length - 1];
                const y = trimFloat(k * (x - x0) + b);

                if (y < 0) {
                    boundTo(0);
                } else if (y > MAX_STAT_LEVEL) {
                    const xRoot = boundTo(MAX_STAT_LEVEL);
                    hrundel.endPeriod(collectionName, xRoot);
                } else {
                    pushPoint(x, y);
                }

                function boundTo(yValue) {
                    const xRoot = trimFloat(yValue + k * x0 - b) / k;
                    pushPoint(xRoot, yValue);
                    pushPoint(x, yValue);

                    return xRoot;
                }

            }

            return polylinearScale(X, Y);
        }
    }

    window.ScaleBuilder = ScaleBuilder;
}());
