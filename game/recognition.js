export class Recognition {

    constructor(statusListener, resultContainer) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.isAllow = false;

        if (SpeechRecognition) {
            this.isAllow = true;
            this.recognizer = new SpeechRecognition();
            this.recognizer.lang = 'ru-RU';
            this.recognizer.interimResults = true;

            this.recognizer.onstart = () => this.onStart();
            this.recognizer.onend = () => this.onEnd();
            this.recognizer.onresult = (event) => this.onResult(event);
        }

        this.status = false;
        this.resultContainer = resultContainer;
        this.statusListener = statusListener;
    }

    stop() {
        if (this.status && this.isAllow) {
            this.recognizer.stop();
        }
    }

    start() {
        if (!this.status && this.isAllow) {
            this.recognizer.start();
        }
    }

    onResult(event) {
        const result = event.results[0][0].transcript;
        this.resultContainer.textContent = result;
    }

    onStart() {
        this.statusListener(true);
    }

    onEnd() {
        this.statusListener(false);
    }
}
