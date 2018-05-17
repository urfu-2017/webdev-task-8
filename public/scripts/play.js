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
        recognizer.onresult = e => {
            if (hrundel.characteristics.mood < 100) {
                recognizedSpeech.value = e.results[e.resultIndex][0].transcript;
                hrundel.characteristics.mood = setCharecteristic(hrundel.characteristics.mood + 4);
            }
            if (hrundel.characteristics.mood === 100) {
                hrundel.characteristics.state = 'life';
            }
        };
    }
};