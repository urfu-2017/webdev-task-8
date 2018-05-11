import sound from './08279.mp3';

const audio = new Audio(sound);
audio.loop = true;

export const play = () => audio.play();
export const stop = () => audio.pause();
export const changeVolume = (volume) => audio.volume = volume;
