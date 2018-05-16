(() => {
    'use strict';
    let random;
    const volume = document.querySelector('.volume__slider');

    const changeVolume = (message1, message2) => {
        const currentVolume = (volume.value / 100).toFixed(1);
        message1.volume = currentVolume;
        message2.volume = currentVolume;
    };

    if (window.speechSynthesis) {
        const voices = window.speechSynthesis.getVoices();
        const message1 = new SpeechSynthesisUtterance('Come on');
        const message2 = new SpeechSynthesisUtterance('Okay');
        message1.voice = voices[7];
        message1.volume = 0.5;
        message2.voice = voices[7];
        message2.volume = 0.5;

        setInterval(() => {
            if (!window.Pig.isDead()) {
                random = Math.round(Math.random() * 10);
                if (random % 2 === 0) {
                    window.speechSynthesis.speak(message1);
                } else {
                    window.speechSynthesis.speak(message2);
                }
            }
        }, 6000);

        volume.addEventListener('change', () => changeVolume(message1, message2));
    }
})();
