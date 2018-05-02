'use strict';
const SpeechRecognition = window.SpeechRecognition ||
    window.webkitSpeechRecognition;
const field = document.querySelector('.speech-recognition__words');
const bar = document.querySelector('.mood-lack');

if (SpeechRecognition) {
    const pig = document.querySelector('.pig');
    const recognizer = new SpeechRecognition();
    recognizer.lang = 'en-US';
    recognizer.continuous = true;

    const startListening = () => {
        console.info('Recognition started');
        field.innerHTML = 'Recording started';
        recognizer.start();
    };

    recognizer.addEventListener('error', function (event) {
        console.info('Recognition error: ' + event.message);
    });
    recognizer.addEventListener('end', function () {
        console.info('Recognition ended');
    });
    recognizer.onresult = function (e) {
        var index = e.resultIndex;
        var result = e.results[index][0].transcript.trim();
        field.innerHTML = result;
        let newMood = bar.offsetWidth - result.split('').length * 10;
        if (newMood <= 0) {
            newMood = 0;
            recognizer.stop();
        }
        bar.style.width = newMood;
    };
    pig.addEventListener('click', startListening);
} else {
    field.innerHTML = 'Speech recognition is not supported. Please switch to another browser.';
}

