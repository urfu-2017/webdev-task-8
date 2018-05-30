const Notification = window.Notification || window.webkitNotification;
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const MAX_POINTS = 100;
const MIN_POINTS = 10;

var hero;

const heroActions = {
    none: 'NONE',
    eating: 'EATING',
    sleeping: 'SLEEPING',
    listening: 'LISTENING'
};

class Hero {
    setDefaults() {
        this.health = MAX_POINTS;
        this.energy = MAX_POINTS;
        this.mood = MAX_POINTS;
        this.action = heroActions.none;
        this.speechRecognizer = getSpeechRecognizer();
        this.recognizedText = '';
    }

    constructor(state) {
        if (!state) {
            this.setDefaults();

            return;
        }
        this.health = state.health;
        this.energy = state.energy;
        this.mood = state.mood;
        this.action = state.action;
        this.speechRecognizer = getSpeechRecognizer();
    }

    getState() {
        return {
            health: this.health,
            energy: this.energy,
            mood: this.mood,
            action: this.action
        };
    }

    isDead() {
        return this.health === 0 && this.energy === 0 ||
        this.health === 0 && this.mood === 0 ||
        this.energy === 0 && this.mood === 0;
    }

    update() {
        if (this.action === heroActions.dead) {
            return;
        }

        this.health = Math.max(0, this.health - 10);
        this.energy = Math.max(0, this.energy - 10);
        this.mood = Math.max(0, this.mood - 1);

        if (this.health <= MIN_POINTS) {
            this.notify('Здоровье');
        }

        if (this.energy <= MIN_POINTS) {
            this.notify('Энергия');
        }

        if (this.mood <= MIN_POINTS) {
            this.notify('Настроение');
        }

        this.changeActionIfNeeded();
    }

    changeActionIfNeeded() {
        if (this.action === heroActions.sleeping) {
            this.sleep();
        } else if (this.action === heroActions.eating) {
            setTimeout(() => {
                this.action = heroActions.none;
            }, 2000);
        } else if (this.action === heroActions.listening && this.mood === MAX_POINTS - 1) {
            this.action = heroActions.none;
        }
    }

    eat() {
        this.health = Math.min(this.health + 5, MAX_POINTS);
    }

    sleep() {
        this.energy = Math.min(this.energy + 5, MAX_POINTS);
    }

    async notify(text) {
        if (!Notification || Notification.permission === 'denied') {
            return;
        }
        const permissionResult = await Notification.requestPermission();

        if (permissionResult === 'granted') {
            return new Notification(text, { body: 'Говорит хрюн' });
        }
    }

    listen() {
        if (!SpeechRecognition || this.action === heroActions.dead) {
            return;
        }
        this.action = heroActions.listening;
        this.speechRecognizer.start();
    }


}

function getSpeechRecognizer() {
    var speechRecognizer;

    if (SpeechRecognition) {
        speechRecognizer = new SpeechRecognition();
        speechRecognizer.lang = 'en-US';
        speechRecognizer.continuous = true;
        speechRecognizer.interimResults = true;
        speechRecognizer.onresult = recognizedTextEvent => {
            if (this.action !== heroActions.listening) {
                this.speechRecognizer.stop();

                return;
            }
            this.recognizedText = '';
            this.mood = Math.min(this.mood + 10, MAX_POINTS);
            for (let i = recognizedTextEvent.resultIndex;
                i < recognizedTextEvent.results.length; i += 1) {
                this.recognizedText += recognizedTextEvent.results[i][0].transcript;
            }
        };
    }

    return speechRecognizer;
}

function render() {
    hero.update();

    document.querySelector('.state__health').textContent = hero.health;
    document.querySelector('.state__energy').textContent = hero.energy;
    document.querySelector('.state__mood').textContent = hero.mood;
    document.getElementById('recognizedText').textContent = hero.recognizedText;

    if (hero.isDead()) {
        // eslint-disable-next-line
        alert('Busted!');
    }
    saveState();
}

function saveState() {
    document.cookie = `state=${JSON.stringify(hero.getState())}`;
}

function getHeroFromState() {
    if (document.cookie) {
        const oldState = JSON.parse(document.cookie.split('=')[1]);

        return new Hero(oldState);
    }

    return new Hero();
}

window.onload = () => {
    hero = getHeroFromState();

    document.getElementById('eat').onclick = () => hero.eat();
    // eslint-disable-next-line
    document.getElementById('restart').onclick = () => hero = new Hero();
    document.querySelector('.hero__avatar').onclick = () => hero.listen();

    render();

    if (hero.action === heroActions.sleeping) {
        hero.action = heroActions.none;
    }

    setInterval(() => render(), 1500);
};

window.onblur = () => {
    hero.action = heroActions.sleeping;
};

window.onfocus = () => {
    hero.action = heroActions.none;
};

