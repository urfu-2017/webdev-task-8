const DECREASE_INTERVAL = 10000;
const INCREASE_INTERVAL = 4000;

let recognizedTextField;
let tamagotchiSvg;
let feedButton;
let resetButton;
let hunger;
let energy;
let happiness;

class Drawer {
    constructor() {
        // eslint-disable-next-line new-cap,no-undef
        this.snap = Snap('.tamagotchi__svg');
        this.makeHappy();
    }

    createText(text) {
        if (this.text) {
            this.text.remove();
        }

        this.text = this.snap.text(0, 100, text);
        this.text.attr({ 'font-size': 75, 'font-family': 'monospace' });
        this.text.transform('r90');
    }

    makeHappy() {
        this.createText(':-)');
    }

    makeOk() {
        this.createText(':-|');
    }

    makeSad() {
        this.createText(':-(');
    }

    makeDead() {
        this.createText(':-X');
    }
}

class Tamagotchi {
    constructor() {
        if (!this.tryInitStateFromCookies()) {
            this.initDefault();
        }

        this._drawer = new Drawer();
        this.redrawFace();
        resetButton.onclick = () => this.reset();

        if (!initBattery(this)) {
            this.enableFeedButton();
        }
        initLight(this);
        initTabSwitcher(this);
        this._voice = initSounds(this);
        this._notifier = initNotification(this);
        this._recognizer = initSpeechRecognition(this);
    }

    initDefault() {
        this._energy = 100;
        this._hunger = 100;
        this._happiness = 100;
        this._volumeLevel = 50;
        this.update();
    }

    enableFeedButton() {
        feedButton.style.display = 'block';
        feedButton.onclick = () => {
            this.hunger += 10;
        };
    }

    get isDead() {
        return this._energy <= 0 && this._happiness <= 0 ||
            this._happiness <= 0 && this._hunger <= 0 ||
            this._hunger <= 0 && this._energy <= 0;
    }

    get energy() {
        return this._energy;
    }

    get hunger() {
        return this._hunger;
    }

    get happiness() {
        return this._happiness;
    }

    set energy(val) {
        this._energy = Math.min(100, val);
        this.update();
        this._save();
    }

    set happiness(val) {
        this._happiness = Math.min(100, val);
        this.update();
        this._save();
    }

    set hunger(val) {
        this._hunger = Math.min(100, val);
        this.update();
        this._save();
    }

    anyLess(val) {
        return this._energy <= val ||
            this._happiness <= val ||
            this._hunger <= val;
    }

    update() {
        hunger.innerHTML = this.hunger;
        happiness.innerHTML = this.happiness;
        energy.innerHTML = this.energy;
    }

    _save() {
        const value = [this._energy, this._happiness, this._hunger, this._volumeLevel].join('|');
        document.cookie = `state=${value}`;
    }

    sleep() {
        this._sleepId = setInterval(() => {
            this.energy++;
            if (this.energy === 100) {
                clearInterval(this._sleepId);
            }
        }, INCREASE_INTERVAL);
    }

    wakeUp() {
        if (this._sleepId) {
            clearInterval(this._sleepId);
        }
    }

    hear() {
        this._hearId = setInterval(() => {
            this.happiness++;
            if (this.happiness === 100) {
                this.stopHearing();
            }
        }, INCREASE_INTERVAL);
    }

    stopHearing() {
        clearInterval(this._hearId);
    }

    _decrease() {
        this.energy--;
        this.happiness--;
        this.hunger--;
    }

    reset() {
        if (this._gameId) {
            clearInterval(this._gameId);
        }

        this.happiness = 100;
        this.hunger = 100;
        this.energy = 100;

        this.run();
    }

    run() {
        this._gameId = setInterval(() => {
            if (this.isDead) {
                this._drawer.makeDead();

                return;
            }
            this.redrawFace();
            this._decrease();
            if (this.happiness <= 10 || this.hunger <= 10) {
                this._makeNotification();
            }
            if (this.happiness === 100) {
                this._recognizer.stop();

                return;
            }
            if (Math.floor(Math.random())) {
                this._voice();
            }
        }, DECREASE_INTERVAL);
    }

