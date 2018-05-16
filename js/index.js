'use strict';

/* eslint-disable */


function drawHrundel() {
    console.log('asdasdas');
    const svg = Snap('.hrun');
    const head = svg.circle(150, 150, 100);
    head.attr({
        fill: '#ff5862'
    });
    const leftWhite = svg.circle(110, 120, 20).attr({
        fill: '#fff'
    });
    const leftBlack = svg.circle(110, 125, 10);
    const rightWhite = svg.circle(190, 120, 20).attr({
        fill: '#fff'
    });
    const rightBlack = svg.circle(190, 125, 10);
    const leftEye = svg.group(leftWhite, leftBlack);
    const rightEye = svg.group(rightWhite, rightBlack);
    const noseBack = svg.circle(150, 190, 25).attr({
        fill: '#ff8d8e'
    });
    const noseBlackLeft = svg.circle(140, 190, 5);
    const noseBlackRight = svg.circle(160, 190, 5);
    const nose = svg.group(noseBack, noseBlackLeft, noseBlackRight);
}

function drawFeedButton() {
    const button = document.createElement('button');
    button.onclick = () => HRUN.feed();
    document.querySelector('.controls').appendChild(button);
}

class Game {
    constructor(hrun) {
        this.hrun = hrun;
    }

    initFeed() {
        if (!navigator.getBattery) {
            drawFeedButton();
        }
        navigator.getBattery().then((battery) => {
            battery.addEventListener('chargingchange', () => {
                console.log(battery);
                if (battery.charging) {
                    HRUN._action = 'eating';
                    stopListening();
                } else {
                    HRUN._action = 'rest';
                }
            })
        });
    }

    reset() {
        HRUN = HrundelState.initMax();
    }

}

function rerender(hrundel) {
    document.querySelector('#satietyValue').innerHTML = hrundel.satiety;
    document.querySelector('#energyValue').innerHTML = hrundel.energy;
    document.querySelector('#moodValue').innerHTML = hrundel.mood;
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
        console.log(this._action);
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

        }

        if (!isActive) {
            if (this.satiety === 9) {
                createNotification('Я голодный :(');
            }
            if (this.mood === 9) {
                createNotification('Мне грустно :с');
            }
        }

        rerender(this);
        setTimeout(this.reduceState.bind(HRUN), 1000);
    }

    increaseProp(name, value = 1) {
        this[name] = Math.min(this[name] + value, 100);
    }

    decreaseProp(name, value = 1) {
        this[name] = Math.max(this[name] - value, 0);
    }

    set action(value) {
        if (['rest', 'eating'].includes(value)) {
            this._action = value;
            console.log(this._action);
        }
    }

    feed() {
        this.satiety = Math.min(this.satiety + 3, 100);
        rerender(this);
    }
}

let HRUN = HrundelState.loadFromStorage() || HrundelState.initMax();
let LISTENER;
let NOTIFICATION;
let isActive = true;

function initListening() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition)
        return;
    LISTENER = new SpeechRecognition();
    LISTENER.lang = 'ru-RU';
    LISTENER.continious = true;

    LISTENER.onerror = err => {
        console.error(err);
        HRUN._action='rest';
    };

    LISTENER.onstart = function(e) {
        console.log('started listening');
        HRUN._action = 'communicating';
    };

    LISTENER.onstop = function(e) {
        console.log('stopped listening');
    };

    LISTENER.onresult = function (e) {
        const index = e.resultIndex;
        const result = e.results[index][0].transcript.trim();

        const speech = document.querySelector('#speech');
        const oldResult = speech.innerText;
        speech.innerText = oldResult + result;
    };

    document.querySelector('.hrun').onclick = function (e) {
        console.log('Started listening');
        LISTENER.start();
    }
}

function stopListening() {
    LISTENER.stop();
    HRUN._action='rest';
}

function initSleeping() {
    let hidden, visibilityChange;
    if (typeof document.hidden !== "undefined") {
        hidden = "hidden";
        visibilityChange = "visibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
        hidden = "msHidden";
        visibilityChange = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
        hidden = "webkitHidden";
        visibilityChange = "webkitvisibilitychange";
    }

    document.addEventListener(visibilityChange, function (e) {
        if (document[hidden]) {
            isActive = false;
            HRUN._action = 'sleeping';
        } else {
            isActive = true;
            HRUN._action = 'rest';
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
    notification.onshow = function (e) {
        console.log('shown');
    };
}


window.onload = () => {
    drawHrundel();
    const game = new Game(HRUN);
    game.reset();
    game.initFeed();
    console.log(HRUN.satiety, HRUN.energy, HRUN.mood);
    rerender(HRUN);
    HRUN.reduceState();
    initListening();
    initNotifications();
};

window.onunload = () => {
    HRUN.saveToStorage();
};


console.log('qweqwe');