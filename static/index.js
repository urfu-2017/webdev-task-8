'use strict';

function redrawCharacteristics() {
    document.querySelector('.fullness').innerHTML = 'Сытость ' + window.fullness + '%';
    document.querySelector('.energy').innerHTML = 'Энергия ' + window.energy + '%';
    document.querySelector('.fun').innerHTML = 'Настроение ' + window.fun + '%';
}

function decreaseCharacteristics() {
    if (window.state !== 'eat') {
        window.fullness--;
    }
    if (window.state !== 'sleep') {
        window.energy--;
    }
    window.fun--;
    if (window.fullness < 0) {
        window.fullness = 0;
    }
    if (window.energy < 0) {
        window.energy = 0;
    }
    if (window.fun < 0) {
        window.fun = 0;
    }
}

function updateStorage() {
    localStorage.setItem('fullness', window.fullness);
    localStorage.setItem('energy', window.energy);
    localStorage.setItem('fun', window.fun);
    localStorage.setItem('state', window.state);
    localStorage.setItem('volume', window.volume);
}

function turn() {
    if (window.state === 'dead') {
        return;
    }
    decreaseCharacteristics();
    manageState();
    if (isDead()) {
        window.state = 'dead';
        window.clearInterval(window.soundTimer);
        console.info('dead');
    }
    manageNotifications();
    redrawCharacteristics();
    updateStorage();
}

function manageState() {
    if (window.state === 'sleep') {
        window.energy += 5;
        if (window.energy >= 100) {
            window.energy = 100;
            wakeUp();
        }
    } else if (window.state === 'eat') {
        window.fullness += 5;
        if (window.fullness >= 100) {
            window.fullness = 100;
            window.state = 'nothing';
        }
    }
    if (window.fun >= 100) {
        window.fun = 100;
        window.state = 'nothing';
        window.recognizer.stop();
    }
}

function wakeUp() {
    window.state = 'nothing';
    console.info('wake1');
    setTimeout(() => drawNormalEyes(window.snap), 2000);
}

function isDead() {
    return (window.fullness === 0 && window.energy === 0) ||
        (window.fullness === 0 && window.fun === 0) ||
        (window.energy === 0 && window.fun === 0);
}

function initBattery(battery) {
    console.info(battery);
    battery.onchargingchange = updateCharging;
}

function manageNotifications() {
    manageNotification('fullness', 'Я голоден!');
    manageNotification('fun', 'Скучно!');
    manageNotification('energy', 'Хочу спать!');
}

function manageNotification(type, text) {
    window.secondsAfter[type]++;
    if (window[type] <= 10 && window.secondsAfter[type] >= 10) {
        window.secondsAfter[type] = 0;

        return new Notification('Свинья', { body: text });
    }
}

function updateCharging(battery) {
    if (window.state !== 'dead' && window.state !== 'sleep') {
        if (battery.currentTarget.charging) {
            window.state = 'eat';
        } else if (window.state === 'eat') {
            window.state = 'nothing';
        }
    }
}

function fallASleep() {
    window.state = 'sleep';
    drawSleepEyes(window.snap);
}

function energyActivity() {
    window.addEventListener('focus', () => {
        if (window.state !== 'dead' && window.state === 'sleep') {
            wakeUp();
        }
    });
    window.addEventListener('blur', () => {
        if (window.state !== 'dead' && window.energy < 100) {
            fallASleep();
        }
    });
}

function initNotifications() {
    if (window.Notification || window.webkitNotification) {
        Notification.requestPermission();
    }
}

function initSounds() {
    if (window.speechSynthesis) {
        sayHello();
        window.soundTimer = setInterval(playSound, 10000);
    }
}

function sayHello() {
    if (window.speechSynthesis) {
        if (window.state !== 'dead') {
            sayMessage('Привет!');
        }
    }
}

function playSound() {
    if (window.state === 'dead') {
        return;
    }
    sayMessage('Хрю');
}

function sayMessage(text) {
    if (window.speechSynthesis) {
        const message = new SpeechSynthesisUtterance(text);
        message.volume = window.volume;
        window.speechSynthesis.speak(message);
    }
}

function initCharacteristics() {
    window.fullness = localStorage.getItem('fullness') || 100;
    window.energy = localStorage.getItem('energy') || 100;
    window.fun = localStorage.getItem('fun') || 100;
    window.state = localStorage.getItem('state') || 'nothing';
    window.volume = localStorage.getItem('volume') || 1;
}

function drawPig() {
    // eslint-disable-next-line new-cap, no-undef
    const s = Snap('.pig-image');
    window.snap = s;
    window.pig = {};
    const mainCircle = s.circle(105, 105, 100);
    mainCircle.attr({
        fill: '#FFC0CB',
        stroke: '#000',
        strokeWidth: 5
    });

    drawNormalEyes(s);

    const nose = s.circle(100, 120, 25);
    nose.attr({
        fill: '#FFC0A0'
    });

    s.circle(110, 120, 7);
    s.circle(90, 120, 7);
}

function drawNormalEyes(s) {
    if (window.pig.eye1) {
        window.pig.eye1.remove();
    }
    window.pig.eye1 = s.circle(70, 70, 10);
    window.pig.eye1.attr({
        fill: '#ccc'
    });
    if (window.pig.eye2) {
        window.pig.eye2.remove();
    }
    window.pig.eye2 = s.circle(135, 70, 10);
    window.pig.eye2.attr({
        fill: '#ccc'
    });
}

function drawSleepEyes(s) {
    window.pig.eye1.remove();
    window.pig.eye1 = s.rect(60, 67, 20, 5);
    window.pig.eye2.remove();
    window.pig.eye2 = s.rect(125, 67, 20, 5);
}

if (navigator.getBattery) {
    navigator.getBattery().then(initBattery);
} else {
    document.querySelector('#feed-me').style.display = 'block';
}

drawPig();
initCharacteristics();
initNotifications();
initSounds();
energyActivity();
redrawCharacteristics();
window.secondsAfter = { fun: 10, fullness: 10, energy: 10 };
window.turnTimer = setInterval(turn, 1000);

document.querySelector('.new-game').addEventListener('click', () => {
    window.fullness = 100;
    window.energy = 100;
    window.fun = 100;
    window.state = 'nothing';
    sayHello();
});

const volumeInput = document.querySelector('#volume');
volumeInput.value = window.volume * 100;
volumeInput.addEventListener('input', () => {
    window.volume = volumeInput.value / 100;
});


const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
    window.recognizer = new SpeechRecognition();
    window.recognizer.lang = 'ru-RU';
    window.recognizer.continuous = true;
    window.recognizer.interimResults = true;
    window.recognizer.onresult = function (e) {
        var index = e.resultIndex;
        var result = e.results[index][0].transcript.trim();

        document.querySelector('.text-here').innerHTML = result;
        window.state = 'listen';
        window.fun += 10;
    };
}

document.querySelector('.pig-image').addEventListener('click', () => {
    if (window.recognizer === undefined) {
        return;
    }
    window.recognizer.start();
});

document.querySelector('#feed-me').addEventListener('click', () => {
    window.fullness += 10;
    if (window.fullness > 100) {
        window.fullness = 100;
    }
});
