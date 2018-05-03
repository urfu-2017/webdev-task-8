class GameState {
    constructor({ metrics, volume }) {
        this.metrics = metrics;
        this.volume = volume;
    }

    static load() {
        const serializedState = localStorage.getItem('state');
        const state = serializedState
            ? JSON.parse(serializedState)
            : {
                metrics: GameState.initialMetrics(),
                volume: 0.5
            };

        return new GameState(state);
    }

    save() {
        localStorage.setItem('state', JSON.stringify(this));
    }

    reset() {
        Object.assign(this.metrics, GameState.initialMetrics());
        this.save();
    }

    static initialMetrics() {
        return { satiety: 100, energy: 100, mood: 100 };
    }
}

class Controls {
    constructor() {
        this.hero = document.querySelector('.hero');
        this.phrase = document.querySelector('.phrase');
        this.metricsWrapper = document.querySelector('.metrics');
        this.metrics = {
            satiety: document.querySelector('.progress-satiety .progress__value'),
            energy: document.querySelector('.progress-energy .progress__value'),
            mood: document.querySelector('.progress-mood .progress__value')
        };
        this.btnFeed = document.querySelector('.btn-feed');
        this.btnRestart = document.querySelector('.btn-restart');
        this.volumeInput = document.querySelector('.volume__input');
    }

    update(hrundel) {
        this.updateMetrics(hrundel);
        this.updateVolume(hrundel.state.volume);
    }

    updateMetrics(hrundel) {
        this.metricsWrapper.hidden = !hrundel.alive;
        for (const metricName of Object.keys(hrundel.state.metrics)) {
            this.metrics[metricName].textContent = `${hrundel.state.metrics[metricName]}%`;
        }
    }

    updateVolume(volume) {
        this.volumeInput.value = volume;
    }
}

class SoundsPlayer {
    constructor() {
        this._volume = 0.5;
        this.started = false;
    }

    start() {
        if (!window.Audio || this.started) {
            return;
        }
        this.started = true;
        this._scheduleNext();
    }

    stop() {
        if (!this.started) {
            return;
        }
        this.started = false;
        if (this._timer) {
            clearTimeout(this._timer);
        }
    }

    set volume(value) {
        this._volume = value;
        if (this._audio) {
            this._audio.volume = value;
        }
    }

    _scheduleNext() {
        if (!this.started) {
            return;
        }
        let delay = Math.floor(Math.random() * 10000) + 3000;
        this._timer = setTimeout(this._playSound.bind(this), delay);
    }

    _playSound() {
        let soundIndex = Math.floor(Math.random() * 4) + 1;
        this._audio = new Audio(`./sounds/${soundIndex}.mp3`);
        this._audio.volume = Math.pow(this._volume, 4);
        try {
            this._audio.play();
        } catch (e) {
            console.error(e);
            this._scheduleNext();
        }
        this._audio.onended = this._scheduleNext.bind(this);
    }
}

class SpeechRecognizer {
    constructor() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            this.recognizer = new SpeechRecognition();
            this.recognizer.lang = 'ru-RU';
            this.recognizer.continuous = true;
        }
        this.started = false;
    }

    get available() {
        return Boolean(this.recognizer);
    }

    start() {
        if (!this.started) {
            this.recognizer.start();
            this.started = true;
        }
    }

    stop() {
        if (this.started) {
            this.recognizer.stop();
            this.started = false;
        }
    }
}

class Notification {
    constructor() {
        this.Notification = window.Notification || window.webkitNotification;
        if (this.Notification) {
            this.Notification.requestPermission();
        }
    }

    spawn(message) {
        if (this.Notification && this.Notification.permission === 'granted') {
            // eslint-disable-next-line no-new
            new this.Notification(message, { icon: './images/hrundel.png' });
        }
    }
}

class Animations {
    constructor() {
        this.reset();
        this._active = {};
        this._scheduled = {};
    }

    reset() {
        // eslint-disable-next-line no-undef, new-cap
        this.snap = Snap('.hero');
        const s = this.snap;
        this.background = s.circle(100, 100, 100).attr({ fill: '#508097' });

        this.leftEar =
            s.group(
                s.path('M 40 70 L 32 32 L 70 40').attr({ fill: '#df9396' }),
                s.path('M 43 61 L 38 38 L 61 43').attr({ fill: '#ae706e' })
            );

        this.rightEar =
            s.group(
                s.path('M 160 70 L 168 32 L 130 40').attr({ fill: '#df9396' }),
                s.path('M 157 61 L 162 38 L 139 43').attr({ fill: '#ae706e' })
            );

        this.shout = s.circle(100, 100, 70).attr({ fill: '#df9396' });

        this.eyes = [
            s.circle(70, 100, 7),
            s.circle(130, 100, 7)
        ];

        this.nose = s.group(
            s.circle(100, 130, 28).attr({ fill: '#ecc5c4' }),
            s.circle(90, 132, 7).attr({ fill: '#a86f70' }),
            s.circle(110, 132, 7).attr({ fill: '#a86f70' }),
        );
    }

