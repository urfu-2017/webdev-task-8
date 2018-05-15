import getRandomInt from '../utility/randomInt';


const minPause = 10 ** 4;
const maxPause = 3 * 10 ** 4;


export default stateHrundel => {
    const audio = new Audio();
    audio.src = './music/grunt.mp3';

    const recursiveGrunt = function recursiveGrunt() {
        if (stateHrundel.isAlive) {
            audio.play();
        }
        setTimeout(recursiveGrunt, getRandomInt(minPause, maxPause));
    };
    setTimeout(recursiveGrunt, getRandomInt(minPause, maxPause));

    const volumeControl = document.querySelector('#volume-hrundel');
    volumeControl.addEventListener('change', () => (audio.volume = volumeControl.value / 100));
};
