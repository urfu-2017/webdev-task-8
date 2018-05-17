const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
let recognizer = null;
if (SpeechRecognition) {
    recognizer = new SpeechRecognition();
    recognizer.lang = 'ru-RU';
    recognizer.continuous = true;
    recognizer.interimResults = true;
}

const readings = { talking: false, text: null };


const stopListening = () => {
    if (recognizer) {
        recognizer.stop();
    }
    readings.talking = false;
    readings.text = null;
};

let timeout = null;

const startListening = () => {
    if (!recognizer) {
        return;
    }
    recognizer.start();
    readings.talking = true;

    recognizer.onresult = event => {
        clearTimeout(timeout);
        timeout = setTimeout(stopListening, 3000);
        const result = event.results[event.resultIndex];
        if (result.isFinal) {
            readings.text = result[0].transcript;
        }
    };

    timeout = setTimeout(stopListening, 3000);
};


const toggleListening = () => readings.talking ? stopListening() : startListening();


document.querySelector('.view').onclick = toggleListening;


export default readings;
