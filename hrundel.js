(function () {


    const { polylinearScale } = window;


    function setObject(key, value) {
        if (value === null) {
            localStorage.removeItem(key);
        } else {
            localStorage.setItem(key, JSON.stringify(value));
        }
    }

    function getObject(key) {
        const value = localStorage.getItem(key);

        return value === null
            ? null
            : JSON.parse(value);
    }

    function setDate(key, value) {
        setObject(key, value);
    }

    function getDate(key) {
        const value = getObject(key);

        return value === null
            ? null
            : new Date(value);
    }

    const PERIOD_DURATION = 30;
    const MAX_STAT_LEVEL = 100;
    const DECREASE_SPEED = MAX_STAT_LEVEL / PERIOD_DURATION;
    const REGEN_RATE = 3;

    window.hrundel = {
        get mood() {
            return this.getStatValue('games');
        },

        get food() {
            return this.getStatValue('feedings');
        },


        get energy() {
            return this.getStatValue('naps');
        },

        get bornDate() {
            return getDate('bornDate');
        },

        get isAlive() {
            return [this.energy, this.food, this.mood].filter(x => x === 0).length < 2;
        },

        getStatValue(periodCollectionName) {
            return this.getStatScale(periodCollectionName)(this.age);
        },
        getStatScale(periodCollectionName) {
            const X = [0];
            const Y = [MAX_STAT_LEVEL];
            const endPeriod = this.endPeriod;

            function pushPoint(x, y) {
                X.push(x);
                Y.push(y);
            }


            function addPoint(x, k) {
                const x0 = X[X.length - 1];
                const b = Y[Y.length - 1];
                const y = Number((k * (x - x0) + b).toFixed(5));

                function boundTo(yValue) {
                    const xRoot = (yValue + k * x0 - b) / k;
                    pushPoint(xRoot, yValue);
                    pushPoint(x, yValue);

                    return xRoot;
                }

                if (y < 0) {
                    boundTo(0);
                } else if (y > MAX_STAT_LEVEL) {
                    const xRoot = boundTo(MAX_STAT_LEVEL);
                    endPeriod(periodCollectionName, xRoot);
                } else {
                    pushPoint(x, y);
                }

            }

            const periods = getObject(periodCollectionName);
            if (!periods) {
                periods.forEach(period => {
                    const start = period[0];
                    const end = period[1] || this.age;
                    addPoint(start, -DECREASE_SPEED);
                    addPoint(end, DECREASE_SPEED * REGEN_RATE);
                });
            }

            if (periods.length === 0 || periods[periods.length - 1].length !== 1) {
                addPoint(this.age, -DECREASE_SPEED);
            }

            return polylinearScale(X, Y);
        },

        set bornDate(value) {
            setDate('bornDate', value);
        },

        get age() {
            return (new Date() - this.bornDate) / 1000;
        },

        startNap() {
            this.endFeeding();
            this.endGame();
            this.startPeriod('naps');
        },

        endNap() {
            this.endPeriod('naps');
        },


        startFeeding() {
            this.endGame();
            this.startPeriod('feedings');
        },

        endFeeding() {
            this.endPeriod('feedings');
        },


        startGame() {
            this.startPeriod('games');
        },

        endGame() {
            this.endPeriod('games');
        },

        startPeriod(collectionName) {
            const periods = getObject(collectionName);
            const lastPeriod = periods[periods.length - 1];
            if (!lastPeriod || lastPeriod.length !== 1) {
                periods.push([this.age]);
                setObject(collectionName, periods);
            }
        },

        endPeriod(collectionName, when) {
            const periods = getObject(collectionName);
            const lastPeriod = periods[periods.length - 1];
            if (lastPeriod && lastPeriod.length === 1) {
                lastPeriod.push(when || this.age);
                setObject(collectionName, periods);
            }
        },

        reborn() {
            this.bornDate = new Date();
            setObject('naps', []);
            setObject('games', []);
            setObject('feedings', []);
        }

    };


}());
