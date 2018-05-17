'use strict';
/* eslint-disable */

const play = document.getElementsByClassName('hrundel_img')[0];
const recognizedSpeech = document.getElementsByClassName('hrundel_recognized_speech')[0];
play.onclick = function () {
    if ((window.SpeechRecognition || window.webkitSpeechRecognition) &&
        hrundel.getState() === 'live') {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognizer = new SpeechRecognition();
        recognizer.lang = 'en-US';
        recognizer.start();
        recognizer.onresult = e => {
            let mood = hrundel.getCharacteristic('mood');
            if (mood < 100) {
                recognizedSpeech.value = e.results[e.resultIndex][0].transcript;
                hrundel.setCharacteristic('mood', 4);
            }
            if (mood === 100) {
                hrundel.setState('live');
            }
        };
    }
};