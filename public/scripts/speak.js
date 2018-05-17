'use strict';
/* eslint-disable */

const speedUp = document.getElementsByClassName('hrundel_controls_speedUp')[0];
const speedDown = document.getElementsByClassName('hrundel_controls_speedDown')[0];
const playPhrase = new SpeechSynthesisUtterance('Поиграй со мной хозяин');
const livePhrase = new SpeechSynthesisUtterance('Во славу твою я существую');
const sleepPhrase = new SpeechSynthesisUtterance('Режим накопления в свинье сала активирован');
const eatPhrase = new SpeechSynthesisUtterance('Я ем чтобы ты потом ел меня');

speedUp.onclick = () => {
    playPhrase.rate++;
    sleepPhrase.rate++;
    eatPhrase.rate++;
    livePhrase.rate++;
};

speedDown.onclick = () => {
    playPhrase.rate--;
    sleepPhrase.rate--;
    eatPhrase.rate--;
    livePhrase.rate--;
};

function speak() {
    return setInterval(() => {
        switch (hrundel.getState()) {
            case 'playing':
                window.speechSynthesis.speak(playPhrase);
                break;
            case 'sleeping':
                window.speechSynthesis.speak(sleepPhrase);
                break;
            case 'eating':
                window.speechSynthesis.speak(eatPhrase);
                break;
            default:
                window.speechSynthesis.speak(livePhrase);
        }

    }, 15000);
}
