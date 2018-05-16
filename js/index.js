const health = window.health = {
    satiety: 100, // сытость
    satietyHTML: 'health__satiety-value',
    energy: 100,
    energyHTML: 'health__energy-value',
    mood: 100, // настроение
    moodHTML: 'health__mood-value',
    dead() {
        let count = 0;
        for (const key in this) {
            if (typeof this[key] === 'number' && this[key] === 0) {
                count++;
            }
        }
        if (count >= 2) {
            window.svg.state.dead();
            window.dead = true;
        }
    },
    state(threshold) {
        let count = 0;
        for (const key in this) {
            if (typeof this[key] === 'number' && this[key] <= threshold) {
                count++;
            }
        }
        if (!window.isSleep) {
            this.howMooth(count, threshold);
        }
    },
    refresh(classHealth, value) {
        const elem = document.getElementsByClassName(classHealth)[0];
        elem.innerHTML = value + '%';
        this.dead();
        this.state(50);
        this.state(10);
        addCookies();
    },
    howMooth(count, threshold) {
        if (count !== 0) {
            if (threshold === 10) {
                window.svg.mouth.attr({ opacity: 1 });
                window.svg.mouthSadly.attr({ opacity: 0 });
                window.svg.mouth.transform('s-1');
            } else {
                window.svg.mouth.attr({ opacity: 0 });
                window.svg.mouthSadly.attr({ opacity: 1 });
            }
        }
    }
};
let voice = 0.5;
window.dead = false;
window.speak = 'хрю хрю';

if (Cookies.get('satiety')) { // eslint-disable-line
    health.satiety = parseInt(Cookies.get('satiety')); // eslint-disable-line
    health.energy = parseInt(Cookies.get('energy')); // eslint-disable-line
    health.mood = parseInt(Cookies.get('mood')); // eslint-disable-line
}

health.refresh(health.satietyHTML, health.satiety);
health.refresh(health.energyHTML, health.energy);
health.refresh(health.moodHTML, health.mood);

function addCookies() {
    Cookies.set('satiety', health.satiety, { expires: 7 }); // eslint-disable-line
    Cookies.set('energy', health.energy, { expires: 7 }); // eslint-disable-line
    Cookies.set('mood', health.mood, { expires: 7 }); // eslint-disable-line
}

setInterval(addCookies, 1000 * 60);

document.querySelector('.newGame').addEventListener('click', newGame);

function newGame() {
    health.satiety = 100;
    health.mood = 100;
    health.energy = 100;
    addCookies();
    health.refresh(health.satietyHTML, health.satiety);
    health.refresh(health.energyHTML, health.energy);
    health.refresh(health.moodHTML, health.mood);
    window.svg.state.default();
    window.svg.dead = false;
}

document.querySelector('.voice').addEventListener('click', (event) => {
    if (event.target.innerHTML === '+') {
        voice += voice < 1 ? 0.1 : 0;
    }
    if (event.target.innerHTML === '-') {
        voice += voice > 0 ? -0.1 : 0;
    }
});

if (window.speechSynthesis) {
    setInterval(function () {
        if (window.dead) {
            return;
        }
        var message = new SpeechSynthesisUtterance();
        var voices = window.speechSynthesis.getVoices();
        message.text = window.speak;
        message.lang = 'ru-RU';
        message.voice = voices[3];
        message.rate = 2;
        message.pitch = 2;
        message.volume = voice;
        window.speechSynthesis.speak(message);
    }, 1000 * 20);
}
