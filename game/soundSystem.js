import sound from './08279.mp3';

export class SoundSystem {
    constructor(control, volume) {
        this.audio = new Audio(sound);
        this.audio.loop = true;
        this.control = control;
        this.control.value = volume;

        this.control.addEventListener('change', event => this.changeVolume(event.target.value));
        this.changeVolume(volume);
    }

    play() {
        this.audio.play();
    }

    pause() {
        this.audio.pause();
    }

    changeVolume(volume) {
        this.audio.volume = volume / 100;
    }
}
