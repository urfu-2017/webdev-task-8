let DOM;

/* eslint-disable no-undef */
class Game {
    constructor() {
        this.init();

        this._initNotifier();
        this._initSound();
        this._trackBattery();
        this._trackSpeech();
        this._trackLight();
        this._handleHiding();
    }

    init(hrun = Hrun.tryLoad()) {
        this.hrun = hrun;
        this.drawer = new HrunDrawer();

        this._update();
        this.updateInterval = setInterval(() => this._update(), Hrun.CYCLE_INTERVAL);
    }

    _update() {
        this._renderProps();

        if (this.hrun.died) {
            this._die();
        }
    }

    _renderProps() {
        DOM.info.satiety.innerHTML = this.hrun.satiety;
        DOM.info.energy.innerHTML = this.hrun.energy;
        DOM.info.mood.innerHTML = this.hrun.mood;
    }

    _enableFeedButton() {
        DOM.buttons.feed.style.display = 'block';
    }

    _handleHiding() {
        let hidden;
        let event;

        if (document.webkitHidden) {
            event = 'webkitvisibilitychange';
            hidden = () => document.webkitHidden;
        } else if (document.msHidden) {
            event = 'msvisibilitychange';
            hidden = () => document.msHidden;
        } else {
            event = 'visibilitychange';
            hidden = () => document.hidden;
        }

        document.addEventListener(event, () => {
            if (hidden()) {
                this._stopSpeechRecognizer();

                this.hrun.startSleeping();
                this.drawer.startSleeping();
            } else {
                this.hrun.stopSleeping();
                this.drawer.stopSleeping();
            }
        });
    }

    // Notifications

    async _initNotifier() {
        const Notification = window.Notification || window.webkitNotification;

        if (!Notification) {
            return;
        }

        const permission = await Notification.requestPermission();

        if (permission === 'denied') {
            return;
        }

        this.Notification = Notification;

        this.notificationInterval =
            setInterval(() => this._notifyIfNeeded(), Hrun.CYCLE_INTERVAL * 10);
    }

    _notifyIfNeeded() {
        if (!this.hrun.active) {
            if (this.hrun.satiety < Hrun.LIMITS.satiety * 0.1) {
                this._notify('Покорми меня!');
            }
            if (this.hrun.mood < Hrun.LIMITS.mood * 0.1) {
                this._notify('Поиграй со мной!');
            }
        }
    }

    _notify(body) {
        const notification = new this.Notification('Хрюногочи', { body });
        notification.onerror = console.error;
    }

    // Speech Recognition

    _trackSpeech() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (SpeechRecognition) {
            this.speechRecognizer = new SpeechRecognition();
            this.speechRecognizer.lang = 'ru-RU';
            this.speechRecognizer.continuous = true;

            this.speechRecognizer.onstart = () => {
                this.hrun.startCommunicating();
                this.drawer.startCommunicating();
            };

            this.speechRecognizer.onresult = event => {
                if (this.hrun.mood === Hrun.LIMITS.mood) {
                    this._stopSpeechRecognizer();
                }

                const index = event.resultIndex;
                const result = event.results[index][0].transcript.trim();

                DOM.recognizedText.innerText = result;
            };

            this.speechRecognizer.onend = () => {
                this.hrun.stopCommunicating();
                this.drawer.stopCommunicating();
            };

            this.speechRecognizer.onerror = error => {
                this.hrun.stopCommunicating();
                this.drawer.stopCommunicating();
                console.error(error);
            };

            DOM.hrun.addEventListener('click', () => {
                this.speechRecognizer.start();
            });
        }
    }

    _stopSpeechRecognizer() {
        this.speechRecognizer.stop();
        this.hrun.calm();
    }


    // Battery

    async _trackBattery() {
        if (!navigator.getBattery) {
            this._enableFeedButton();

            return;
        }

        const battery = await navigator.getBattery();

        const checkBattery = () => {
            if (battery.charging) {
                this._stopSpeechRecognizer();

                this.hrun.startEating();
                this.drawer.startEating();
            } else {
                this.hrun.stopEating();
                this.drawer.stopEating();
            }
        };

        checkBattery();
        battery.addEventListener('chargingchange', checkBattery);
    }

    // Ambilight

    _trackLight() {
        if ('AmbientLightSensor' in window) {
            var sensor = new AmbientLightSensor();

            sensor.addEventListener('reading', () => {
                if (sensor.illuminance < 20) {
                    this.hrun.startSleeping();
                    this.drawer.startSleeping();
                } else if (this.hrun.sleeping) {
                    this.hrun.stopSleeping();
                    this.drawer.stopSleeping();
                }
            });

            sensor.start();
        }
    }

    // Sound

    get volume() {
        return DOM.volumeInput.value;
    }

    _initSound() {
        if (window.Audio) {
            this._scheduleSound();
        }
    }

    _scheduleSound(timeout = null) {
        if (this.hrun.active) {
            const path = './sounds/hru.mp3';

            this.soundTimeout = setTimeout(
                () => {
                    if (this.hrun.active) {
                        this._playSound(path);
                    }

                    this._scheduleSound();
                },
                timeout || Math.floor(2500 + Math.random() * 5000)
            );
        }
    }

    _playSound(path) {
        const audio = new Audio(path);
        audio.volume = this.volume;
        audio.play();
    }

    _die() {
        clearInterval(this.updateInterval);
        clearInterval(this.notificationInterval);
        clearTimeout(this.soundTimeout);

        this._playSound('./sounds/dimon.mp3');

        this.drawer.die();
    }

    save() {
        this.hrun.save();
    }

    reset() {
        clearInterval(this.updateInterval);
        clearInterval(this.notificationInterval);
        clearTimeout(this.soundTimeout);

        this.init(new Hrun());
    }

    run() {
        return;
    }
}
/* eslint-enable no-undef */

function main() {
    DOM = {
        info: {
            satiety: document.querySelector('.satiety-value'),
            energy: document.querySelector('.energy-value'),
            mood: document.querySelector('.mood-value')
        },
        hrun: document.querySelector('.hrun-shape'),
        recognizedText: document.querySelector('.recognized-text'),
        buttons: {
            feed: document.querySelector('.buttons__feed'),
            reset: document.querySelector('.buttons__reset')
        },
        volumeInput: document.querySelector('.volume__input')
    };

    const hrunogochi = new Game();
    hrunogochi.run();

    DOM.buttons.reset.onclick = () => hrunogochi.reset();

    window.onunload = () => hrunogochi.save();
}

window.onload = main;
