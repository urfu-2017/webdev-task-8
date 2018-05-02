window.isSleep = false;
let timeOff;

setInterval(function () {
    if (!window.isSleep && !window.dead) {
        window.health.energy -= window.health.energy - 1 < 0 ? 0 : 1;
        window.health.refresh(window.health.energyHTML, window.health.energy);
    }
}, 1000 * 60);

document.onvisibilitychange = function () {
    if (window.dead) {
        return;
    }
    if (document.visibilityState === 'hidden') {
        sleep();
        state();
    }
    if (document.visibilityState === 'visible') {
        up();
    }
};

if ('AmbientLightSensor' in window && !window.dead) {
    const sensor = new AmbientLightSensor(); // eslint-disable-line
    sensor.addEventListener('reading', function () {
        if (sensor.illuminance < 0.3) {
            sleep();
        } else {
            up();
        }
    });

    sensor.start();
}

function sleep() {
    window.speak = 'хррр хррр';
    window.isSleep = true;
    window.mood.recognize.stop();
    window.mood.listening = false;
    window.svg.state.sleep();
    timeOff = setInterval(function () {
        window.health.energy += window.health.energy + 1 > 100 ? 0 : 1;
        window.health.refresh(window.health.energyHTML, window.health.energy);
    }, 1000 * 15);
}

function up() {
    window.speak = 'хрю хрю';
    clearInterval(timeOff);
    window.isSleep = false;
    setTimeout(() => {
        window.svg.state.default();
        window.health.state(50);
        window.health.state(10);
    }, 1000);
}

function state() {
    if (window.health.satiety <= 10) {
        // сообещние я проголодался
        message('Я проголодался!:(');
    }
    if (window.health.mood <= 10) {
        // сообщение мне скучно
        message('Я соскучился!:(');
    }
}

window.Notification = window.Notification ||
window.webkitNotification;

if (!window.Notification) {
    console.warn('Notifications are not supported!');
}

function message(text) {
    if (window.Notification) {
        Notification.requestPermission(function () {
            const notification = new Notification('Заголовок', {
                body: text
            });

            notification.onerror = function () {
                alert('Probably, blocked :\'C'); // eslint-disable-line
            };
        });
    }
}
