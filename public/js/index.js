'use strict';

/* eslint-disable */
class Drawer {
    drawHrundel() {
        const svg = Snap('.hrun');
        const head = svg.circle(100, 100, 100);
        head.attr({
            fill: '#ff5862'
        });
        head.addClass('head');
        this.leftWhite = svg.ellipse(60, 70, 20, 20).attr({
            fill: '#fff'
        });
        this.leftBlack = svg.ellipse(60, 75, 10, 10);
        this.rightWhite = svg.ellipse(140, 70, 20, 20).attr({
            fill: '#fff'
        });
        this.rightBlack = svg.ellipse(140, 75, 10, 10);
        const noseBack = svg.circle(100, 140, 25).attr({
            fill: '#ff8d8e'
        });
        const noseBlackLeft = svg.circle(90, 140, 5);
        const noseBlackRight = svg.circle(110, 140, 5);
        this.nose = svg.group(noseBack, noseBlackLeft, noseBlackRight);

        this.svg = svg;
    }


    rerender() {
        document.querySelector('#satietyValue').innerHTML = HRUN.satiety;
        document.querySelector('#energyValue').innerHTML = HRUN.energy;
        document.querySelector('#moodValue').innerHTML = HRUN.mood;
    }

    animateSleep() {
        this.leftWhite.attr({ ry: 1 });
        this.rightWhite.attr({ ry: 1 });
        this.leftBlack.attr({ ry: 0 });
        this.rightBlack.attr({ ry: 0 });
    }

    animateWake() {
        this.leftWhite.animate({ ry: 20 }, 2000);
        this.leftBlack.animate({ ry: 10 }, 2000);
        this.rightWhite.animate({ ry: 20 }, 2000);
        this.rightBlack.animate({ ry: 10 }, 2000);
    }

    animateDeath() {
        this.animateSleep();
        this.svg.transform('r40,0,0');
    }

    animateEating() {
        function animUp() {
            this.nose.animate({ transform: 't0,-20' }, 1000, animDown.bind(this));
        }

        function animDown() {
            this.nose.animate({ transform: 't0,20' }, 1000, animUp.bind(this));
        }

        animUp.bind(this)();
    }

    stopEatingAnimation() {
        this.nose.stop();
    }
}

function drawFeedButton() {
    const button = document.createElement('button');
    button.onclick = () => HRUN.feed();
    document.querySelector('.controls').appendChild(button);
}

class AudioPlayer {
    constructor() {
        this.volume = 1;
        this.active = true;
    }

    initPlayer() {
        if (!window.Audio) {
            console.error('no audio');

            return;
        }
        document.querySelector('#volume').onchange = (e) => {
            this.volume = e.target.value;
            console.info(this.volume);
        };
        this.scheduleNext();
    }

    scheduleNext() {
        if (!this.active) {
            return;
        }
        const time = Math.floor(Math.random() * 10000 + 5000);
        const number = Math.floor(Math.random() * 2 + 1);
        const path = `/audio/PigIdle${number}.ogg`;
        this.timeout = setTimeout(this.play.bind(this, path), time);

    }

    play(path) {
        if (!this.active) {
            return;
        }
        const audio = new Audio(path);
        audio.volume = this.volume;
        audio.play();
        this.scheduleNext.bind(this)();
    }
}


class HrundelState {
    constructor({ satiety, energy, mood, action }) {
        this.satiety = satiety;
        this.energy = energy;
        this.mood = mood;
        this._action = action;
    }

    static initMax() {
        return new HrundelState({
            satiety: 100,
            energy: 100,
            mood: 100,
            action: 'rest'
        });
    }

    static loadFromStorage() {
        const state = JSON.parse(localStorage.getItem('state'));
        if (state) {
            return new HrundelState(state);
        }
    }

    saveToStorage() {
        const state = {
            satiety: this.satiety,
            energy: this.energy,
            mood: this.mood,
            action: this._action
        };
        localStorage.setItem('state', JSON.stringify(state));
    }

    reduceState() {
        switch (this._action) {
            case 'rest':
                this.decreaseProp('satiety');
                this.decreaseProp('mood');
                this.decreaseProp('energy');
                break;
            case 'eating':
                this.increaseProp('satiety', 3);
                this.decreaseProp('mood');
                this.decreaseProp('eating');
                if (this.satiety === 100) {
                    this._action = 'rest';
                    DRAWER.stopEatingAnimation();
                }
                break;
            case 'communicating':
                this.increaseProp('mood', 3);
                this.decreaseProp('satiety');
                this.decreaseProp('energy');
                if (this.mood === 100) {
                    stopListening();
                    this._action = 'rest';
                }
                break;
            case 'sleeping':
                this.decreaseProp('mood');
                this.decreaseProp('satiety');
                this.increaseProp('energy', 3);
                if (this.energy === 100) {
                    this._action = 'rest';
                }
                break;
            default:
                throw new Error('unexpected state');

        }

        if (!isActive) {
            if (this.satiety === 9) {
                createNotification('Я голодный :(');
            }
            if (this.mood === 9) {
                createNotification('Мне грустно :с');
            }
        }

        DRAWER.rerender();

        if (this.shouldDie()) {
            DRAWER.animateDeath();
            PLAYER.play('/audio/PigDeath1.ogg');
            PLAYER.active = false;

            return;
        }
        this.timeout = setTimeout(this.reduceState.bind(HRUN), 1000);
    }

