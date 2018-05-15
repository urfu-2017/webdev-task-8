const MAGIC_STORAGE_KEY = 'HrunagochiGameState';
const PINK = '#f97aad';
const DARK_PINK = '#ef629a';
const DARKEST_PINK = '#d14f82';
const HRU = {
    NORMAL: 'NORMAL',
    SLEEP: 'SLEEP',
    DEAD: 'DEAD',
    EAT: 'EAT',
    LISTEN: 'LISTEN'
};
const DEFAULT_STATE = {
    indicators: {
        satiety: 100,
        energy: 100,
        mood: 100
    },
    status: HRU.NORMAL
};
const MAX_SAY_INTERVAL_SECONDS = 20;
const PHRASES = [
    'Я свинья, но умею говорить!',
    'Хозяин, как дела?',
    'Свинья тоже человек!',
    'Квадрат гипотенузы равен сумме квадратов катетов',
    'Здесь могла бы быть ваша реклама',
    'Неси жрать',
    'Есть чо?',
    'Выпусти меня',
    'Где я?',
    'ааааааааааааа',
    'Хрю-хрю'
];

function getDefaultState() {
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
}

function getRandomInterval() {
    return Math.random() * MAX_SAY_INTERVAL_SECONDS * 1000;
}

function getRandomPhrase() {
    return PHRASES[Math.round(Math.random() * (PHRASES.length - 1))];
}

const TICK_INTERVAL = 1000;
const DECREASCE_ON_TICK = TICK_INTERVAL / 1000;
const INCREASE_ON_TICK = 3 * TICK_INTERVAL / 1000;

class Game {
    constructor(state) {
        this.state = state || getDefaultState();

        this._setupSpeechRecognition();
        this._setupTabVisibility();
        this._setupBattery();
        this._setupButtons();
        this._setupRandomPhrases();

        Notification.requestPermission();
    }

    _setupSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognizer = new SpeechRecognition();
        this.recognizer.lang = 'ru-RU';
        this.recognizer.onresult = e => {
            const index = e.resultIndex;
            const result = e.results[index][0].transcript;
            this.state.message = result;
            this.normal();
        };
    }

    _setupBattery() {
        window.navigator.getBattery().then(b => {
            b.onchargingchange = () => {
                console.info(b.charging);
                this._onCharge(b.charging);
            };
        });
    }

    _setupTabVisibility() {
        document.addEventListener('visibilitychange', () => {
            this._onVisibilityChange(document.visibilityState === 'visible');
        });
    }

    _setupButtons() {
        document.querySelector('.eat-btn').addEventListener('click', () => this.eat());
        document.querySelector('.listen-btn').addEventListener('click', () => this.listen());
        document.querySelector('.reset-btn').addEventListener('click', () => this.reset());
    }

    tick() {
        if (this.state.status === HRU.DEAD) {
            return;
        }

        this._updateIndicators();
        this._doActions();

        this.save();
    }

    _setupRandomPhrases() {
        const sayByTimeout = () => {
            this.say();
            setTimeout(sayByTimeout, getRandomInterval());
        };
        setTimeout(sayByTimeout, getRandomInterval());
    }

    _updateIndicators() {
        Object.keys(this.state.indicators).forEach(i => {
            this.state.indicators[i] -= DECREASCE_ON_TICK;
            if (this.state.indicators[i] < 0) {
                this.state.indicators[i] = 0;
            }
        });
    }

    _doActions() {
        if (this.isDead()) {
            this.state.status = HRU.DEAD;

            return;
        }

        if (this.state.status === HRU.SLEEP) {
            this._handleSleep();
        }

        if (this.state.status === HRU.LISTEN) {
            this._handeListen();
        }

        if (this.state.status === HRU.EAT) {
            this._handleEat();
        }

        if (this.isBoring()) {
            /* eslint-disable-next-line no-new */
            new Notification('Мне скучно, человек!');
        }
    }

    _handleSleep() {
        this.state.indicators.energy += INCREASE_ON_TICK;
        if (this.state.indicators.energy >= 100) {
            this.state.indicators.energy = 100;
            this.normal();
        }
    }

    _handeListen() {
        this.state.indicators.mood += INCREASE_ON_TICK;
        if (this.state.indicators.mood >= 100) {
            this.state.indicators.mood = 100;
            this.normal();
        }
    }

    _handleEat() {
        this.state.indicators.satiety += INCREASE_ON_TICK;
        if (this.state.indicators.satiety >= 100) {
            this.state.indicators.satiety = 100;
            this.normal();
        }
    }

    isBoring() {
        return (this.state.indicators.satiety <= 10 || this.state.indicators.mood <= 10) &&
            document.visibilityState === 'hidden';
    }

    isDead() {
        return Object.values(this.state.indicators).filter(i => i === 0).length > 1;
    }

    say() {
        if (this.state.status !== HRU.DEAD) {
            const volume = parseInt(document.querySelector('.volume').value) / 100;
            const phrase = getRandomPhrase();
            var s = new SpeechSynthesisUtterance(phrase);
            s.volume = volume;

            window.speechSynthesis.speak(s);
        }
    }

    _onCharge(charging) {
        if (charging) {
            this.eat();
        } else {
            this.normal();
        }
    }

    _onVisibilityChange(visible) {
        if (!visible) {
            this.sleep();
        } else {
            this.normal();
        }
    }

    listen() {
        if (this.state.status === HRU.DEAD) {
            return;
        }

        if (this.state.status === HRU.NORMAL) {
            this.state.status = HRU.LISTEN;
            this.recognizer.start();
        }
    }

    sleep() {
        if (this.state.status === HRU.DEAD) {
            return;
        }

        this.recognizer.stop();
        this.state.status = HRU.SLEEP;
    }

    eat() {
        if (this.state.status === HRU.DEAD) {
            return;
        }

        if (this.state.status !== HRU.SLEEP) {
            this.recognizer.stop();
            this.state.status = HRU.EAT;
        }
    }

    normal() {
        if (this.state.status === HRU.DEAD) {
            return;
        }

        this.recognizer.stop();
        this.state.status = HRU.NORMAL;
    }

    save() {
        const serializedState = JSON.stringify(this.state);
        window.localStorage.setItem(MAGIC_STORAGE_KEY, serializedState);
    }

    static restore() {
        const serializedState = JSON.parse(localStorage.getItem(MAGIC_STORAGE_KEY));

        return new Game(serializedState);
    }

    reset() {
        this.state = getDefaultState();
        this.save();
    }
}

