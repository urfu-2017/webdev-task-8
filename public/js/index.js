'use strict';
/* eslint-disable */

let action = null;
let stats = null;
let play = true;
let battery = null;
let windowInFocus = true;
const hrundelWords = ["Жизнь за Нер'зула", "Живу чтобы служить", "Хрюк, Хрюк"];
let wordsCounter = 0;
let volume = 1;

class HrundelView {
    constructor() {
        const svg = Snap("#svg");

        this.face = svg.circle(75, 75, 50);
        const leftEye = svg.circle(50, 60, 5);
        const rightEye = svg.circle(100, 60, 5);
        const nose = svg.circle(75, 90, 20);
        const rightNose = svg.circle(65, 90, 5);
        const leftNose = svg.circle(85, 90, 5);

        this.eyes = [leftEye, rightEye];
        this.noses = [nose, leftNose, rightNose];
    }

    start() {
        this.face.attr({ fill: '#FDD7E4' });
        this.noses.forEach(e => { e.attr({ fill: 'white', stroke: 'black' }) });
        this.noses[0].attr({ fill: '#FDD7E4' });
        this.eyes.forEach(eye => eye.attr({ fill: 'white', r: 5, stroke: 'black' }));
    }

    ressurect() {
        this.face.animate({ fill: '#FDD7E4' }, 1000);
        this.noses.forEach(e => { e.animate({ fill: 'white', stroke: 'black' }, 1000) });
        this.noses[0].animate({ fill: '#FDD7E4' }, 1000);
        this.eyes.forEach(eye => eye.animate({ fill: 'white', r: 5 }, 1000));
    }

    sleep() {
        this.eyes.forEach(eye => eye.animate({ r: 1 }, 500));
    }

    die() {
        this.face.animate({ fill: 'grey' }, 500);
        this.noses[0].animate({ fill: 'grey' }, 500);
        this.eyes.forEach(eye => eye.animate({ r: 0 }, 500));
    }

    wakeUp() {
        this.eyes.forEach(eye => eye.animate({ r: 5 }, 500));
    }

    happy() {
        this.noses.forEach(e => { e.animate({ cy: 100 }, 500) });
        this.eyes.forEach(eye => eye.animate({ r: 10 }, 500, null, () => {
            this.noses.forEach(e => { e.animate({ cy: 90 }, 500) });
            this.eyes.forEach(eye => eye.animate({ r: 5 }, 500));
        }));
    }
}

const hrundelView = new HrundelView();
hrundelView.start();

function say(str) {
    const speech = new SpeechSynthesisUtterance(str);
    speech.volume = volume;
    window.speechSynthesis.speak(speech);
}

function notify(body) {
    const Notification = window.Notification || window.webkitNotification;
    if (Notification) {
        Notification.requestPermission().then(result => {
            if (!['denied', 'default'].includes(result)) {
                const notification = new Notification('Хрюндель', {
                    body,
                    dir: 'ltr',
                    lang: 'en-US'
                });
            }
        });
    }
}

Object.prototype.forKey = function(func) {
    Object.keys(this).forEach(key => func(key));
}

Object.prototype.mapValues = function(func) {
    const obj = {};
    this.forKey(key => {
        obj[key] = func(this[key]);
    });

    return obj;
}

function saveStats(newStats) {
    console.log('save');
    if (newStats) {
        stats = Object.assign({}, newStats);
    }
    stats.forKey(stat => {
        stats[stat] = Math.min(100, Math.max(0, stats[stat]));
        document.getElementById(stat).innerText = Number(stats[stat]).toFixed(1);
    });
    localStorage.stats = JSON.stringify(stats);
}

function startNewGame() {
    say('Начнем всё сначала');
    action = null;
    play = true;
    saveStats({
        happy: 100,
        energy: 100,
        eat: 100
    });
}

function gameOver() {
    say('ой, я умер!');
    notify('ой, я умер!');
    hrundelView.die();
    play = false;
}

function setAction(newAction) {
    action = newAction;
    if (action === 'energy' && play) {
        hrundelView.sleep();
    }
}

function removeAction(oldAction) {
    if (action === oldAction) {
        if (action === 'energy' && windowInFocus && play) {
            hrundelView.wakeUp();
        }
        if (action === 'energy' && !windowInFocus) {
            setAction('energy');
        } 
        else if (battery && battery.charging) {
            setAction('eat');
        } else {
            setAction(null)
        }
    }
}

function gameTick() {
    if (play) {
        stats.forKey(stat => {
            stats[stat] -= 0.2;
            stats[stat] = Number(stats[stat].toFixed(1))
        });
        if (action && stats[action]) {
            stats[action] += 1;
        };
        saveStats();
        stats.forKey(stat => {
            if (action === stat && stats[stat] === 100) {
                removeAction(stat);
            }
        });
        if (!windowInFocus) {
            if (stats.happy === 10 && action !== 'happy') {
                notify('Мне скучно!')
            }
            if (stats.eat === 10    && action !== 'eat') {
                notify('Хочу кушать!')
            }
        }
        if (Object.values(stats).filter(stat => stat === 0).length > 1)
            gameOver();
    }
}

function hrundelSpeakTick() {
    if (play) {
        say(hrundelWords[wordsCounter % hrundelWords.length]);
        wordsCounter++;
    }
}

function onChargingChange() {
    if (battery.charging) {
        setAction('eat');
    } else {
        removeAction('eat');
    } 
}

function initGame() {
    if (localStorage.stats) {
        saveStats(JSON.parse(localStorage.stats).mapValues(value => Number(value)));
    } else {
        startNewGame();
    }
    if (navigator.getBattery) {
        navigator.getBattery().then(batt => {
            battery = batt;
            batt.onchargingchange = onChargingChange;
            onChargingChange()
        })
    }
    setInterval(gameTick, 200);
    setInterval(hrundelSpeakTick, 10000);
}

function hrundelOnClick(Recognizer) {
    setAction(null);
    const recognizer = new Recognizer();
    recognizer.lang = 'en-US';
    recognizer.start();
    recognizer.onresult = e => {
        document.getElementById('recognized-text').innerText = `Ты сказал "${e.results[0][0].transcript}"`
        stats.happy += 25;
        hrundelView.happy();
        removeAction(null);
    }
}

window.onload = () => {
    initGame();
    document.getElementById('new-game').onclick = () => {
        if (!play) {
            hrundelView.ressurect();
        }
        startNewGame();
    };
    document.getElementById('feed').onclick = () => setAction('eat');
    document.getElementById('volume').onchange = e => { volume = e.target.value / 100 };
    document.getElementById('volume').value = 100;
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
        const recognizer = window.SpeechRecognition || window.webkitSpeechRecognition;
        document.getElementById('hrundel').onclick = () => hrundelOnClick(recognizer);
    }
}

window.onblur = () => {
    windowInFocus = false;
    setAction('energy');
};
window.onfocus = () => {
    windowInFocus = true;
    removeAction('energy');
};
