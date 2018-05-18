"use strict"

let action = null;
let stats = null;
let play = true;
let battery = null;
let windowInFocus = true;
const hrundelWords = ["Жизнь за Нер'зула", "Живу чтобы служить", "Хрюк, Хрюк"];
let wordsCounter = 0;
let volume = 1;

function say(str) {
    const speech = new SpeechSynthesisUtterance(str);
    speech.volume = volume;
    window.speechSynthesis.speak(speech);
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
        stats = { ...newStats };
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
    play = false;
}

function setAction(newAction) {
    action = newAction;
}

function removeAction(oldAction) {
    if (action === oldAction) {
        if (action === 'energy' && !windowInFocus) {
            setAction('energy');
        } 
        else if (battery.charging) {
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
        if (Object.values(stats).filter(stat => stat === 0).length > 1)
            gameOver();
    }
}

function hrundelSpeakTick() {
    if (play) {
        say(hrundelWords[wordsCounter % hrundelWords.length]);
        wordsCounter++;
    } else {
        say('Я немогу ничего сказать, я умер');
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
        console.log('1')
        stats.happy += 10;
        removeAction(null);
    }
}

window.onload = () => {
    initGame();
    document.getElementById('new game').onclick = startNewGame;
    document.getElementById('feed').onclick = () => setAction('eat');
    document.getElementById('sleep').onclick = () => setAction('tireness');
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