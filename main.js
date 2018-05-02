'use strict';
/* eslint-disable */

var snap = Snap('.svg');
var body = snap.circle(150, 150, 100);
body.attr({
    fill: 'pink',
    stroke: '#000',
    strokeWidth: 2
});
var leftEye = snap.circle(100, 110, 20);
var rightEye = snap.circle(200, 110, 20);
var leftEar = snap.polygon(
    90, 80,
    70, 80,
    60, 70,
    75, 60,
    85, 60,
    100, 70);
var rightEar = snap.polygon(
    220, 80,
    200, 80,
    190, 70,
    205, 60,
    215, 60,
    230, 70);
var mouth = snap.rect(100, 150, 100, 50);
var mouthHole = snap.rect(110, 160, 80, 30);
mouthHole.attr({
    fill: 'pink'
});

var states = {
    NOTHING: 'NONE',
    DEAD: 'DEAD',
    SLEEPING: 'SLEEPING',
    EATING: 'EATING',
    TALKING: 'TALKING'
}
var currentState = states.NOTHING;

var satiety = document.querySelector('.stat__amount_satiety');
var energy = document.querySelector('.stat__amount_energy');
var mood = document.querySelector('.stat__amount_mood');

function saveState() {
    localStorage.setItem('satiety', satiety.innerHTML);
    localStorage.setItem('energy', energy.innerHTML);
    localStorage.setItem('mood', mood.innerHTML);
}
function gainStat(stat) {
    let oldValue = parseInt(stat.innerHTML);
    let newValue = oldValue + 4;
    if (newValue > 100) {
        newValue = 100;
    }
    stat.innerHTML = newValue;

    saveState();
}
function loseStat(stat) {
    let oldValue = parseInt(stat.innerHTML);
    let newValue = oldValue - 1;
    if (newValue < 0) {
        newValue = 0;
    }
    stat.innerHTML = newValue;

    saveState();
}

var restartButton = document.querySelector('.restart-button');
var feedButton = document.querySelector('.feed-button');
function resetState() {
    localStorage.setItem('satiety', 100);
    localStorage.setItem('energy', 100);
    localStorage.setItem('mood', 100);
    currentState = states.NOTHING;
}
function startGame() {
    satiety.innerHTML = localStorage.getItem('satiety');
    energy.innerHTML = localStorage.getItem('energy');
    mood.innerHTML = localStorage.getItem('mood');
}
restartButton.addEventListener('click', function (e) {
    resetState();
    startGame();
});
feedButton.addEventListener('click', function (e) {
    currentState = states.EATING;
});

var charging = document.querySelector('.battery-charging');
if (navigator.getBattery) {
    navigator
        .getBattery()
        .then(initBattery);
}
function initBattery(battery) {
    battery.onchargingchange = updateCharging;
    battery.onchargingchange();
}
function updateCharging() {
    let onOff = this.charging ? 'on' : 'off';
    charging.innerHTML = 'Charger is ' + onOff;
    if (this.charging) {
        currentState = states.EATING;
    }
    if (!this.charging /*&& currentState === states.EATING*/) {
        currentState = states.NOTHING;
    }
}

var sleepButton = document.querySelector('.sleep');
var awakeButton = document.querySelector('.awake');
function failingASleep() {
    currentState = states.SLEEPING;
    leftEye.animate({ transform: 's0.5' }, 1000, mina.linear);
    rightEye.animate({ transform: 's0.5' }, 1000, mina.linear);
}
function awakening() {
    currentState = states.NOTHING;
    leftEye.animate({ transform: 's1' }, 1000, mina.linear);
    rightEye.animate({ transform: 's1' }, 1000, mina.linear);
}
sleepButton.addEventListener('click', function (e) {
    failingASleep();
});
awakeButton.addEventListener('click', function (e) {
    awakening();
});
window.addEventListener('blur', function (e) {
    failingASleep();
});
window.addEventListener('focus', function (e) {
    awakening();
});

var pig = document.querySelector('.svg');
var speechLog = document.querySelector('.speech-log');
var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
var recognizer = new SpeechRecognition();
recognizer.lang = 'ru-RU';
pig.addEventListener('click', function () {
    if (parseInt(mood.innerHTML) < 100) {
        speechLog.innerHTML = 'Recognition started';
        recognizer.start();
    }
});
recognizer.addEventListener('result', function (e) {
    let index = e.resultIndex;
    let result = e.results[index][0].transcript.trim();
    speechLog.innerHTML = result;
    currentState = states.TALKING;
});

var lastNotificationTime = Date.now();
function checkStat(stat, text) {
    if (parseInt(stat.innerHTML) <= 10 && Date.now() - lastNotificationTime > 10000) {
        console.info(text);
        lastNotificationTime = Date.now();
        notifyMe(text);
    }
}
function notifyMe(text) {
    if (!('Notification' in window)) {
        console.warn('This browser does not support desktop notification');
    }

    else if (Notification.permission === 'granted') {
        var notification = new Notification(text);
    }

    else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
            if (permission === 'granted') {
                var notification = new Notification(text);
            }
        });
    }
}

function checkDeath() {
    let satietyIsZero = parseInt(satiety.innerHTML) === 0;
    let energyIsZero = parseInt(energy.innerHTML) === 0;
    let moodIsZero = parseInt(mood.innerHTML) === 0;
    let a = satietyIsZero && energyIsZero;
    let b = energyIsZero && moodIsZero;
    let c = satietyIsZero && moodIsZero;

    if (a || b || c) {
        currentState = states.DEAD;
    }
}

var requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;
var lastGameLoopTime = Date.now();
function gameLoop() {
    if (Date.now() - lastGameLoopTime > 500) {
        lastGameLoopTime = Date.now();
        checkDeath();
        checkStat(satiety, 'WANT TO EAT');
        checkStat(mood, 'WANT TO TALK');
        console.info(currentState);
        switch (currentState) {
            case states.DEAD: dying(); break;
            case states.SLEEPING: sleeping(); break;
            case states.EATING: eating(); break;
            case states.TALKING: talking(); break;
            case states.NOTHING: nothing(); break;
        }
    }
    requestAnimationFrame(gameLoop);
}
function eating() {
    gainStat(satiety);
    loseStat(energy);
    loseStat(mood);
}
function sleeping() {
    loseStat(satiety);
    gainStat(energy);
    loseStat(mood);
}
function talking() {
    loseStat(satiety);
    loseStat(energy);
    gainStat(mood);
    gainStat(mood);
    gainStat(mood);
    currentState = states.NOTHING;
}
function nothing() {
    loseStat(satiety);
    loseStat(energy);
    loseStat(mood);
}
function dying() {
    console.info('FATALITY');
}

if (localStorage.length === 0) {
    resetState();
}
startGame();
requestAnimationFrame(gameLoop);
