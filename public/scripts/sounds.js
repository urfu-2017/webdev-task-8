'use strict';

(() => {
    let random;
    const volume = document.querySelector('.slider');

    const changeVolume = (message1, message2) => {
        const currentVolume = (volume.value / 100).toFixed(1);
        message1.volume = currentVolume;
        message2.volume = currentVolume;
    };

    if (window.speechSynthesis) {
        // в моём Chrome не поддерживаются voices = []
        const voices = window.speechSynthesis.getVoices();
        const message1 = new SpeechSynthesisUtterance('Uhhh');
        const message2 = new SpeechSynthesisUtterance('Oik');
        message1.voice = voices[7];
        message1.volume = 0.5;
        message2.voice = voices[7];
        message2.volume = 0.5;

        setInterval(() => {
            let death = 0;
            for (let need of document.querySelectorAll('.lack')) {
                if (need.offsetWidth === 100) {
                    death++;
                }
            }
            if (death <= 1) {
                random = Math.round(Math.random());
                if (random) {
                    window.speechSynthesis.speak(message1);
                } else {
                    window.speechSynthesis.speak(message2);
                }
            }
        }, 6000);

        volume.addEventListener('change', () => changeVolume(message1, message2));
    }
})();
