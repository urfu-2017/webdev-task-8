const indicators = {
    energy: document.querySelector('.stats__indicator_type_energy'),
    satiety: document.querySelector('.stats__indicator_type_satiety'),
    spirit: document.querySelector('.stats__indicator_type_spirit')
};

const speechRecognition = document.querySelector('.speech-recognition__result');
const volumeControl = document.querySelector('.controls__volume');
const audio = document.querySelector('.audio');
volumeControl.oninput = () => {
    audio.volume = volumeControl.value;
};


export default (stats, text) => {
    Object.entries(stats)
        .forEach(([key, value]) => {
            indicators[key].innerHTML = `${value.toFixed(0)}%`;
            indicators[key].style.width = `${value}%`;
        });
    speechRecognition.innerHTML = text || '';
};
