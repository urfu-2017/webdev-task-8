module.exports = class {
    constructor() {
        let Recognizer = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (Recognizer) {
            this.isAvaliable = true;
            this.isListening = false;

            this.recognizer = new Recognizer();
            this.recognizer.continuous = true;
            this.recognizer.lang = 'ru-RU';

            return;
        }

        this.isAvaliable = false;
    }

    start() {
        if (!this.isAvaliable) {
            throw new Error('Speech recognition is not supported');
        }

        if (!this.isListening) {
            this.recognizer.start();
            this.isListening = true;
        }
    }

    stop() {
        if (this.isListening) {
            this.recognizer.stop();
            this.isListening = false;
        }
    }
};
