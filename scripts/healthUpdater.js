'use strict';

(() => {
    const resetButton = document.querySelector('.reset-icon');
    const hungerBar = document.querySelector('.hunger-lack');
    const energyBar = document.querySelector('.energy-lack');
    const moodBar = document.querySelector('.mood-lack');

    const resetParams = () => {
        hungerBar.style.width = 0;
        energyBar.style.width = 0;
        moodBar.style.width = 0;
    };

    setInterval(() => {
        const newHunger = hungerBar.offsetWidth !== 100 ? hungerBar.offsetWidth + 5 : 100;
        const newEnergy = energyBar.offsetWidth !== 100 ? energyBar.offsetWidth + 5 : 100;
        const newMood = moodBar.offsetWidth !== 100 ? moodBar.offsetWidth + 5 : 100;
        hungerBar.style.width = newHunger + '%';
        energyBar.style.width = newEnergy + '%';
        moodBar.style.width = newMood + '%';
    }, 3000);

    resetButton.addEventListener('click', resetParams);
})();
