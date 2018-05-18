import { EventEmitter } from 'events';
import StateStorage from './stateStorage';
import GameState from './gameState';

const messageTexts = [
    'эй давай играть',
    'человек, ты куда ушёл?',
    'И чего ты добиваешься?',
    'Это скорее теннисный матч',
    'Соседи, вызывайте милицию'
];

export default class Game extends EventEmitter {
    constructor() {
        super();
        this.timers = [];
        this.storage = new StateStorage();
        this.state = this.storage.load() || new GameState();
        this.deltas = this.getDefaultDeltas();
        this.isActive = true;
    }

    getDefaultDeltas() {
        return {
            satiety: -1,
            mood: -1,
            energy: -1
        };
    }

    start() {
        this.timers = [
            setInterval(this.tick.bind(this), 1500),
            setInterval(this.makeSomeNoise.bind(this), 15000)
        ];
        this.emit('start');
    }

    stop() {
        this.timers.forEach(timer => clearInterval(timer));
        this.timers = [];
    }

    reset() {
        this.storage.clear();
        this.state = new GameState();
        this.deltas = this.getDefaultDeltas();
        this.stop();
        this.start();
    }

    tick() {
        if (this.isDead()) {
            this.storage.clear();
            this.emit('death');
            this.stop();

            return;
        }
        this.state.energy = this._boundTo(this.state.energy + this.deltas.energy);
        this.state.satiety = this._boundTo(this.state.satiety + this.deltas.satiety);
        this.state.mood = this._boundTo(this.state.mood + this.deltas.mood);
        this.storage.save(this.state);
        this.emit('stateChanged');
        if (this.state.satiety === 10 && this.deltas.satiety === -1) {
            this.emit('hungry');
        }
        if (this.state.mood === 10 && this.deltas.mood === -1) {
            this.emit('bored');
        }
    }

    isDead() {
        return !(this.state.energy + this.state.satiety) ||
            !(this.state.energy + this.state.mood) ||
            !(this.state.satiety + this.state.mood);
    }

    sleep() {
        this.deltas = this.getDefaultDeltas();
        this.deltas.energy = 2;
        this.isActive = false;
        if (!this.isDead()) {
            this.emit('sleep');
        }
    }

    wakeUp() {
        this.deltas = this.getDefaultDeltas();
        this.isActive = true;
        if (!this.isDead()) {
            this.emit('wakeUp');
        }
    }

    startFeeding(charging) {
        this.deltas = this.getDefaultDeltas();
        if (charging) {
            this.deltas.satiety = 2;
            if (!this.isDead()) {
                this.emit('feed');
            }
        } else {
            this.emit('feedEnd');
        }
    }

    cheerUp(phrase) {
        this.deltas = this.getDefaultDeltas();
        this.state.mood = this._boundTo(this.state.mood + phrase.split(' ').length + 3);
    }

    makeSomeNoise() {
        if (!this.isActive && window.speechSynthesis && !this.isDead()) {
            const phrase = messageTexts[Math.floor(Math.random() * messageTexts.length)];
            const message = new SpeechSynthesisUtterance(phrase);
            message.pitch = 0;
            message.volume = document.querySelector('.volume__input').value;
            window.speechSynthesis.speak(message);
        }
    }

    _boundTo(value, left = 0, right = 100) {
        value = value < left ? left : value;
        value = value > right ? right : value;

        return value;
    }
}