    animateSleep(active) {
        this.eyes.forEach(eye => eye.attr({ r: active ? 7 : 2 }));
        this._animateEyes(active ? 2 : 7);
    }

    animateFeed(active) {
        this._controlledAnimation('feed', next => {
            this.nose.animate({ transform: 't0,5' }, 1600, Animations._backForth, next);
        })(active);
    }

    animateCommunication(active) {
        this._controlledAnimation('communication', next => {
            this.leftEar.animate({ transform: 't3,3;r10' }, 2000, Animations._backForth);
            this.rightEar.animate(
                { transform: 't-3,3;r-10' }, 2000, Animations._backForth, next);
        })(active);
    }

    animateDeath(time = 1000) {
        this._active.feed = false;
        this._active.communication = false;
        this.eyes.forEach(eye => {
            eye.attr('fill', '#ff0000');
            eye.animate({ r: 2 }, time);
        });

        // eslint-disable-next-line no-undef
        Snap.animate(
            [223, 147, 150],
            [100, 100, 100],
            val => this.shout.attr('fill', `rgb(${val.join(',')})`),
            time);
    }

    _controlledAnimation(name, animation) {
        return (active) => {
            this._active[name] = active;
            if (this._scheduled[name]) {
                return;
            }
            const animateNext = () => {
                this._scheduled[name] = false;
                if (this._active[name]) {
                    this._scheduled[name] = true;
                    animation(animateNext);
                }
            };
            animateNext();
        };
    }

    _animateEyes(r) {
        this.eyes.forEach(eye => eye.animate({ r }, 1000));
    }

    static _backForth(n) {
        if (n < 0.5) {
            return 2 * n;
        }
        n -= 0.5;

        return 1 - 2 * n;
    }
}

const initialDeltas = {
    satiety: -1,
    energy: -1,
    mood: -1
};

const increaseMultiplier = 3;

// eslint-disable-next-line no-undef
class Hrundel extends EventEmitter {
    constructor() {
        super();
        this.state = GameState.load();
        this.activity = null;
        this._deltas = Object.assign({}, initialDeltas);
        this._activitiesSetters = {
            'satiety': this.setFeed,
            'mood': this.setCommunication,
            'energy': this.setSleep
        };
    }

    start() {
        if (!this.alive) {
            return;
        }
        this.stop();
        this._timer = setInterval(this._onTimer.bind(this), 1000);
        this.emitEvent('started');
    }

    stop() {
        if (this._timer) {
            clearInterval(this._timer);
        }
    }

    restart() {
        Object.assign(this._deltas, initialDeltas);
        this.state.reset();
        this.emitEvent('metricsChanged');
        this.emitEvent('activityChanged');
        this.start();
    }

    setCommunication(active) {
        if (!this.alive) {
            return;
        }
        if (active && this.activity && this.activity !== 'communication') {
            return false;
        }
        this._setActivity('communication', active);

        return true;
    }

    setFeed(active) {
        if (!this.alive) {
            return;
        }
        if (active && this.activity === 'sleep') {
            return false;
        }
        this._setMetricGrowth('satiety', active);
        this._setActivity('feed', active);

        return true;
    }

    setSleep(active) {
        if (!this.alive) {
            return;
        }
        if (active) {
            this._setMetricGrowth('satiety', false);
            this._setMetricGrowth('mood', false);
        }
        this._setMetricGrowth('energy', active);
        this._setActivity('sleep', active);
    }

    increaseMetric(metricName, multiplier) {
        this.state.metrics[metricName] +=
            -initialDeltas[metricName] * increaseMultiplier * multiplier;
    }

    get alive() {
        return Object.values(this.state.metrics).filter(metric => metric === 0).length < 2;
    }

    _setActivity(activityName, isActive) {
        const previousActivity = this.activity;
        if (isActive) {
            this.activity = activityName;
        } else if (this.activity === activityName) {
            this.activity = null;
        }
        if (this.activity !== previousActivity) {
            this.emitEvent('activityChanged', [previousActivity]);
        }
    }

    _setMetricGrowth(metricName, positiveDirection) {
        this._deltas[metricName] = positiveDirection
            ? -initialDeltas[metricName] * increaseMultiplier
            : initialDeltas[metricName];
    }

