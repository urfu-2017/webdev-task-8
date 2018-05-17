import { ACTIONS } from './actions';


const DRAIN_RATE = -0.2;
const REFILL_RATE = 0.5;


export default class Tamagotchi {
    constructor(stats, view) {
        this.stats = stats;
        this.view = view;
        this.actions = new Set([ACTIONS.IDLE]);
    }

    handleTick(worldData) {
        if (this.actions.has(ACTIONS.DEAD)) {
            return;
        }
        const willSleep = worldData.night || worldData.leaving;
        const willEat = worldData.feeding;
        const willListen = worldData.talking;

        this._actionsHelper(willSleep, ACTIONS.SLEEP);
        this._actionsHelper(willEat && !willListen && !willSleep, ACTIONS.EAT);
        this._actionsHelper(willListen && !willSleep, ACTIONS.LISTEN);

        this._updateStats();
        this._updateActions();
        this._checkDeath();
        this._redraw();
    }

    forceFeed() {
        if (this.isDead) {
            return;
        }
        this.stats = this.stats.setStatsDelta({
            satiety: REFILL_RATE * 10
        });
    }

    get isDead() {
        return this.actions.has(ACTIONS.DEAD);
    }

    get notificationText() {
        if (this.alreadyNotified || this.isDead) {
            return null;
        }
        this.alreadyNotified = true;
        if (this.stats.spirit < 10) {
            return 'Мне скучно';
        }
        if (this.stats.satiety < 10) {
            return 'Я проголодался';
        }
        this.alreadyNotified = false;

        return null;
    }

    _updateStats() {
        const deltas = Object.keys(this.stats.stats)
            .reduce((acc, curr) => {
                acc[curr] = DRAIN_RATE;

                return acc;
            }, {});
        if (this.actions.has(ACTIONS.SLEEP)) {
            deltas.energy = REFILL_RATE;
        } else if (this.actions.has(ACTIONS.LISTEN)) {
            deltas.spirit = REFILL_RATE;
        } else if (this.actions.has(ACTIONS.EAT)) {
            deltas.satiety = REFILL_RATE;
        }

        this.stats = this.stats.setStatsDelta(deltas);
    }

    _updateActions() {
        if (this.stats.energy === 100) {
            this._actionsHelper(false, ACTIONS.SLEEP);
        }
        if (this.stats.satiety === 100) {
            this._actionsHelper(false, ACTIONS.EAT);
        }
        if (this.stats.spirit === 100) {
            this._actionsHelper(false, ACTIONS.LISTEN);
        }
    }

    _actionsHelper(clause, action) {
        if (clause) {
            this.actions.add(action);
        } else {
            this.actions.delete(action);
        }
    }

    _redraw() {
        let actualState = [
            ACTIONS.DEAD,
            ACTIONS.SLEEP,
            ACTIONS.LISTEN,
            ACTIONS.EAT,
            ACTIONS.IDLE
        ].find(action => this.actions.has(action));

        this.view.draw(actualState);
    }

    _checkDeath() {
        const pairSums = [
            this.stats.energy + this.stats.satiety,
            this.stats.energy + this.stats.spirit,
            this.stats.spirit + this.stats.satiety
        ];
        if (pairSums.some(s => s === 0)) {
            this.actions.add(ACTIONS.DEAD);
            this.stats = this.stats.setStatsDelta({
                energy: -100, satiety: -100, spirit: -100
            });
            document.querySelector('.audio')
                .play();

            return true;
        }

        return false;
    }
}
