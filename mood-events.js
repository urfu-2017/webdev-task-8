window.addEventListener('load', async function () {
    const { hrundel, document } = window;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const $result = document.querySelector('.page__recognition');
    let recognizer = { start: () => null, stop: () => null };
    if (SpeechRecognition) {
        recognizer = new SpeechRecognition();
        recognizer.lang = 'ru-RU';
        recognizer.continuous = true;
        recognizer.maxAlternatives = 1;

    }


    recognizer.addEventListener('result', (e) => {
        $result.innerHTML = e.results[0][0].transcript;
    });
    recognizer.addEventListener('nomatch', () => {
        $result.innerHTML = 'Не осознал, повтори!';
    });

    const avatar = document.getElementById('avatar');
    avatar.onclick = function () {
        if (avatar.disabled) {
            return;
        }
        hrundel.startGame();
        recognizer.start();
        avatar.disabled = true;
        setTimeout(() => {
            hrundel.endGame();
            recognizer.stop();
            avatar.disabled = false;
        }, 5000);
    };
    document.body.appendChild(avatar);

}, false);


