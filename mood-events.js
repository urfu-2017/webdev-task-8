window.addEventListener('load', async function () {
    const { hrundel, document } = window;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognizer = { start: () => null, stop: () => null };
    if (SpeechRecognition) {
        recognizer = new SpeechRecognition();
        recognizer.lang = 'ru-RU';
        recognizer.continuous = true;

    }


    const button = document.createElement('button');
    button.innerText = 'играть';
    button.onclick = function () {
        hrundel.startGame();
        recognizer.start();
        button.disabled = true;
        setTimeout(() => {
            hrundel.endGame();
            recognizer.stop();
            button.disabled = false;
        }, 3000);
    };
    document.body.appendChild(button);

}, false);


