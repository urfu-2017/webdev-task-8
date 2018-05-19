(function () {


    const { hruStorage, ScaleBuilder } = window;

    const MAX_STAT_LEVEL = 100;
    const SECOND = 1;
    const MINUTE = 60 * SECOND;
    // const HOUR = 60 * MINUTE;
    // const DAY = 24 * HOUR;
    const decreaseSpeedConfig = {
        'games': MAX_STAT_LEVEL / (3 * MINUTE),
        'feedings': MAX_STAT_LEVEL / (2 * MINUTE),
        'naps': MAX_STAT_LEVEL / (2.5 * MINUTE)
    };
    const REGEN_RATE = 3;

    const scaleBuilderInstance = new ScaleBuilder(
        { MAX_STAT_LEVEL, REGEN_RATE, decreaseSpeedConfig });
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
            return hruStorage.getDate('bornDate');
        },

        get isAlive() {
            return [this.energy, this.food, this.mood].filter(x => x === 0).length < 2;
        },

        get scaleBuilder() {
            return scaleBuilderInstance;
        },

        getStatValue(periodCollectionName) {
            return scaleBuilderInstance.getStatScale(periodCollectionName)(this.age);
        },


        set bornDate(value) {
            hruStorage.setDate('bornDate', value);
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
            const periods = hruStorage.getObject(collectionName);
            const lastPeriod = periods[periods.length - 1];
            if (!lastPeriod || lastPeriod.length !== 1) {
                periods.push([this.age]);
                hruStorage.setObject(collectionName, periods);
            }
        },

        endPeriod(collectionName, when) {
            const periods = hruStorage.getObject(collectionName);
            const lastPeriod = periods[periods.length - 1];
            if (lastPeriod && lastPeriod.length === 1) {
                lastPeriod.push(when || this.age);
                hruStorage.setObject(collectionName, periods);
            }
        },

        reborn() {
            this.bornDate = new Date();
            hruStorage.setObject('naps', []);
            hruStorage.setObject('games', []);
            hruStorage.setObject('feedings', []);
        }
    };
    if (hruStorage.getObject('naps') === null ||
        hruStorage.getObject('games') === null ||
        hruStorage.getObject('feedings') === null ||
        hruStorage.getDate('bornDate') === null) {
        window.hrundel.reborn();
    }
}());
