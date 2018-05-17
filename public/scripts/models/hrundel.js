'use strict';
/* eslint-disable */

class Hrundel {
    constructor(characteristics) {
        this.characteristics = characteristics;
        feed.onclick = this.eat.bind(this);
        this.intervalID = setInterval(this.live.bind(this), 2000);
        this.speakID = speak();
    }

    setCharacteristic(characteristic, value) {
        if (this.characteristics[`${characteristic}`] + value > 100) {
            this.characteristics[`${characteristic}`] = 100;
            this.setState('live');
            
            return
        }
        if (this.characteristics[`${characteristic}`] + value < 0) {
            this.characteristics[`${characteristic}`] = 0;

            return
        }
        this.characteristics[`${characteristic}`] += value;
    }

    getCharacteristic(characteristic) {
        return this.characteristics[`${characteristic}`];
    }

    setState(state) {
        if (this.characteristics.state === 'dead' || state === 'dead') {
            this.characteristics.state === 'dead'
            return
        }
        if (this.characteristics.state !== 'sleeping' &&  state === 'eating') {
            this.characteristics.state = 'eating';
        }
        if (state === 'sleeping') {
            this.characteristics.state = 'sleeping';
        }
        if (state === 'live') {
            this.characteristics.state = 'live';
        }
    }

    getState() {
        return this.characteristics.state;
    }

    live() {
        if (!this.isDead()) {
            this.liveTick();
        } else {
            this.die();
        }
    }

    isDead() {
        return this.characteristics.satiety === 0 && this.characteristics.energy === 0 ||
            this.characteristics.satiety === 0 && this.characteristics.mood === 0 ||
            this.characteristics.energy === 0 && this.characteristics.mood === 0;
    }

    liveTick() {
        this.setCharacteristic('satiety', -10);
        this.setCharacteristic('mood', -10);
        this.setCharacteristic('energy', -10);
        switch (this.getState()) {
            case 'eating':
                this.setCharacteristic('satiety', 4);
                break;
            case 'sleeping':
                this.setCharacteristic('energy', 4);
                break;
            default:
                break;
        }
        //if (this.characteristics.satiety <= 10 || this.characteristics.mood <= 10) {
        //    notice();
        //}
        renderCharacteristics(this.characteristics);
        document.cookie = `characteristics=${JSON.stringify(this.characteristics)}`;
    }

    eat() {
        svgLive();
        this.setState('eating');
    }

    die() {
        this.setState('dead');
        renderCharacteristics(this.characteristics);
        document.cookie = `characteristics=${JSON.stringify(this.characteristics)}`;
        clearInterval(this.speakID);
        clearInterval(this.intervalID);
    }
}

function renderCharacteristics(characteristics) {
    satiety.innerHTML = `Satiety: ${characteristics.satiety}%`;
    mood.innerHTML = `Mood: ${characteristics.mood}%`;
    energy.innerHTML = `Energy: ${characteristics.energy}%`;
}
