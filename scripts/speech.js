'use strict';
/* eslint-disable */

var pig = document.querySelector('.svg');
var speechLog = document.querySelector('.speech-log');
var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
var recognizer = new SpeechRecognition();
recognizer.lang = 'ru-RU';
pig.addEventListener('click', function () {
    if (parseInt(mood.innerHTML) < 100) {
        speechLog.innerHTML = 'Хрюшка вас слушает';
        recognizer.start();
    }
});
recognizer.addEventListener('result', function (e) {
    let index = e.resultIndex;
    let result = e.results[index][0].transcript.trim();
    speechLog.innerHTML = result;
    currentState = states.TALKING;
});
