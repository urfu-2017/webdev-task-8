'use strict';
(() => {
    const SpeechRecognition = window.SpeechRecognition ||
        window.webkitSpeechRecognition;
    const field = document.querySelector('.speech__words');

    if (SpeechRecognition) {
        const pig = document.querySelector('.pig');
        const recognizer = new SpeechRecognition();
        recognizer.lang = 'en-US';
        recognizer.continuous = true;

        const startListening = () => {
            field.innerHTML = 'Recording started';
            recognizer.start();
            window.Pig.startEnjoying();
        };

        recognizer.addEventListener('error', function (event) {
            console.info('Recognition error: ' + event.message);
        });
        recognizer.onresult = function (e) {
            let index = e.resultIndex;
            let result = e.results[index][0].transcript.trim();
            field.innerText = result;
            recognizer.stop();
            window.Pig.finishEnjoying();
        };
        pig.addEventListener('click', startListening);
    } else {
        field.innerText = 'Speech recognition is not supported. Please switch to another browser.';
    }
})();

