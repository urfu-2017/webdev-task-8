/* eslint-disable no-unused-vars */

'use strict';

function startTalking() {

    const Speech = window.webkitSpeechRecognition ||
        window.mozSpeechRecognition ||
        window.msSpeechRecognition ||
        window.oSpeechRecognition ||
        window.SpeechRecognition;

    let recognition = new Speech();

    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    let diagnostic = document.querySelector('.speech');
    if (localStorage.getItem('readyToFun')) {
        recognition.start();
        localStorage.setItem('readyToFun', true);
        localStorage.setItem('readyToEat', false);
        localStorage.setItem('readyToSleep', false);
        diagnostic.textContent = 'Ready!';
        console.info('Ready to receive a speech');

        recognition.onresult = event => {
            let phrase = event.results[0][0].transcript;
            diagnostic.textContent = `Your speech:  ${phrase}`;
            let newFun = Number(phrase.length) + Number(localStorage.getItem('fun'));
            if (newFun >= 99) {
                newFun = 100;
                localStorage.setItem('readyToFun', false);
                localStorage.setItem('readyToEat', false);
                localStorage.setItem('readyToSleep', true);
            } else {
                localStorage.setItem('readyToFun', true);
                localStorage.setItem('readyToEat', false);
                localStorage.setItem('readyToSleep', false);
            }
            localStorage.setItem('fun', newFun);
        };
    }
}
