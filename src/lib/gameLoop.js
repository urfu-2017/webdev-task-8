/* eslint-disable no-new */
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
        this.tamagotchi = new Tamagochi(State.restore(), viewFactory());

        document.querySelector('.controls__feed')
            .onclick = () => this.tamagotchi.forceFeed();
        document.querySelector('.controls__start-anew')
            .onclick = this.startAnew.bind(this);
    }

    startAnew() {
        this.tamagotchi.view.clear();
        this.tamagotchi = new Tamagochi(State.createNew(), this.viewFactory());
    }

    run() {
        this._tickWrapper();
    }

    stop() {
        clearTimeout(this.task);
    }

    _tickWrapper() {
        this.tick();
        this.task = setTimeout(this._tickWrapper.bind(this), TICK_INTERVAL);
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

        new Notification(text);
    }
}
