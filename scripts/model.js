import Recognition from './speech-recognition';
import { htmlSpeech } from './view';

export const states = {
    IDLE: 'IDLE',
    DIE: 'DIE',
    SLEEPING: 'SLEEPING',
    EATING: 'EATING',
    SPEAKING: 'SPEAKING'
};

const setupAmbientSensor = listener => {
    if ('AmbientLightSensor' in window) {
        const sensor = new AmbientLightSensor(); // eslint-disable-line
        sensor.addEventListener('reading', () => listener(sensor.illuminance));
        sensor.start();
    } else if ('ondevicelight' in window) {
        window.addEventListener('devicelight', e => listener(e.value));
    }
};

export class Hrundel {
    static notify(message) {
        new Notification(message); // eslint-disable-line
    }

    constructor(state, callback) {
        this.callback = callback;
        this.setState(state);
        this.normalizeState();
        this.callback(this);
        this.setupRecognition();

        window.onfocus = () => this.state.delete(states.SLEEPING);
        window.onblur = () => this.state.add(states.SLEEPING);
        window.navigator.getBattery().then(this.batteryListener.bind(this));
        setupAmbientSensor(this.ambientLightListener.bind(this));

        setInterval(this.changeState.bind(this), 1000);
    }

    setState({ satiety = 100, energy = 100, mood = 100 }) {
        this.state = new Set();
        this.satiety = satiety;
        this.energy = energy;
        this.mood = mood;
    }

    feed() {
        this.satiety += 10;
    }

    reset() {
        this.setState({});
    }

    batteryListener(battery) {
        if (battery.charging) {
            this.state.add(states.EATING);
        }

        battery.onchargingchange = () => {
            if (battery.charging) {
                this.state.add(states.EATING);
            } else {
                this.state.delete(states.EATING);
            }
        };
    }

    ambientLightListener(value) {
        if (value < 100) {
            this.state.add(states.SLEEPING);
        } else {
            this.state.delete(states.SLEEPING);
        }
    }

    setupRecognition() {
        let schedule = null;

        Recognition.onresult = e => {
            this.state.add(states.SPEAKING);
            htmlSpeech.innerHTML = e.results[e.resultIndex][0].transcript;
            clearTimeout(schedule);
            schedule = setTimeout(() => {
                this.state.delete(states.SPEAKING);
            }, 1000);
        };
    }

    changeState() {
        if (this.state.has(states.DIE)) {
            return;
        }

        this.energy -= 2;
        this.satiety -= 2;
        this.mood -= 4;

        if (this.state.has(states.SLEEPING)) {
            this.energy += 3;
        }

        if (this.state.has(states.EATING)) {
            this.satiety += 5;
        }

        if (this.state.has(states.SPEAKING)) {
            this.mood += 6;
        }

        this.normalizeState();
        this.notifyIfNeed();

        localStorage.setItem('hrundel', JSON.stringify(this));
        this.callback(this);
    }

    isAlive() {
        return this.satiety + this.energy !== 0 &&
        this.energy + this.mood !== 0 &&
        this.satiety + this.mood !== 0;
    }

    normalizeState() {
        ['satiety', 'energy', 'mood'].forEach(x => {
            this[x] = Math.max(0, this[x]);
            this[x] = Math.min(100, this[x]);
        });

        if (!this.isAlive()) {
            this.state.add(states.DIE);
        }
    }

    notifyIfNeed() {
        if (!document.hasFocus()) {
            if (this.mood === 10) {
                Hrundel.notify('Я соскучился, скоро умру.');
            }

            if (this.satiety === 10) {
                Hrundel.notify('Я проголодался! Дай пожрать!');
            }
        }
    }
}
