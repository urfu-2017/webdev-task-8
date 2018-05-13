const decreaseSpeed = 850;
const decreaseValue = -1;
const increaseSpeed = 1000;
const increaseValue = 6;
const recognitionLanguage = 'ru-Latn';
const hrundelPhrases = {
    Greeting: 'Привет!',
    onStartSpeaking: 'Говори со мной!',
    onStopSpeaking: 'Ясно!',
    onStartSleeping: 'zzZ...',
    onStopSleeping: 'Я выспался!',
    onStartEating: 'Я ем, спасибо!',
    onStopEating: 'Было вкусно!',
    onPoorHealth: 'Ich sterbe!',
    onDeath: 'Я умер x__X',
    onGoodHealth: 'Мне уже лучше!'
};
const sounds = {
    onNewGame: 'sounds/winxp.ogg',
    onDeath: 'sounds/gta.mp3',
    onPoorHealth: 'sounds/scream.mp3',
    onStartAction: 'sounds/beep.mp3',
    periodicSound: 'sounds/hruk0.mp3',
    onMeal: 'sounds/chips.mp3'
};
const periodicSoundInterval = 12500;
const blinkingInteraval = 5000;

export {
    decreaseSpeed, decreaseValue, increaseSpeed,
    increaseValue, recognitionLanguage, hrundelPhrases,
    sounds, blinkingInteraval, periodicSoundInterval
};
