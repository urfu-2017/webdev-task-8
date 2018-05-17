/* eslint-disable no-new,no-invalid-this */
import Tamagochi from './tamagotchi';
import State from './stats';
import { getWorldData } from '../world';
import updateUi from '../view/ui';

if ('Notification' in window) {
    Notification.requestPermission();
}

const TICK_INTERVAL = 100;

export default class GameLoop {
    constructor(viewFactory) {
        this.viewFactory = viewFactory;
        this.tamagotchi = Tamagochi.create(State.restore(), viewFactory());

        document.querySelector('.controls__feed')
            .addEventListener('click', () => {
                this.tamagotchi.forceFeed();
            });
        document.querySelector('.controls__start-anew')
            .addEventListener('click', () => {
                this.startAnew();
            });
    }

    startAnew() {
        this.tamagotchi = Tamagochi.create(State.createNew(), this.viewFactory());
    }

    run() {
        this._nextTick();
    }

    stop() {
        clearTimeout(this.task);
    }

    _nextTick() {
        this.tick();
        this.task = setTimeout(this._nextTick.bind(this), TICK_INTERVAL);
    }

    tick() {
        const worldData = getWorldData();
        this.tamagotchi.handleTick(worldData);
        updateUi(this.tamagotchi.stats.stats, worldData.text);
        this._notify();
    }

    _notify() {
        const text = this.tamagotchi.notificationText;
        if (!text || document.hasFocus()) {
            return;
        }

        if ('Notification' in window) {
            new Notification(text);
        }
    }
}
