import States from './states';
import Hrun from './hrun';
import { UpdateUIEvent, createWarningEvent, GameOverEvent } from './events';

export class Game {
    constructor(root) {
        this.root = root;
        this.states = new States();
        this.hrun = new Hrun('#hrun');

        this.isSleeping = false;
        this.isFeeding = false;
        this.isGetHappy = false;

        this.isAlive = true;

        this.linkEvents();
    }

    onSleepingChange({ state }) {
        if (this.isAlive) {
            this.isSleeping = !state;

            // Анимация на то чтобы проснуться
            this.hrun.setSleepState(this.isSleeping);
        }
    }

    onFeedingChange({ feedState }) {
        if (this.isAlive) {
            this.isFeeding = feedState;
        }
    }

    onGetFood() {
        if (this.isAlive) {
            this.states.satiety.value += 1;
            this.root.dispatchEvent(UpdateUIEvent);
        }
    }

    onListening({ isListening }) {
        if (this.isAlive) {
            this.isGetHappy = isListening;
        }
    }

    linkEvents() {
        this.root.addEventListener('window:changeState', e => {
            this.onSleepingChange(e.detail);
        });
        this.root.addEventListener('game:feed', e => {
            this.onFeedingChange(e.detail);
        });
        this.root.addEventListener('game:getFood', () => {
            this.onGetFood();
        });
        this.root.addEventListener('game:listening', (e) => {
            this.hrun.say();

            this.onListening(e.detail);
        });
    }

    checkIsDeath() {
        const { isDeath } = this.states;
        if (isDeath) {
            this.gameOver();
            this.root.dispatchEvent(GameOverEvent);
        }

        return isDeath;
    }

    checkisWarning() {
        const warningStates = this.states.warningStates;
        if (warningStates.length > 0) {
            this.root.dispatchEvent(createWarningEvent(warningStates));
        }
    }

    handleStates() {
        if (this.isSleeping) {
            this.states.energy.value += 3;
        } else {
            this.states.energy.value -= 1;
        }

        if (this.isFeeding) {
            this.states.satiety.value += 3;
        } else {
            this.states.satiety.value -= 1;
        }

        if (this.isGetHappy) {
            this.states.happy.value += 3;
        } else {
            this.states.happy.value -= 1;
        }
    }

    loop() {
        if (this.checkIsDeath()) {
            return;
        }

        this.handleStates();

        this.root.dispatchEvent(UpdateUIEvent);
    }

    newGame() {
        this.states.reset();
        this.isAlive = true;

        if (!this.loopInterval) {
            this.runLoop();
        }

        this.root.dispatchEvent(UpdateUIEvent);
    }

    gameOver() {
        this.isAlive = false;
        this.hrun.death();

        clearInterval(this.loopInterval);
        this.loopInterval = null;
    }

    runLoop() {
        this.hrun.draw();

        this.loop();
        this.loopInterval = setInterval(this.loop.bind(this), 1000);
    }

    run() {
        this.runLoop();
    }
}
