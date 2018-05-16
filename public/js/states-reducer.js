'use strict';

(() => {
    const reduceSpeed = 5;

    setInterval(() => {
        window.Pig.states.changeHunger(-reduceSpeed);
        window.Pig.states.changeEnergy(-reduceSpeed);
        window.Pig.states.changeMood(-reduceSpeed);
    }, 1000);

    const resetButton = document.querySelector('.control__reset');
    resetButton.addEventListener('click', () => {
        window.Pig.revive();
    });
})();
