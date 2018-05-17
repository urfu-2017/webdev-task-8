(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const Hrundel = require('./scripts/models/hrundel');
const Recognition = require('./scripts/models/recognition');
const Notifier = require('./scripts/models/notification');
const { enableBatteryActivityListeners } = require('./scripts/helpers/battery');
const { activeTabCheck } = require('./scripts/helpers/active-tab-check');
const { lightnessCheck } = require('./scripts/helpers/lightness-check');

const hrundelElement = document.getElementById('hrundel');
const moodContainer = document.querySelector('.stats__mood .stats__value');
const energyContainer = document.querySelector('.stats__energy .stats__value');
const satietyContainer = document.querySelector('.stats__satiety .stats__value');
const restartButton = document.querySelector('.restart');
const feedButton = document.querySelector('.feed');
const replyBox = document.querySelector('.reply');
const hruSound = document.querySelector('.sound-hru');
const soundControl = document.querySelector('.volume');

let hrundel = new Hrundel(Snap('#hrundel'));

moodContainer.innerHTML = hrundel.state.mood;
satietyContainer.innerHTML = hrundel.state.satiety;
energyContainer.innerHTML = hrundel.state.energy;

let interval = setInterval(() => {
    if (hrundel.isDead()) {
        clearInterval(interval);
    }

    hruSound.play();
}, 5000);

setListeners();
start();

function start() {
    if (!enableBatteryActivityListeners(hrundel)) {
        feedButton.style.display = 'inline-block';

        feedButton.addEventListener('click', function () {
            hrundel.eat();
            hrundel.feedUp();
        });
    }

    activeTabCheck(hrundel);
    lightnessCheck(hrundel);

    hrundel.greet();

    hrundel.initLifecycle({
        onUpdate,
        onFed,
        onEnjoyed,
        onOverslept,
        onHungry,
        onUpset
    });
}

const notifier = new Notifier();

if (notifier.isAvaliable) {
    notifier.requestPermission();
}

const recognition = new Recognition();

if (recognition.isAvaliable) {
    hrundelElement.addEventListener('click', () => {
        if (hrundel.isDead()) {
            return;
        }

        if (hrundel.isEnjoying) {
            hrundel.stopListening();
            recognition.stop();

            replyBox.innerHTML = '';

            return;
        }

        hrundel.listen();
        recognition.start();
    });

    recognition.recognizer.onresult = event => {
        let last = event.results.length - 1;

        replyBox.innerHTML = event.results[last][0].transcript;
        hrundel.moodUp();
    };
}

function onEnjoyed() {
    hrundel.enjoy();

    if (recognition.isAvaliable) {
        recognition.stop();
    }

    replyBox.innerHTML = '';
}

function onOverslept() {
    if (document.hasFocus()) {
        hrundel.awake();
    }
}

function onFed() {
    hrundel.enjoy();
}

function onUpset() {
    if (!notifier.isAvaliable) {
        return;
    }

    notifier.notify('Мне скучно...');
}

function onHungry() {
    if (!notifier.isAvaliable) {
        return;
    }

    notifier.notify('Хочу есть...');
}

function onUpdate(state) {
    const { mood, satiety, energy } = state;

    moodContainer.innerHTML = String(mood);
    energyContainer.innerHTML = String(energy);
    satietyContainer.innerHTML = String(satiety);
}

function setListeners() {
    restartButton.addEventListener('click', () => {
        hrundel.clear();
        hrundel = new Hrundel(Snap('#hrundel'));

        start();
    });

    hruSound.volume = 0.5;

    soundControl.addEventListener('change', () => {
        hruSound.volume = Number(soundControl.value) / 100;
    });
}

},{"./scripts/helpers/active-tab-check":2,"./scripts/helpers/battery":4,"./scripts/helpers/lightness-check":5,"./scripts/models/hrundel":7,"./scripts/models/notification":8,"./scripts/models/recognition":9}],2:[function(require,module,exports){
module.exports.activeTabCheck = (hrundel) => {
    window.onfocus = () => {
        hrundel.awake();
    };

    window.onblur = () => {
        hrundel.sleep();
    };
};

},{}],3:[function(require,module,exports){
// eslint-disable-next-line
module.exports.alternate = function alternate(element, startAttr, endAttr, fullTime, count) {
    if (count <= 0) {
        return;
    }

    element.animate(startAttr, fullTime / 2, () => {
        element.animate(endAttr, fullTime / 2, () => {
            alternate(element, startAttr, endAttr, fullTime, --count);
        });
    });
};

module.exports.reset = function reset(element, time) {
    element.stop();
    element.animate({
        transform: 't0,0 r0 s1',
        opacity: 1
    }, time || 200);
};

},{}],4:[function(require,module,exports){
module.exports.enableBatteryActivityListeners = (hrundel) => {
    if (!checkBatteryAvailability()) {
        return false;
    }

    navigator.getBattery().then(function (battery) {
        battery.addEventListener('chargingchange', function () {
            let batteryIsCharging = battery.charging;

            if (batteryIsCharging) {
                hrundel.eat();

                return;
            }

            if (!batteryIsCharging) {
                hrundel.stopEating();
            }
        });
    });

    return true;
};

function checkBatteryAvailability() {
    return Boolean(navigator.getBattery);
}

},{}],5:[function(require,module,exports){
module.exports.lightnessCheck = (hrundel) => {
    window.addEventListener('devicelight', function (event) {

        if (event.value < 100) {
            hrundel.sleep();
        } else {
            hrundel.awake();
        }

    });
};

},{}],6:[function(require,module,exports){
module.exports.initState = () => {
    if (!localStorage.state) {
        let state = {
            energy: 100,
            satiety: 100,
            mood: 100
        };

        localStorage.state = JSON.stringify(state);

        return state;
    }

    return JSON.parse(localStorage.state);
};

module.exports.saveState = (state) => {
    localStorage.state = JSON.stringify(state);
};

module.exports.clearState = () => {
    localStorage.removeItem('state');
};

},{}],7:[function(require,module,exports){
const { alternate, reset } = require('../../scripts/helpers/animation');
const { initState, saveState, clearState } = require('../helpers/state');

module.exports = class {
    constructor(hrundel) {
        this.hrundel = hrundel;
        this.leftHand = hrundel.select('#left-hand');
        this.rightHand = hrundel.select('#right-hand');
        this.leftLeg = hrundel.select('#left-leg');
        this.rightLeg = hrundel.select('#right-leg');
        this.body = hrundel.select('#body');

        this.leftEar = hrundel.select('#left-ear');
        this.rightEar = hrundel.select('#right-ear');
        this.leftEye = hrundel.select('#left-eye');
        this.rightEye = hrundel.select('#right-eye');
        this.nose = hrundel.select('#nose');
        this.head = hrundel.select('#Head');

        this.state = initState();
    }

    initLifecycle(data) {
        this.isEating = false;
        this.isEnjoying = false;
        this.isSleeping = false;

        this.deathLine = setInterval(() => {
            this.tick(data);
        }, 1000);

        this.lifeLine = setInterval(() => {
            this.fill(data);
        }, 250);
    }

    tick({ onUpdate, onHungry, onUpset }) {
        if (this.isDead()) {
            clearInterval(this.deathLine);
            clearInterval(this.lifeLine);
            this.die();

            return;
        }
        this.checkReduce({ onUpset, onHungry });

        this.state.energy -= this.needDecreaseEnergy() ? 1 : 0;
        this.state.mood -= this.needDecreaseMood() ? 1 : 0;
        this.state.satiety -= this.needDecreaseSatiety() ? 1 : 0;

        onUpdate(this.state);
        saveState(this.state);
    }

    fill({ onUpdate, onFed, onEnjoyed, onOverslept }) {
        this.checkFill({ onFed, onEnjoyed, onOverslept });

        this.state.energy += this.isSleeping ? 1 : 0;
        this.state.satiety += this.isEating ? 1 : 0;

        onUpdate(this.state);
        saveState(this.state);
    }

    needDecreaseEnergy() {
        return !(this.isSleeping || this.state.energy === 0);
    }

    needDecreaseMood() {
        return !(this.isEnjoying || this.state.mood === 0);
    }

    needDecreaseSatiety() {
        return !(this.isEating || this.state.satiety === 0);
    }

    // eslint-disable-next-line
    checkFill({ onFed, onEnjoyed, onOverslept }) {
        if (this.state.energy === 100) {
            if (this.isSleeping) {
                this.state.energy = 99;
                onOverslept();
            }
        }
        if (this.state.satiety === 100) {
            if (this.isEating) {
                onFed();
            }

            this.isEating = false;
        }
        if (this.state.mood === 100) {
            if (this.isEnjoying) {
                onEnjoyed();
            }

            this.isEnjoying = false;
        }
    }

    checkReduce({ onUpset, onHungry }) {
        if (this.state.satiety === 10) {
            onHungry();
        }

        if (this.state.mood === 10) {
            onUpset();
        }
    }

    isDead() {
        const { energy, satiety, mood } = this.state;

        return (!energy && !satiety) || (!energy && ! mood) || (!satiety && !mood);
    }

    resetPosition(time) {
        [
            this.hrundel,
            this.leftHand,
            this.rightHand,
            this.leftLeg,
            this.rightLeg,
            this.body,
            this.leftEar,
            this.rightEar,
            this.leftEye,
            this.rightEye,
            this.nose,
            this.head
        ].forEach(element => reset(element, time));
    }

    openEyes(time) {
        this.rightEye.animate({
            r: 5
        }, time);

        this.leftEye.animate({
            r: 5
        }, time);
    }

    clear() {
        clearInterval(this.lifeLine);
        clearInterval(this.deathLine);
        this.resetPosition(0);

        let path = this.hrundel.select('path');
        if (path) {
            path.remove();
        }

        let text = this.hrundel.select('text');
        if (text) {
            text.remove();
        }

        clearState();
    }

    eat() {
        this.isEating = true;
    }

    stopEating() {
        this.isEating = false;
    }

    feedUp() {
        this.state.satiety = 100;
    }

    listen() {
        this.isEnjoying = true;
    }

    stopListening() {
        this.isEnjoying = false;
    }

    moodUp() {
        this.state.mood = this.state.mood <= 90 ? this.state.mood + 10 : 100;
    }

    greet() {
        alternate(this.hrundel, {
            transform: 't0,-30'
        }, {
            transform: 't0,0'
        }, 300, 2);

        alternate(this.leftHand, {
            transform: 'r10,100,120'
        }, {
            transform: 'r0,100,120'
        }, 200, 3);
    }

    enjoy() {
        alternate(this.hrundel, {
            transform: 't0,-30'
        }, {
            transform: 't0,0'
        }, 300, 2);
    }

    awake() {
        if (this.isDead()) {
            return;
        }

        this.isSleeping = false;

        this.resetPosition(700);
        this.openEyes(700);
    }

    sleep() {
        if (this.isDead()) {
            return;
        }

        this.isSleeping = true;
        this.isEnjoying = false;
        this.isEating = false;

        const duration = 1000;

        this.leftEye.animate({
            r: 0.5
        }, duration);

        this.rightEye.animate({
            r: 0.5
        }, duration);

        this.leftEar.animate({
            transform: 't0,5'
        }, duration);

        this.rightEar.animate({
            transform: 't0,5'
        }, duration);

        this.head.animate({
            transform: 't0,10 r-10, 80.33, 118.91'
        }, duration);
    }

    die() {
        const text = this.hrundel.text(0, 140, ['W', 'A', 'S', 'T', 'E', 'D']);
        text.attr({
            'font-size': 38
        });

        const tspans = text.selectAll('tspan').attr({
            opacity: 0
        });

        for (let i = 0; i < tspans.length; i++) {
            tspans[i].animate({
                opacity: 1
            }, 1500);
        }

        this.head.path('M55 29 L65 39 M65 29 L 55 39 M98 29 L108 39 M 108 29 L 98 39')
            .attr({
                stroke: '#000',
                strokeWidth: 2,
                opacity: 0
            })
            .attr({
                opacity: 1
            });

        this.leftEye.attr({
            opacity: 0
        });

        this.rightEye.attr({
            opacity: 0
        });
    }
};

},{"../../scripts/helpers/animation":3,"../helpers/state":6}],8:[function(require,module,exports){
module.exports = class {
    constructor() {
        this.isAvaliable = Boolean(window.Notification);
        this.permission = undefined;
    }

    requestPermission() {
        if (this.permission) {
            return;
        }

        return window.Notification.requestPermission().then(permission => {
            this.permission = permission;
        });
    }

    notify(text) {
        if (this.permission === 'denied') {
            return;
        }

        return new window.Notification(text);
    }
};

},{}],9:[function(require,module,exports){
module.exports = class {
    constructor() {
        let Recognizer = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (Recognizer) {
            this.isAvaliable = true;
            this.isListening = false;

            this.recognizer = new Recognizer();
            this.recognizer.continuous = true;
            this.recognizer.lang = 'ru-RU';

            return;
        }

        this.isAvaliable = false;
    }

    start() {
        if (!this.isAvaliable) {
            throw new Error('Speech recognition is not supported');
        }

        if (!this.isListening) {
            this.recognizer.start();
            this.isListening = true;
        }
    }

    stop() {
        if (this.isListening) {
            this.recognizer.stop();
            this.isListening = false;
        }
    }
};

},{}]},{},[1]);
