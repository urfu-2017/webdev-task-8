import { changeAction } from './changeAction';

const scaleCommunicate = document.querySelector('#mood').querySelector('.characteristics__value');
const commonBlock = document.querySelector('.characteristics');
const pxForUnit = commonBlock.clientWidth / 100;


export default (stateHrundel, stateActions, actToCharacteristic) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        return;
    }
    let recognizer = new SpeechRecognition();
    recognizer.lang = 'ru';
    recognizer.continuous = true;
    recognizer.interimResults = true;
    const hrundel = document.querySelector('#hrundel__image');
    const chatWithHrundel = document.querySelector('#chat-with-hrundel');
    stateActions.readyActions.communion = false;
    hrundel.addEventListener('click', () => {
        if (!stateActions.readyActions.communion) {
            recognizer.start();
            stateActions.readyActions.communion = true;
            changeAction(stateHrundel, stateActions, actToCharacteristic);
            hrundel.title = 'Закончить разговор';
        } else {
            recognizer.stop();
            stateActions.readyActions.communion = false;
            changeAction(stateHrundel, stateActions, actToCharacteristic);
            hrundel.title = 'Начать разговор';
        }
    });
    recognizer.addEventListener('result', event => {
        chatWithHrundel.value = event.results[event.resultIndex][0].transcript.trim();
        if (event.results[event.resultIndex].isFinal) {
            if (stateActions.currentAct === 'communion') {
                cheerUp(stateHrundel, chatWithHrundel.value);
            }
            chatWithHrundel.value = '';
        }
    });
};

function cheerUp(stateHrundel, phrase) {
    stateHrundel.characteristics.mood = Math.min(
        stateHrundel.characteristics.mood + phrase.length,
        100
    );
    scaleCommunicate.style.width = `${pxForUnit * stateHrundel.characteristics.mood}px`;
}
