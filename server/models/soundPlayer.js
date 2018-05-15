'use strict';
/* eslint-disable no-undef */
const _ = require('underscore');
const SoundsLoader = require('./soundsLoader');

class SoundPlayer {
    constructor() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;

        this.sources = [];
        this.context = new AudioContext();
        const url = process.env.NODE_ENV === 'production'
            ? 'https://my-little-kitty.now.sh'
            : 'http://localhost:3000';

        const bufferLoader = new SoundsLoader(
            this.context,
            _.map([1, 2, 3, 4], x => `${url}/static/sounds/${x}.wav`),
            bufferList => this.finishedLoading(bufferList)
        );

        bufferLoader.load();
    }

    randomPlay(minTimeout = 5, maxTimeout = 20) {
        const timeout = _.random(minTimeout, maxTimeout) * 1000;
        const soundIndex = _.random(0, this.sources.length - 1);

        this.sources[soundIndex].start(this.context.currentTime);
        const oldSource = this.sources[soundIndex];

        this.sources[soundIndex] = this.context.createBufferSource();
        this.sources[soundIndex].buffer = oldSource.buffer;
        this.sources[soundIndex].connect(this.context.destination);

        setTimeout(() => this.randomPlay(), timeout);
    }

    finishedLoading(bufferList) {
        _.each(bufferList, buffer => {
            const source = this.context.createBufferSource();

            source.buffer = buffer;
            source.connect(this.context.destination);
            this.sources.push(source);
        });

        this.randomPlay();
    }
}

/* eslint-disable */
module.exports = SoundPlayer;