    increaseProp(name, value = 1) {
        this[name] = Math.min(this[name] + value, 100);
    }

    decreaseProp(name, value = 1) {
        this[name] = Math.max(this[name] - value, 0);
    }

    shouldDie() {
        return [this.satiety, this.energy, this.mood].filter(prop => prop === 0).length >= 2;
    }

    set action(value) {
        if (['rest', 'eating'].includes(value)) {
            this._action = value;
        }
    }

    feed() {
        this.satiety = Math.min(this.satiety + 3, 100);
        DRAWER.rerender();
    }
}

let HRUN = HrundelState.loadFromStorage() || HrundelState.initMax();
let LISTENER;
let NOTIFICATION;
let isActive = true;
let DRAWER = new Drawer();
const PLAYER = new AudioPlayer();

function reset() {
    DRAWER.stopEatingAnimation();
    DRAWER.animateWake();
    DRAWER.svg.transform('r0,0,0');
    clearTimeout(HRUN.timeout);
    HRUN = HrundelState.initMax();
    DRAWER.rerender();
    HRUN.reduceState();
    clearTimeout(PLAYER.timeout);
    PLAYER.active = true;
    PLAYER.scheduleNext();
}

function initListening() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        return;
    }
    LISTENER = new SpeechRecognition();
    LISTENER.lang = 'ru-RU';
    LISTENER.continuous = true;

    LISTENER.onerror = err => {
        console.error(err);
        HRUN._action = 'rest';
    };

    LISTENER.onstart = function (e) {
        HRUN._action = 'communicating';
        DRAWER.stopEatingAnimation();
    };

    LISTENER.onresult = function (e) {
        const index = e.resultIndex;
        const result = e.results[index][0].transcript.trim();

        const speech = document.querySelector('#speech');
        const oldResult = speech.innerHTML;
        speech.innerText = oldResult + result;
    };

    document.querySelector('.head').onclick = function (e) {
        LISTENER.start();
    };
}

function stopListening() {
    LISTENER.stop();
    HRUN._action = 'rest';
}

function initSleeping() {
    let hidden, visibilityChange;
    if (typeof document.hidden !== 'undefined') {
        hidden = 'hidden';
        visibilityChange = 'visibilitychange';
    } else if (typeof document.msHidden !== 'undefined') {
        hidden = 'msHidden';
        visibilityChange = 'msvisibilitychange';
    } else if (typeof document.webkitHidden !== 'undefined') {
        hidden = 'webkitHidden';
        visibilityChange = 'webkitvisibilitychange';
    }

    document.addEventListener(visibilityChange, function (e) {

        if (document[hidden]) {
            DRAWER.animateSleep(HRUN);
            isActive = false;
            stopListening();
            HRUN._action = 'sleeping';
        } else {
            isActive = true;
            if (HRUN.shouldDie()) {
                return;
            }
            HRUN._action = 'rest';
            DRAWER.animateWake();
        }
    });
}

function initNotifications() {
    const Notification = window.Notification || window.webkitNotification;
    if (!Notification) {
        console.error('Notifications not supported');
    }

    Notification.requestPermission(initSleeping);
    NOTIFICATION = Notification;
}

function createNotification(text) {
    const notification = new NOTIFICATION('Хрюндель', {
        body: text
    });
    notification.onerror = function (err) {
        console.error(err);
    };
}

function initFeed() {
    if (!navigator.getBattery) {
        drawFeedButton();
    }
    navigator.getBattery().then((battery) => {
        battery.addEventListener('chargingchange', () => {
            if (battery.charging) {
                stopListening();
                HRUN._action = 'eating';
                DRAWER.animateEating();
            } else {
                if (HRUN._action !== 'eating') {
                    return;
                }
                HRUN._action = 'rest';
                DRAWER.stopEatingAnimation();
            }
        });
    });
}

function initReset() {
    document.querySelector('#reset').onclick = reset;
}

window.onload = () => {
    DRAWER.drawHrundel();
    initFeed();
    DRAWER.rerender();
    HRUN.reduceState();
    initListening();
    initNotifications();
    PLAYER.initPlayer();
    initReset();

};

window.onunload = () => {
    HRUN.saveToStorage();
};