    redrawFace() {
        if (this.anyLess(20)) {
            this._drawer.makeSad();

            return;
        }
        if (this.anyLess(60)) {
            this._drawer.makeOk();

            return;
        }
        this._drawer.makeHappy();
    }

    _makeNotification() {
        let message = '';
        if (this.happiness <= 10) {
            message = 'мне скучно';
        }
        if (this.hunger <= 10) {
            message = message ? message + ' и ' : message;
            message += 'я проголодался';
        }
        this._notifier(message);
    }

    tryInitStateFromCookies() {
        const re = /state=(\d+)\|(\d+)\|(\d+)\|(\d+)/gm;
        const match = re.exec(document.cookie);
        if (match) {
            try {
                this._energy = match[1];
                this._happiness = match[2];
                this._hunger = match[3];
                this._volumeLevel = match[4];
                this.update();

                return true;
            } catch (e) {
                return false;
            }
        }

        return false;
    }
}

async function initBattery(tamagotchi) {
    if (navigator.getBattery) {
        const battery = await navigator.getBattery();

        setInterval(() => {
            if (battery.charging) {
                tamagotchi.hunger++;
            }
        }, INCREASE_INTERVAL);

        return true;
    }

    return false;
}

function initLight(tamagotchi) {
    if ('AmbientLightSensor' in window) {
        const sensor = new AmbientLightSensor(); // eslint-disable-line

        sensor.addEventListener('reading', () => {
            if (sensor.illuminance < 20) {
                tamagotchi.sleep();
            } else {
                tamagotchi.wakeUp();
            }
        });
    }
}

function initTabSwitcher(tamagotchi) {
    document.onvisibilitychange = function () {
        if (document.visibilityState === 'hidden') {
            tamagotchi.sleep();
        }
        if (document.visibilityState === 'visible') {
            tamagotchi.wakeUp();
        }
    };
}

function initSounds(tamagotchi) {
    if (window.speechSynthesis) {
        const messages = [
            new SpeechSynthesisUtterance('Привет'),
            new SpeechSynthesisUtterance('Хрю'),
            new SpeechSynthesisUtterance('А у меня телеграм работает!'),
            new SpeechSynthesisUtterance('Сарказм')
        ];
        for (let message of messages) {
            message.lang = 'ru-RU';
        }

        return function () {
            let message = Math.floor(Math.random() * messages.length);
            message.volume = tamagotchi.volume / 100;

            window.speechSynthesis.speak(message);
        };
    }
}

function initNotification() {
    let notification = window.Notification || window.webkitNotification;
    if (notification) {
        notification.requestPermission();

        return function (text) {
            if (notification.permission === 'granted') {
                return new Notification(text);
            }
        };
    }
}

function initSpeechRecognition(tamagotchi) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        const recognizer = new SpeechRecognition();
        recognizer.lang = 'ru-RU';

        recognizer.onstart = () => tamagotchi.hear();
        recognizer.onstop = () => tamagotchi.stopHearing();
        recognizer.onresult = fillRecognized;

        tamagotchiSvg.onmousedown = function () {
            recognizer.start();
        };

        return recognizer;
    }
}

function fillRecognized(e) {
    const index = e.resultIndex;

    recognizedTextField.innerText = e.results[index][0].transcript.trim();
}

window.onload = function () {
    initDomElements();
    const tamagotchi = new Tamagotchi();
    tamagotchi.run();
};

function initDomElements() {
    recognizedTextField = document.querySelector('.recognized-text');
    tamagotchiSvg = document.querySelector('.tamagotchi__svg');
    feedButton = document.querySelector('.feed-button');
    resetButton = document.querySelector('.reset-button');
    hunger = document.querySelector('.hunger__value');
    energy = document.querySelector('.energy__value');
    happiness = document.querySelector('.happiness__value');
}
