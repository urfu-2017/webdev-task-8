'use strict';

const satiety = document.getElementsByClassName('hrundel_states_satiety')[0];
const mood = document.getElementsByClassName('hrundel_states_mood')[0];
const energy = document.getElementsByClassName('hrundel_states_energy')[0];
const feed = document.getElementsByClassName('hrundel_controls_feed')[0];
const play = document.getElementsByClassName('hrundel_controls_play')[0];
const sleep = document.getElementsByClassName('hrundel_controls_sleep')[0];
const regame = document.getElementsByClassName('regame')[0];

class Hrundel {
    constructor() {
        this.satiety = 100;
        this.mood = 100;
        this.energy = 100;
        this.state = 'live';
        feed.onclick = this.eat.bind(this);
        play.onclick = this.play.bind(this);
        sleep.onclick = this.sleep.bind(this);
        this.intervalID = setInterval(this.live.bind(this), 2000);
    }

    live() {
        this.satiety--;
        this.mood--;
        this.energy--;
        if (this.state === 'eating') {
            this.satiety += 4;
        } else if (this.state === 'sleeping') {
            this.energy += 4;
        } else if (this.state === 'playing') {
            this.mood += 4;
        }
        satiety.innerHTML = `${this.satiety}%`;
        mood.innerHTML = `${this.mood}%`;
        energy.innerHTML = `${this.energy}%`;
    }

    eat() {
        this.state = 'eating';
    }

    sleep() {
        this.state = 'sleeping';
    }

    play() {
        this.state = 'playing';
    }

    die() {
        clearInterval(this.intervalID);
    }
}

let hrundel = new Hrundel();

regame.onclick = function () {
    hrundel.die();
    hrundel = new Hrundel();
    satiety.innerHTML = '100%';
    mood.innerHTML = '100%';
    energy.innerHTML = '100%';
};