/* eslint-disable no-undef,new-cap */
'use strict';

let isStarving = true;
let isTired = true;
let isDead = false;

class Drawer {
    constructor() {
        this.redraw();
    }

    redraw() {
        this.snap = Snap('.character');

        const earAttr = {
            fill: '#de9096',
            stroke: '#000'
        };
        this.leftEar = this.snap
            .path('M 90,120 T 70,70,160,80 Z')
            .attr(earAttr);
        this.rigthEar = this.snap
            .path('M 280,140 T 300,70,230,90 Z')
            .attr(earAttr);

        this.face = this.snap
            .circle(180, 200, 120)
            .attr({
                fill: '#fda7fa',
                stroke: '#000'
            });

        const eyeAttr = {
            fill: '#000'
        };
        this.leftEye = this.snap
            .circle(135, 145, 20)
            .attr(eyeAttr);
        this.rightEye = this.snap
            .circle(225, 145, 20)
            .attr(eyeAttr);

        this.nose = this.snap.ellipse(180, 200, 30, 25)
            .attr({
                fill: '#f18cc1',
                stroke: '#000'
            });

        const narisAttr = {
            fill: '#de8e8e',
            stroke: '#000'
        };
        this.leftNaris = this.snap
            .ellipse(170, 200, 5, 10)
            .attr(narisAttr);
        this.rightNaris = this.snap
            .ellipse(190, 200, 5, 10)
            .attr(narisAttr);

        this.mouth = this.snap
            .path('M 140,255 T 180,280,230,230 Z')
            .attr({
                fill: '#fff',
                stroke: '#000'
            });
    }

    die() {
        const deadAttr = {
            fill: '#fbc6ff',
            stroke: '#000'
        };
        this.face.attr(deadAttr);
        this.leftEar.attr(deadAttr);
        this.rigthEar.attr(deadAttr);
        this.nose.attr(deadAttr);
        this.leftNaris.attr(deadAttr);
        this.rightNaris.attr(deadAttr);
        this.mouth.remove();
        this.rightEye.remove();
        this.leftEye.remove();
        this.leftEye = this.snap
            .line(150, 160, 120, 130)
            .attr({
                stroke: '#000'
            });
        this.leftEye = this.snap
            .line(150, 130, 120, 160)
            .attr({
                stroke: '#000'
            });
        this.rightEye = this.snap
            .line(240, 160, 210, 130)
            .attr({
                stroke: '#000'
            });
        this.rightEye = this.snap
            .line(240, 130, 210, 160)
            .attr({
                stroke: '#000'
            });
    }
}

function createBattery() {
    if (navigator.getBattery) {
        navigator
            .getBattery()
            .then(initBattery);
    }
}

function initBattery(battery) {
    const satiety = document.getElementById('satiety');
    const satietyBar = document.getElementById('satiety-bar');
    setInterval(() => {
        isStarving = !battery.charging;
        if (battery.charging && satiety.innerText < 100 && isTired && !isDead) {
            satiety.innerText++;
            changeBar(satietyBar, satiety);
        }
    }, 250);
}

function createLight() {
    if ('AmbientLightSensor' in window) {
        const sensor = new AmbientLightSensor();

        sensor.addEventListener('reading', function () {
            isTired = sensor.illuminance < 200;
        });

        sensor.start();
    }
}

function decreaseSatiety() {
    if (!isStarving) {
        return;
    }
    const satiety = document.getElementById('satiety');
    if (satiety.innerText > 0) {
        satiety.innerText--;
        const satietyBar = document.getElementById('satiety-bar');
        changeBar(satietyBar, satiety);
    }
}

function decreaseEnergy() {
    if (!isTired) {
        return;
    }
    const energy = document.getElementById('energy');
    if (energy.innerText > 0) {
        energy.innerText--;
        const energyBar = document.getElementById('energy-bar');
        changeBar(energyBar, energy);
    }
}

function decreaseMood() {
    const mood = document.getElementById('mood');
    if (mood.innerText > 0) {
        mood.innerText--;
        const moodBar = document.getElementById('mood-bar');
        changeBar(moodBar, mood);
    }
}

function changeBar(bar, characteristic) {
    bar.style.width = characteristic.innerText + '%';
    if (characteristic.innerText > 80) {
        bar.style.backgroundColor = 'green';
    } else if (characteristic.innerText > 40) {
        bar.style.backgroundColor = 'yellow';
    } else {
        bar.style.backgroundColor = 'red';
    }
}

function loadCharacteristics() {
    const satietyValue = localStorage.getItem('satiety');
    const satiety = document.getElementById('satiety');
    satiety.innerText = satietyValue;
    const satietyBar = document.getElementById('satiety-bar');
    changeBar(satietyBar, satiety);
    const energyValue = localStorage.getItem('energy');
    const energy = document.getElementById('energy');
    energy.innerText = energyValue;
    const energyBar = document.getElementById('energy-bar');
    changeBar(energyBar, energy);
    const moodValue = localStorage.getItem('mood');
    const mood = document.getElementById('mood');
    mood.innerText = moodValue;
    const moodBar = document.getElementById('mood-bar');
    changeBar(moodBar, mood);
}

