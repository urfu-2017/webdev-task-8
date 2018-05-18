let DOM;

/* eslint-disable no-undef */
class Game {
    constructor() {
        this.init();
    }

    init(hrun = Hrun.tryLoad()) {
        this.hrun = hrun;
        this.drawer = new HrunDrawer();

        this._updateProps();
        setInterval(() => this._updateProps(), Hrun.CYCLE_INTERVAL);

        this._trackBattery();
        this._initNotifier();
        this._initSpeechRecognizer();
    }

    _updateProps() {
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
                // stopListening();

                this.hrun.startSleeping();
                this.drawer.startSleeping();
            } else {
                // if (HRUN.shouldDie()) {
                //     return;
                // }

                this.hrun.stopSleeping();
                this.drawer.stopSleeping();
            }
        });
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
                // stopListening();

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

    // Notifications

    _initNotifier() {
        const Notification = window.Notification || window.webkitNotification;

        if (Notification) {
            Notification.requestPermission(() => this._handleHiding());
            this.Notification = Notification;

            setInterval(() => this._notifyIfNeeded(), Hrun.CYCLE_INTERVAL * 100);
        }
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

    _initSpeechRecognizer() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (SpeechRecognition) {
            this.speechRecognizer = new SpeechRecognition();
            this.speechRecognizer.lang = 'ru-RU';
            this.speechRecognizer.continuous = true;

            this.speechRecognizer.onstart = () => {
                this.hrun.calm();
                this.hrun.startCommunicating();
            };

            this.speechRecognizer.onresult = event => {
                const index = event.resultIndex;
                const result = event.results[index][0].transcript.trim();

                DOM.recognizedText.innerText = result;
            };

            this.speechRecognizer.onerror = error => {
                this.hrun.calm();
                console.error(error);
            };

            DOM.getHrunBody().onclick = () => {
                this.speechRecognizer.start();
            };
        }
    }

    _stopListening() {
        LISTENER.stop();
        HRUN._action = 'rest';
    }

    save() {
        this.hrun.save();
    }

    reset() {
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
        getHrunBody: () => document.querySelector('.hrun-shape__body'),
        recognizedText: document.querySelector('.recognized-text'),
        buttons: {
            feed: document.querySelector('.buttons__feed'),
            reset: document.querySelector('.buttons__reset')
        }
    };

    const hrunogochi = new Game();
    hrunogochi.run();

    DOM.buttons.reset.onclick = () => hrunogochi.reset();

    window.onunload = () => hrunogochi.save();
}

window.onload = main;
