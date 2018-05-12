const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();

recognition.lang = 'ru-RU';
recognition.continuous = true;
recognition.interimResults = true;

recognition.start();

export default recognition;
