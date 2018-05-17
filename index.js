(() => {
    let hrunogochi = {};

    const states = {
        dead: 'dead',
        satiety: 'satiety',
        energy: 'energy',
        mood: 'mood',
        normal: 'normal'
    };

    function data() {
        localStorage.setItem('hrunogochi', JSON.stringify(hrunogochi));
    }

    function start() {
        hrunogochi = {
            satiety: 100,
            energy: 100,
            mood: 100,
            state: states.normal,
            time: Date.now()
        };

        data();
        draw();
    }

    /* eslint max-statements: 0 */
    function draw() {
        const satiety = document.querySelector('.characteristics__satiety .characteristics__value');
        const energy = document.querySelector('.characteristics__energy .characteristics__value');
        const mood = document.querySelector('.characteristics__mood .characteristics__value');
        const dead = document.querySelector('.characteristics__dead');
        const eat = document.querySelector('.eat');
        const hrunogochiSvg = document.querySelector('.hrunogochi-svg');
        const hrunogochiSvgDead = document.querySelector('.hrunogochi-dead-svg');

        satiety.innerText = hrunogochi.satiety;
        energy.innerText = hrunogochi.energy;
        mood.innerText = hrunogochi.mood;

        if (hrunogochi.state === states.dead) {
            hrunogochiSvg.classList.add('none');
            hrunogochiSvgDead.classList.add('block');
        } else {
            hrunogochiSvg.classList.remove('none');
            hrunogochiSvgDead.classList.remove('block');
        }
    }

    function checkParamsInc() {
        if (hrunogochi.state === states.satiety && hrunogochi.satiety === 100) {
            hrunogochi.state = states.normal;
        }
    }

    function loop() {
        if (isDead()) {
            hrunogochi.state = states.dead;
        } else {
            hrunogochi.energy--;
            hrunogochi.satiety--;
            hrunogochi.mood--;

            checkParamsInc();

            if (hrunogochi.state === states.satiety) {
                hrunogochi.satiety += 4;
            }
            if (hrunogochi.state === states.energy) {
                hrunogochi.energy += 4;
            }
        }
        limit();

        data();
    }

    function limit() {
        const min = 0;
        const max = 100;

        for (let param in hrunogochi) {
            if (param !== 'time' && param !== 'state') {
                hrunogochi[param] = hrunogochi[param] < min ? min : hrunogochi[param];
                hrunogochi[param] = hrunogochi[param] > max ? max : hrunogochi[param];
            }
        }
    }

    function game() {
        loop();

        if (!isDead()) {
            notifications();
        }

        draw();
    }

    function isDead() {
        return !(hrunogochi.energy + hrunogochi.satiety) ||
            !(hrunogochi.energy + hrunogochi.mood) || !(hrunogochi.satiety + hrunogochi.mood);
    }

    function checkTime(hrunogochiOld) {
        const time = hrunogochiOld.time;
        const nowTime = Date.now();
        const delta = Math.floor((nowTime - time) / 6000);

        hrunogochi.satiety -= delta;
        hrunogochi.energy -= delta;
        hrunogochi.mood -= delta;
        hrunogochi.time = Date.now();
        hrunogochi.state = states.normal;

        limit();
        data();
    }

    function eating() {
        hrunogochi.state = states.satiety;
    }

    function notifications() {
        if (hrunogochi.satiety === 10 || hrunogochi.energy === 10 || hrunogochi.mood === 10) {
            /* eslint no-unused-vars: 0 */
            const notification = new Notification('Хрюногочи', {
                body: 'Мне плохо!!!'
            });
        }
    }

    function voice() {
        if (window.speechSynthesis) {
            const message = new SpeechSynthesisUtterance('Ha');
            message.lang = 'en-US';
            window.speechSynthesis.speak(message);
        }
    }

    function speech() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognizer = new SpeechRecognition();
        recognizer.lang = 'ru-RU';

        const startListen = document.querySelector('.hrunogochi-svg');
        const log = document.querySelector('.characteristics__speech-log');
        startListen.onclick = function () {
            log.innerText = 'Recognition started';
            if (hrunogochi.mood < 100) {
                recognizer.start();
            }
        };

        recognizer.onresult = function (e) {
            const index = e.resultIndex;
            const result = e.results[index][0].transcript.trim();

            log.innerText = result;
            hrunogochi.mood += 20;
        };
    }

    function listeners() {
        const newgame = document.querySelector('.newgame');
        newgame.addEventListener('click', start, false);
    }

    window.onfocus = function () {
        hrunogochi.state = states.normal;
    };

    window.onblur = function () {
        hrunogochi.state = states.energy;
    };

    window.onload = function () {

        const batteryDom = document.querySelector('.battery__value');
        navigator.getBattery().then(function (battery) {
            batteryDom.innerText = Math.round(battery.level * 100);
            battery.addEventListener('levelchange', function () {
                batteryDom.innerText = Math.round(battery.level * 100);
            });

            battery.addEventListener('chargingchange', function () {
                if (battery.charging) {
                    eating();
                } else {
                    hrunogochi.state = states.normal;
                }
            });
        });

        const Notification = window.Notification || window.webkitNotification;
        Notification.requestPermission();

        if (localStorage.getItem('hrunogochi')) {
            hrunogochi = JSON.parse(localStorage.getItem('hrunogochi'));
            checkTime(hrunogochi);
            data();
        } else {
            start();
        }

        speech();

        draw();

        listeners();

        setInterval(voice, 240000);
        setInterval(game, 60);
    };
})();
