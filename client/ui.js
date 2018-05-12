import {
    createChangeWindowStateEvent,
    createChangeFeedEvent,
    FeedEvent,
    createHrunListenEvent
} from './events';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

class CharacteristicOutput {
    constructor(selector, initial) {
        this.element = document.querySelector(selector);
        this.set(initial);
    }

    set(value) {
        this.element.innerHTML = value;
    }
}

export default class UI {
    constructor(root, game) {
        this.game = game;
        this.root = root;

        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'ru-RU';
        this.recognition.maxAlternatives = 1;

        this.isActiveTab = true;
        this.currentLum = null;

        this.newGameButton = document.querySelector('.new-game-button');
        this.feedButton = document.querySelector('.feed-button');
        this.speechRecognitionContainer = document.querySelector('.speech-recognition-container');
        this.satietyOutput = new CharacteristicOutput(
            '.ch-satiety-output',
            this.game.states.satiety.value
        );
        this.energyOutput = new CharacteristicOutput(
            '.ch-energy-output',
            this.game.states.energy.value
        );
        this.happyOutput = new CharacteristicOutput(
            '.ch-happy-output',
            this.game.states.happy.value
        );
    }

    onUpdate() {
        this.satietyOutput.set(this.game.states.satiety.value);
        this.energyOutput.set(this.game.states.energy.value);
        this.happyOutput.set(this.game.states.happy.value);
    }

    linkRecognitionEvent() {
        let isRecognitionInProgress = false;
        this.game.hrun.element.addEventListener('click', () => {
            if (!isRecognitionInProgress) {
                this.recognition.start();
                this.root.dispatchEvent(createHrunListenEvent(true));
                isRecognitionInProgress = true;
            }
        });
        this.recognition.addEventListener('speechend', () => {
            isRecognitionInProgress = false;
            this.root.dispatchEvent(createHrunListenEvent(false));
            this.recognition.stop();
        });
        this.recognition.addEventListener('result', (e) => {
            this.speechRecognitionContainer.innerHTML = e.results[0][0].transcript;
        });
        this.recognition.addEventListener('nomatch', () => {
            this.speechRecognitionContainer.innerHTML = 'Ничего не понятно что вы сказали!';
        });
    }

    linkBatteryEvent() {
        if (navigator.getBattery) {
            navigator.getBattery().then((battery) => {
                this.root.dispatchEvent(createChangeFeedEvent(battery.charging));
                battery.addEventListener('chargingchange', () => {
                    this.root.dispatchEvent(createChangeFeedEvent(battery.charging));
                });
            });
            this.feedButton.className = 'hidden';

            this.feedButton.addEventListener('click', () => {
                this.root.dispatchEvent(FeedEvent);
            });
        } else {
            this.feedButton.addEventListener('click', () => {
                this.root.dispatchEvent(FeedEvent);
            });
        }
    }

    link() {
        this.newGameButton.addEventListener('click', () => {
            this.game.newGame();
        });
        this.root.addEventListener('ui:update', () => {
            this.onUpdate();
        });

        this.linkRecognitionEvent();

        this.root.addEventListener('window:changeState', (e) => {
            this.isActiveTab = e.detail.state;
        });
        window.addEventListener('blur', () => {
            this.root.dispatchEvent(createChangeWindowStateEvent(false));
        });
        window.addEventListener('focus', () => {
            this.root.dispatchEvent(createChangeWindowStateEvent(true));
        });

        this.linkBatteryEvent();
    }
}
