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
        const svg = Snap("#hrundel__image");
        this.face = svg.circle(75, 75, 50);
        this.nose = svg.circle(75, 90, 20);
        this.noses = [this.nose, svg.circle(65, 90, 5), svg.circle(85, 90, 5)];
        this.eyes = [svg.circle(50, 60, 5), svg.circle(100, 60, 5)];
    }

    animateGroup(group, animation, timeout = 0, cb) {
        group.forEach(element => {
            element.animate(animation, timeout)
        });
        if (cb) {
            setTimeout(() => cb(), timeout)
        }
    }

    attrGroup(group, obj) {
        group.forEach(element => {
            element.attr(obj);
        });
    }


    start() {
        this.face.attr({ fill: '#FDD7E4' });
        this.attrGroup(this.noses, { fill: 'white', stroke: 'black' });
        this.nose.attr({ fill: '#FDD7E4' });
        this.attrGroup(this.eyes, { fill: 'white', r: 5, stroke: 'black' });
    }

    ressurect() {
        this.face.animate({ fill: '#FDD7E4' }, 1000);
        this.animateGroup(this.noses, { fill: 'white', stroke: 'black' }, 1000);
        this.nose.animate({ fill: '#FDD7E4' }, 1000);
        this.animateGroup(this.eyes, { fill: 'white', r: 5 }, 1000);
    }

    sleep() {
        this.animateGroup(this.eyes, { r: 1 }, 500);
    }

    die() {
        this.face.animate({ fill: 'grey' }, 500);
        this.nose.animate({ fill: 'grey' }, 500);
        this.animateGroup(this.eyes, { r: 0 }, 500);
    }

    wakeUp() {
        this.animateGroup(this.eyes, { r: 5 }, 500);
    }

    happy() {
        this.animateGroup(this.noses, { cy: 100 }, 500);
        this.animateGroup(this.eyes, { r: 10 }, 500, () => {
            this.animateGroup(this.noses, { cy: 90 }, 500);
            this.animateGroup(this.eyes, { r: 5 }, 500);
        });
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
    if (action === 'energy' && play && stats[action] !== 100) {
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