class Pig {
    constructor() {
        /* eslint-disable-next-line new-cap,no-undef */
        const s = Snap('.hru');

        this.head = s.circle(150, 150, 100);
        this.head.attr({
            fill: PINK,
            stroke: DARK_PINK,
            strokeWidth: 3
        });

        this.leftEye = s.ellipse(110, 110, 15, 15);
        this.rightEye = s.ellipse(190, 110, 15, 15);

        this.noose = s.ellipse(150, 160, 25, 20);
        this.noose.attr({
            fill: DARK_PINK,
            stroke: DARKEST_PINK,
            strokeWidth: 2
        });
        this.leftNoose = s.circle(140, 160, 5);
        this.rightNoose = s.circle(160, 160, 5);

        this.mouth = s.ellipse(150, 210, 40, 10);
        this.mouth.attr({
            fill: DARK_PINK,
            stroke: DARKEST_PINK,
            strokeWidth: 3
        });

        this.leftEar = s.polygon(100, 70, 70, 100, 60, 60);
        this.leftEar.attr({
            fill: DARKEST_PINK,
            stroke: DARK_PINK,
            strokeWidth: 4
        });

        this.rightEar = s.polygon(200, 70, 230, 100, 240, 60);
        this.rightEar.attr({
            fill: DARKEST_PINK,
            stroke: DARK_PINK,
            strokeWidth: 4
        });
    }

    eat() {
        if (this.eatId) {
            return;
        }

        this.eatId = setInterval(() => this.nom(), 500);
    }

    closeEyes() {
        this.leftEye.animate({ ry: 2 }, 300);
        this.rightEye.animate({ ry: 2 }, 300);
    }

    openEyes() {
        this.leftEye.animate({ ry: 15, rx: 15 }, 300);
        this.rightEye.animate({ ry: 15, rx: 15 }, 300);
    }

    smile() {
        this.mouth.animate({ rx: 55 }, 300);
    }

    normal() {
        this.openEyes();
        this.mouth.animate({ rx: 40, ry: 10 }, 300);
        clearInterval(this.eatId);
        this.eatId = null;
    }

    die() {
        this.leftEye.animate({ rx: 7, ry: 7 }, 300);
        this.rightEye.animate({ rx: 4, ry: 4 }, 300);
        this.mouth.animate({ rx: 10, ry: 5 }, 300);
    }

    nom() {
        this.mouth.animate({ ry: 2 }, 200, () => {
            this.mouth.animate({ ry: 10 }, 200);
        });
    }
}

window.onload = () => {
    const game = Game.restore();
    const pig = new Pig();

    const indicators = document.querySelector('.indicators');
    const message = document.querySelector('.message');

    const statusToAnimation = {
        [HRU.NORMAL]: () => pig.normal(),
        [HRU.SLEEP]: () => pig.closeEyes(),
        [HRU.DEAD]: () => pig.die(),
        [HRU.LISTEN]: () => pig.smile(),
        [HRU.EAT]: () => pig.eat()
    };

    function tickAndRender() {
        game.tick();
        animate();
        renderIndicators();
        renderMessage();
    }

    function animate() {
        const animation = statusToAnimation[game.state.status];

        animation();
    }

    function renderIndicators() {
        const state = JSON.stringify(game.state, null, 4);
        const pre = document.createElement('pre');
        pre.innerText = state;

        indicators.innerHTML = '';
        indicators.appendChild(pre);
    }

    function renderMessage() {
        message.innerText = game.state.message || '';
    }

    tickAndRender();
    setInterval(tickAndRender, TICK_INTERVAL);
};
