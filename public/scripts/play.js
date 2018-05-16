'use strict';
/* eslint-disable */

const play = document.getElementsByClassName('hrundel_img')[0];
const recognizedSpeech = document.getElementsByClassName('hrundel_recognized_speech')[0];
play.onclick = function () {
    if ((window.SpeechRecognition || window.webkitSpeechRecognition) &&
        hrundel.characteristics.state === 'life') {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognizer = new SpeechRecognition();

        recognizer.lang = 'en-US';
        recognizer.start();
        recognizer.onresult = function e() {
            var index = e.resultIndex;
            let result = e.results[index][0].transcript.trim();
            recognizedSpeech.innerHTML = result;
            if (hrundel.characteristics.mood < 100) {
                hrundel.characteristics.state = 'playing';
            }
            if (hrundel.characteristics.mood === 100) {
                hrundel.characteristics.state = 'life';
            }
        };
    }
};