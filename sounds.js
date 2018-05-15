window.addEventListener('load', async function () {
    const { speechSynthesis } = window;

    function getRandomDelay() {
        const min = 25000;
        const max = 85000;
        let rand = min + Math.random() * (max + 1 - min);
        rand = Math.floor(rand);

        return rand;
    }

    const volumeInput = document.getElementById('volumeInput');
    if (speechSynthesis) {
        setTimeout(function speak() {
            const message = new SpeechSynthesisUtterance('aaaaaaaaaaa kek');
            message.volume = parseFloat(volumeInput.value);
            window.speechSynthesis.speak(message);
            setTimeout(speak, getRandomDelay());
        }, getRandomDelay());
    }

}, false);


