function playAudio(file, volume) {
    const audio = new Audio(file);
    audio.volume = volume;
    audio.play();
}

export { playAudio };
