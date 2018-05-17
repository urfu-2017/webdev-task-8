'use strict';
/* eslint-disable */

class Hrundel {
    constructor(characteristics) {
        this.characteristics = characteristics;
        feed.onclick = this.eat.bind(this);
        this.intervalID = setInterval(this.live.bind(this), 2000);
    }

    live() {
        if (!this.isDie()) {
            this.liveTick();
            switch (this.characteristics.state) {
                case 'eating':
                    this.characteristics.satiety = setCharecteristic(this.characteristics.satiety + 4);
                    break;
                case 'sleeping':
                    this.characteristics.energy = setCharecteristic(this.characteristics.energy + 4);
                    break;
                default:
                    break;
            }
            renderCharacteristics(this.characteristics);
            document.cookie = `characteristics=${JSON.stringify(this.characteristics)}`;
        } else {
            this.die();
        }
    }

    isDie() {
        return this.characteristics.satiety === 0 && this.characteristics.energy === 0 ||
            this.characteristics.satiety === 0 && this.characteristics.mood === 0 ||
            this.characteristics.energy === 0 && this.characteristics.mood === 0;
    }

    liveTick() {
        this.characteristics.satiety = setCharecteristic(this.characteristics.satiety - 1);
        this.characteristics.mood = setCharecteristic(this.characteristics.mood - 1);
        this.characteristics.energy = setCharecteristic(this.characteristics.energy - 1);
        if (this.characteristics.satiety <= 10 || this.characteristics.mood <= 10) {
            notice();
        }
    }

    eat() {
        svgLife();
        this.characteristics.state = 'eating';
    }

    die() {
        renderCharacteristics(this.characteristics);
        document.cookie = `characteristics=${JSON.stringify(this.characteristics)}`;
        clearInterval(this.intervalID);
    }
}

function renderCharacteristics(characteristics) {
    satiety.innerHTML = `Satiety: ${characteristics.satiety}%`;
    mood.innerHTML = `Mood: ${characteristics.mood}%`;
    energy.innerHTML = `Energy: ${characteristics.energy}%`;
}

function setCharecteristic(characteristic) {
    if (characteristic > 100) {
        hrundel.characteristics.state = 'life';

        return 100;
    }
    if (characteristic < 0) {
        return 0;
    }

    return characteristic;
}
