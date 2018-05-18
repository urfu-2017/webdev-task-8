let speechStarted = false;

export default function moodSetup(game, animator) {

    const SpeechRecognition = window.SpeechRecognition ||
    window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        var recognition = new SpeechRecognition();
        recognition.lang = 'ru-RU';
        recognition.continuous = true;
        const speechButton = document.querySelector('.speech-btn');
        const recognizedText = document.querySelector('.recognized-text');

        speechButton.onclick = function () {
            if (game.isDead()) {
                return;
            }
            if (speechStarted) {
                speechStarted = false;
                recognition.stop();
                animator.resetCurrentAnimation();
            } else {
                speechStarted = true;
                recognition.start();
                animator.startSpeech();
            }
        };

        recognition.onresult = e => {
            var index = e.resultIndex;
            var result = e.results[index][0].transcript.trim();
            recognizedText.innerHTML = result;
            game.cheerUp(result);
        };

    }
}
