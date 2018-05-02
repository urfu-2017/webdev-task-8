window.mood = {};
window.mood.listening = false;

setInterval(function () {
    if (!window.mood.listening) {
        window.health.mood -= window.health.mood - 1 < 0 ? 0 : 1;
        window.health.refresh(window.health.moodHTML, window.health.mood);
    }
}, 1000 * 60);
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SpeechRecognition) {
    console.warn('Speech Recognition is not supported!');
}
window.mood.recognize = new SpeechRecognition();
const recognizer = window.mood.recognize;
recognizer.lang = 'en-US';

// продолжает слушать и расопзнавать речь даже после паузы
recognizer.continuous = true; // false по умолчанию

// повзоляет получать промежуточные результаты
// recognizer.interimResults = true; // false по умолчанию
window.svg.snap.click(() => {
    if (window.dead) {
        return;
    }
    recognizer.start();
    window.mood.listening = true;
    window.svg.state.earUp();
});

recognizer.onresult = function (e) {
    const index = e.resultIndex;
    const result = e.results[index][0].transcript.trim();
    window.health.mood += window.health.mood + result.length * 2 < 100
        ? result.length * 2
        : 100 - window.health.mood + result.length;
    if (window.health.mood === 100) {
        recognizer.stop();
        window.mood.listening = false;
    }
    document.querySelector('.answer').target.innerHTML = result;
    setTimeout(() => {
        document.querySelector('.answer').target.innerHTML = '';
        window.svg.state.earDown();
    }, 4000);
};
