let hrunogochi = {};

function setData() {
    maxDataLimiter();
    minDataLimiter();
    isDead();
    notify();
    localStorage.setItem('hrunogochi', JSON.stringify(hrunogochi));
    document.querySelector('.hrunogochi').innerHTML = JSON.stringify(hrunogochi);
}

function maxDataLimiter() {
    if (hrunogochi.eat > 100) {
        hrunogochi.eat = 100;
    }
    if (hrunogochi.energy > 100) {
        hrunogochi.energy = 100;
    }
    if (hrunogochi.mood > 100) {
        hrunogochi.mood = 100;
    }
}

function minDataLimiter() {
    if (hrunogochi.eat < 0) {
        hrunogochi.eat = 0;
    }
    if (hrunogochi.energy < 0) {
        hrunogochi.energy = 0;
    }
    if (hrunogochi.mood < 0) {
        hrunogochi.mood = 0;
    }
}

function isDead() {
    if ((hrunogochi.eat === 0 && hrunogochi.energy === 0) ||
        (hrunogochi.eat === 0 && hrunogochi.mood === 0) ||
        (hrunogochi.energy === 0 && hrunogochi.mood === 0)) {
        const log = document.querySelector('.log');
        log.innerHTML = 'DEAD!!!!!!!';
    }
}

function newGame() {
    hrunogochi = {
        time: Date.now(),
        eat: 100,
        energy: 100,
        mood: 100
    };
    setData();
}

async function eatUpdate() {
    if (navigator.getBattery) {
        const battery = await navigator.getBattery();
        if (battery.charging && !document.hidden) {
            return 3;
        }

        return -1;
    }

    return -1;
}

function energyUpdate() {
    if (document.hidden) {
        return 3;
    }

    return -1;
}

async function frequency() {
    hrunogochi.time = Date.now();
    // Изменение состояния сытости
    hrunogochi.eat += await eatUpdate();
    hrunogochi.energy += await energyUpdate();
    hrunogochi.mood -= 1;
    setData();
}

function updateFromTime(hrunogochiPast) {
    const pastTime = hrunogochiPast.time;
    const deltaMinutes = Math.floor((Date.now() - pastTime) / 1000 / 5);
    if (deltaMinutes > 0) {
        hrunogochi.time = Date.now();
        hrunogochi.eat -= deltaMinutes;
        hrunogochi.energy -= deltaMinutes;
        hrunogochi.mood -= deltaMinutes;
    }
    setData();
}

function recognize() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognizer = new SpeechRecognition();
    recognizer.lang = 'ru-RU';

    const speaker = document.querySelector('.svg');
    const log = document.querySelector('.log');
    speaker.onclick = () => {
        if (hrunogochi.mood < 100) {
            recognizer.start();
        }
    };
    recognizer.onresult = function (e) {
        var index = e.resultIndex;
        var result = e.results[index][0].transcript.trim();

        log.innerHTML = result;
        hrunogochi.mood += 10;
        setData();
    };
}

function notify() {
    /* eslint no-unused-vars: 0 */
    if (hrunogochi.eat < 10 || hrunogochi.mood < 10 || hrunogochi.energy < 10) {
        const notification = new Notification('Hrunogochi', {
            body: 'Не забыл про меня?'
        });
    }
}

function sound() {
    if (window.speechSynthesis) {
        var message = new SpeechSynthesisUtterance('хрю');
        message.lang = 'ru-RU';
        window.speechSynthesis.speak(message);
    }
}

window.onload = () => {
    if (localStorage.getItem('hrunogochi')) {
        hrunogochi = JSON.parse(localStorage.getItem('hrunogochi'));
        updateFromTime(hrunogochi);
    } else {
        newGame();
    }

    recognize();

    const Notification = window.Notification || window.webkitNotification;
    Notification.requestPermission();

    const newGameBtn = document.querySelector('.newgame');
    newGameBtn.onclick = () => {
        newGame();
    };

    setInterval(() => sound(), 300000);
    setInterval(() => frequency(), 5000);
};
