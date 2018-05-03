let hrunogochi = {};

// function notify() {
//     const Notification = window.Notification;
// }

function setData() {
    if (hrunogochi.eat > 100) {
        hrunogochi.eat = 100;
    }
    if (hrunogochi.energy > 100) {
        hrunogochi.energy = 100;
    }
    if (hrunogochi.mood > 100) {
        hrunogochi.mood = 100;
    }
    localStorage.setItem('hrunogochi', JSON.stringify(hrunogochi));
    document.querySelector('.hrunogochi').innerHTML = JSON.stringify(hrunogochi);
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
        if (battery.charging) {
            return 1;
        }

        return -1;
    }

    return -1;
}

async function frequency() {
    hrunogochi.time = Date.now();
    // Изменение состояния сытости
    hrunogochi.eat += await eatUpdate();
    hrunogochi.energy -= 1;
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

window.onload = () => {
    if (localStorage.getItem('hrunogochi')) {
        hrunogochi = JSON.parse(localStorage.getItem('hrunogochi'));
        updateFromTime(hrunogochi);
    } else {
        newGame();
    }

    setInterval(() => frequency(), 5000);
};

// if (window.speechSynthesis) {
//     var message = new SpeechSynthesisUtterance('Привет!');
//     message.lang = 'ru-RU';
//     window.speechSynthesis.speak(message);
// }