    _onTimer() {
        for (const [metricName, delta] of Object.entries(this._deltas)) {
            const newValue = this.state.metrics[metricName] + delta;
            this.state.metrics[metricName] = Math.min(Math.max(0, newValue), 100);
            if (this.state.metrics[metricName] === 100) {
                this._activitiesSetters[metricName].call(this, false);
            }
            this.state.save();
        }
        this.emitEvent('metricsChanged');

        if (!this.alive) {
            this.emitEvent('died');
            this.stop();
        }
    }
}

function setupSatietyImpacts(hrundel, controls) {
    if (navigator.getBattery) {
        navigator.getBattery().then(battery => {

            const updateFeed = () => hrundel.setFeed(battery.charging);

            updateFeed();
            battery.addEventListener('chargingchange', updateFeed);
            hrundel.on('activityChanged', () => {
                updateFeed();
            });
        });
    } else {
        controls.btnFeed.hidden = false;

        let resetFeedTimer;
        controls.btnFeed.addEventListener('click', () => {
            if (!hrundel.setFeed(true)) {
                return;
            }
            if (resetFeedTimer) {
                clearTimeout(resetFeedTimer);
            }
            resetFeedTimer = setTimeout(() => {
                hrundel.setFeed(false);
            }, 5000);
        });
    }
}

function setupEnergyImpacts(hrundel) {
    if (typeof document.hidden !== 'undefined') {
        document.addEventListener('visibilitychange', () => {
            hrundel.setSleep(document.hidden);
        });
    }

    const AmbientLightSensor = window.AmbientLightSensor;
    if (AmbientLightSensor) {
        const sensor = new AmbientLightSensor();

        const illuminanceUpdated = () => {
            if (sensor.illuminance < 10) {
                hrundel.setSleep(false);
            }
        };

        illuminanceUpdated();
        sensor.addEventListener('reading', illuminanceUpdated);
        sensor.start();
    }
}

function setupMoodImpacts(hrundel, controls) {
    const recognizer = new SpeechRecognizer();
    if (!recognizer.available) {
        return;
    }
    recognizer.recognizer.addEventListener('result', event => {
        const index = event.resultIndex;
        const result = event.results[index][0].transcript.trim();
        const weight = Array.from(result).filter(char => char === ' ').length * 2 + 2;

        hrundel.increaseMetric('mood', weight);
        controls.phrase.textContent = result;
    });

    controls.hero.addEventListener('click', () => {
        if (hrundel.setCommunication(true)) {
            recognizer.start();
        }
    });

    hrundel.on('activityChanged', () => {
        if (hrundel.activity !== 'communication') {
            recognizer.stop();
        }
    });
}

function setupSounds(hrundel, controls) {
    const player = new SoundsPlayer();

    controls.volumeInput.addEventListener('change', () => {
        hrundel.state.volume = controls.volumeInput.value;
        hrundel.state.save();
        player.volume = hrundel.state.volume;
    });

    hrundel.on('metricsChanged', () => {
        if (hrundel.alive) {
            player.start();
        } else {
            player.stop();
        }
    });
}

function setupAnimations(hrundel) {
    const animations = new Animations();

    hrundel.on('activityChanged', previousActivity => {
        animations.animateFeed(hrundel.activity === 'feed');
        animations.animateCommunication(hrundel.activity === 'communication');
        if (previousActivity === 'sleep' || hrundel.activity === 'sleep') {
            animations.animateSleep(hrundel.activity === 'sleep');
        }
    });

    hrundel.on('died', () => {
        animations.animateDeath();
    });

    hrundel.on('started', () => {
        animations.reset();
    });

    if (!hrundel.alive) {
        animations.animateDeath(0);
    }
}

function setupNotifications(hrundel) {
    const notification = new Notification();

    let lastMetrics = GameState.initialMetrics();

    hrundel.on('metricsChanged', () => {
        if (!hrundel.alive) {
            return;
        }

        if (hrundel.state.metrics.satiety < 10 && lastMetrics.satiety >= 10) {
            notification.spawn('I\'m hungry');
        }
        if (hrundel.state.metrics.mood < 10 && lastMetrics.mood >= 10) {
            notification.spawn('I\'m bored :(');
        }

        lastMetrics = Object.assign({}, hrundel.state.metrics);
    });
}

window.addEventListener('load', () => {
    const hrundel = new Hrundel();
    const controls = new Controls();
    controls.update(hrundel);

    setupSatietyImpacts(hrundel, controls);
    setupEnergyImpacts(hrundel);
    setupMoodImpacts(hrundel, controls);

    setupSounds(hrundel, controls);
    setupAnimations(hrundel);
    setupNotifications(hrundel);

    hrundel.on('metricsChanged', () => {
        controls.updateMetrics(hrundel);
    });

    controls.btnRestart.addEventListener('click', hrundel.restart.bind(hrundel));

    hrundel.start();
});

