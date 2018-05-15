'use strict';

/* eslint-disable */


function drawHrundel() {
    console.log('asdasdas');
    const svg = Snap('.hrun');
    const head = svg.circle(150, 150, 100);
    head.attr({
        fill: '#ff5862'
    });
    const leftWhite = svg.circle(110, 120, 20).attr({
        fill: '#fff'
    });
    const leftBlack = svg.circle(110, 125, 10);
    const rightWhite = svg.circle(190, 120, 20).attr({
        fill: '#fff'
    });
    const rightBlack = svg.circle(190, 125, 10);
    const leftEye = svg.group(leftWhite, leftBlack);
    const rightEye = svg.group(rightWhite, rightBlack);
    const noseBack = svg.circle(150, 190, 25).attr({
        fill: '#ff8d8e'
    });
    const noseBlackLeft = svg.circle(140, 190, 5);
    const noseBlackRight = svg.circle(160, 190, 5);
    const nose = svg.group(noseBack, noseBlackLeft, noseBlackRight);
}

function drawFeedButton() {
    const button = document.createElement('button');
    button.onclick = () => HRUN.feed();
    document.querySelector('.controls').appendChild(button);
}

class Game {
    constructor(hrun) {
        this.hrun = hrun;
    }

    initFeed() {
        if (!navigator.getBattery) {
            drawFeedButton();
        }
        navigator.getBattery().then((battery) => {
            battery.addEventListener('chargingchange', () => {
                console.log(battery);
                if (battery.charging) {
                    HRUN._action = 'eating';
                } else {
                    HRUN._action = 'rest';
                }
            })
        });
    }

    reset() {
        HRUN = HrundelState.initMax();
    }

    rerender(hrundel) {
        document.querySelector('#satietyValue').innerHTML = hrundel.satiety;
        document.querySelector('#energyValue').innerHTML = hrundel.energy;
        document.querySelector('#moodValue').innerHTML = hrundel.mood;
        console.log(hrundel.satiety);
    }

}

function rerender(hrundel) {
    document.querySelector('#satietyValue').innerHTML = hrundel.satiety;
    document.querySelector('#energyValue').innerHTML = hrundel.energy;
    document.querySelector('#moodValue').innerHTML = hrundel.mood;
    console.log(hrundel.satiety);
}

class HrundelState {
    constructor({ satiety, energy, mood, action }) {
        this.satiety = satiety;
        this.energy = energy;
        this.mood = mood;
        this._action = action;
    }

    static initMax() {
        return new HrundelState({
            satiety: 100,
            energy: 100,
            mood: 100,
            action: 'rest'
        });
    }

    static loadFromStorage() {
        const state = JSON.parse(localStorage.getItem('state'));
        if (state) {
            return new HrundelState(state);
        }
    }

    saveToStorage() {
        const state = {
            satiety: this.satiety,
            energy: this.energy,
            mood: this.mood,
            action: this._action
        };
        localStorage.setItem('state', JSON.stringify(state));
    }

    reduceState() {
        switch (this._action) {
            case 'rest':
                this.satiety--;
                this.mood--;
                this.energy--;
                console.log('rest');
                break;
            case 'eating':
                this.satiety = Math.min(this.satiety + 3, 100);
                this.mood--;
                this.energy--;
                console.log('eating');
        }

        rerender(this);
        setTimeout(this.reduceState.bind(HRUN), 1000);
    }

    set action(value) {
        if (['rest', 'eating'].includes(value)) {
            this._action = value;
            console.log(this._action);
        }
    }

    feed() {
        this.satiety = Math.min(this.satiety + 3, 100);
        rerender(this);
    }
}

let HRUN = HrundelState.loadFromStorage() || HrundelState.initMax();


window.onload = () => {
    drawHrundel();
    const game = new Game(HRUN);
    game.reset();
    game.initFeed();
    // const hrun=HrundelState.loadFromStorage()||HrundelState.initMax();
    console.log(HRUN.satiety, HRUN.energy, HRUN.mood);
    rerender(HRUN);
    HRUN.reduceState();
};

window.onunload = () => {
    HRUN.saveToStorage();
};


console.log('qweqwe');