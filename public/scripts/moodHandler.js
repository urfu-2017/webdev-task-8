'use strict';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const field = document.querySelector('.mood-handler__words');
const microphone = document.querySelector('.mood-handler__microphone');

if (SpeechRecognition) {
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
        console.info(e);
        var index = e.resultIndex;
        var result = e.results[index][0].transcript.trim();
        field.innerHTML = result;
        let newMood = Number(result.length) + Number(localStorage.getItem('mood'));

        if (newMood <= 0) {
            newMood = 0;
            recognizer.stop();
            field.innerHTML = 'свинья вас не слушает';
        }
        if (newMood > 100) {
            newMood = 100;
            recognizer.stop();
            field.innerHTML = 'свинья вас не слушает';
        }

        localStorage.setItem('mood', newMood);
    };

    microphone.addEventListener('click', startListening);

} else {
    field.innerHTML = 'Браузер не поддерживает распознователь речи';
}