function createNotifications() {
    const Notification = window.Notification || window.webkitNotification;

    if (Notification) {
        Notification.requestPermission();
        setInterval(() => {
            if (Notification.permission === 'granted' &&
                (document.getElementById('satiety').innerText <= 10 ||
                document.getElementById('mood').offsetWidth <= 10)) {
                // eslint-disable-next-line no-new
                new Notification('Помогите!!!');
            }
        }, 5000);
    }
}

function enableSleep() {
    const energy = document.getElementById('energy');
    let sleepInterval;
    function sleeping() {
        isTired = false;
        sleepInterval = setInterval(() => {
            if (energy.innerText < 100 && !isDead) {
                energy.innerText++;
                const energyBar = document.getElementById('energy-bar');
                changeBar(energyBar, energy);
            }
        }, 250);
    }
    window.addEventListener('blur', sleeping);

    function stopSleeping() {
        isTired = true;
        clearInterval(sleepInterval);
    }
    window.addEventListener('focus', stopSleeping);
}

function createSpeech() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const speech = document.getElementById('speech');
    const mood = document.getElementById('mood');

    if (SpeechRecognition) {
        const recognizer = new SpeechRecognition();
        recognizer.lang = 'ru-RU';
        recognizer.continuous = true;

        const startListening = () => {
            if (isStarving && isTired && !isDead) {
                speech.innerText = 'Я тебя слушаю';
                recognizer.start();
            }
        };

        recognizer.onresult = function (e) {
            const index = e.resultIndex;
            const result = e.results[index][0].transcript.trim();
            speech.innerText = result;
            mood.innerText += result.length;
            if (mood.innerText >= 100) {
                mood.innerText = '100';
                recognizer.stop();
            }
            const moodBar = document.getElementById('mood-bar');
            changeBar(moodBar, mood);
        };

        const character = document.getElementById('character');
        character.addEventListener('click', startListening);
    }
}

function createSounds() {
    const PHRASES = ['Души мне не жаль, я проживу и без неё.',
        'Сын мой...в день когда ты родился,сами леса Лордерона прошептали мне это имя.',
        'Я такой же осёл как и вы, сэр!', 'Ты что ли король? Я за тебя не голосовал.',
        'Да пребудет с тобой сила!', 'Человек? Во мне уже давно не осталось ничего человеческого.',
        'Я с радостью приму на себя проклятье, лишь бы спасти свой народ.', 'Мы не будем рабами!',
        'Скоро Азерот будет разрушен, и все сгорит дотла в тени моих крыльев!', 'Моя прелесть.',
        'Жизнь как коробка шоколадных конфет: никогда не знаешь, какая начинка тебе попадётся.',
        'И того, и другого. И можно без хлеба...', 'У меня есть мысль, и я её думаю.',
        'Поели — можно и поспать. Поспали — можно и поесть.'
    ];
    let volumeValue = 0.5;
    if (window.speechSynthesis) {
        setInterval(() => {
            if (!isDead) {
                const randomPhrase = PHRASES[Math.floor(Math.random() * PHRASES.length)];
                const message = new SpeechSynthesisUtterance(randomPhrase);
                message.lang = 'ru-RU';
                message.volume = volumeValue;
                window.speechSynthesis.speak(message);
            }
        }, 10000);

        const volume = document.getElementById('volume');
        volume.addEventListener('change', () => (volumeValue = volume.value / 100));
    }
}

document.addEventListener('DOMContentLoaded',
    function () {
        const drawer = new Drawer();
        loadCharacteristics();
        createNotifications();
        createBattery();
        createLight();
        enableSleep();
        createSpeech();
        createSounds();
        const reestablishCharacteristics = () => {
            const characteristics = [].slice.call(document
                .querySelectorAll('.characteristic-value'));
            characteristics.forEach((c) => (c.innerText = '100'));
            const characteristicBars = [].slice.call(document
                .querySelectorAll('.characteristic-bar'));
            characteristicBars.forEach((c) => (c.width = '100%'));
        };
        document.getElementById('reset').addEventListener('click', reestablishCharacteristics);
        document.getElementById('reset').addEventListener('click', drawer.redraw);

        setInterval(() => {
            const characteristics = [].slice.call(document
                .querySelectorAll('.characteristic-value'));
            if (characteristics.filter((c) => (c.innerText === '0')).length > 1) {
                isDead = true;
                drawer.die();
            }
        }, 1000);
        setInterval(() => {
            decreaseSatiety();
            decreaseEnergy();
            decreaseMood();
        }, 1000);
        setInterval(() => {
            localStorage.setItem('satiety', document.getElementById('satiety').innerText);
            localStorage.setItem('energy', document.getElementById('energy').innerText);
            localStorage.setItem('mood', document.getElementById('mood').innerText);
        }, 1000);
    });
