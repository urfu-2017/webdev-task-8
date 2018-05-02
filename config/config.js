const decreaseSpeed = 750;
const decreaseValue = -1;
const increaseSpeed = 1000;
const increaseValue = 6;
const recognitionLanguage = 'ru-Latn';
const hrundelPhrases = {
    Greeting: 'Привет!',
    onStartSpeaking: 'Говори что-нибудь!',
    onStopSpeaking: 'Классно поболтали!',
    onStartSleeping: 'zZZzZZ',
    onStopSleeping: 'Я выспался!',
    onStartEating: 'Я ем! Хрум хурм!',
    onStopEating: 'Спасибо! Очень вкусно!',
    onPoorHealth: 'Я ПОДЫХАЮ!!!',
    onDeath: 'Ну вот! Я подох!',
    onGoodHealth: 'Мне уже лучше!'
};
const notificationImage = 'images/notification.jpg';
const sounds = {
    onNewGame: 'sounds/complete.mp3',
    onDeath: 'sounds/evil-laugh.mp3',
    onPoorHealth: 'sounds/woody.mp3',
    onStartAction: 'sounds/coin-04.mp3',
    periodicSound: 'sounds/lol.mp3'
};
const periodicSoundInterval = 12500;
const blinkingInteraval = 5000;

export {
    decreaseSpeed, decreaseValue, increaseSpeed,
    increaseValue, recognitionLanguage, hrundelPhrases,
    notificationImage, sounds, blinkingInteraval, periodicSoundInterval
};
