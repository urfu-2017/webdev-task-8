import { recognitionLanguage } from '../../config/config';

let recognizer;

function isAvailable() {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);


}

function init() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognizer = SpeechRecognition ? createRecognizer(SpeechRecognition) : null;
}

function createRecognizer(SpeechRecognition) {
    const speechRecognizer = new SpeechRecognition();
    speechRecognizer.lang = recognitionLanguage;
    speechRecognizer.continuous = true;
    speechRecognizer.interimResults = true;

    return speechRecognizer;
}

function startRecognition(onResult) {
    recognizer.onresult = function (e) {
        var index = e.resultIndex;
        var result = e.results[index][0].transcript.trim();
        onResult(result);
    };

    recognizer.start();
}

function stopRecognition() {
    recognizer.stop();
}

export default { isAvailable, startRecognition, stopRecognition, init };
