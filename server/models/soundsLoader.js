'use strict';
/* eslint-disable no-undef */

class SoundsLoader {
    constructor(context, urlList, callback) {
        this.context = context;
        this.urlList = urlList;
        this.onload = callback;
        this.bufferList = [];
        this.loadCount = 0;
    }

    loadSound(url, index) {
        const request = new XMLHttpRequest();

        request.open('GET', url, true);
        request.responseType = 'arraybuffer';

        request.onload = () => {
            this.context.decodeAudioData(
                request.response,
                buffer => {
                    if (!buffer) {
                        console.info(`error decoding file data: ${url}`);

                        return;
                    }

                    this.bufferList[index] = buffer;
                    this.loadCount += 1;
                    if (this.loadCount === this.urlList.length) {
                        this.onload(this.bufferList);
                    }
                },
                error => console.error('decodeAudioData error', error)
            );
        };
        request.send();
    }

    load() {
        for (let i = 0; i < this.urlList.length; i += 1) {
            this.loadSound(this.urlList[i], i);
        }
    }
}

module.exports = SoundsLoader;
