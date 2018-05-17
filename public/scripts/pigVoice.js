'use strict';

let random;
const volume = document.querySelector('.pigVoice__slider-input');

const changeVolume = (message1, message2) => {
    const currentVolume = (volume.value / 100).toFixed(1);
    message1.volume = currentVolume;
    message2.volume = currentVolume;
};

if (window.speechSynthesis) {
    const message1 = createMessage('I love you');
    const message2 = createMessage('I hate you');

    setInterval(() => {
        random = Math.random().toFixed();
        if (Number(random)) {
            window.speechSynthesis.speak(message1);
        } else {
            window.speechSynthesis.speak(message2);
        }
    }, 5000);

    volume.addEventListener('change', () => changeVolume(message1, message2));
}

function createMessage(text) {
    let message = new SpeechSynthesisUtterance(text);
    message.rate = 1;
    message.pitch = 2;
    message.text = text;
    message.lang = 'en-US';

    return message;
}
