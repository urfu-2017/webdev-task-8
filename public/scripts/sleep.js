'use strict';

let intervalId;

let sleep = () => {
    localStorage.setItem('readyToSleep', true);
    localStorage.setItem('readyToEat', false);
    localStorage.setItem('readyToFun', false);
    intervalId = setInterval(() => {
        let energy = Number(localStorage.getItem('energy'));
        if (energy >= 100) {
            clearInterval(intervalId);
        } else {
            let newEnergy;
            if (energy + 10 > 100) {
                newEnergy = 100;
                localStorage.setItem('readyToSleep', false);
                localStorage.setItem('readyToEat', true);
                localStorage.setItem('readyToFun', false);
            } else {
                newEnergy = energy + 10;
                localStorage.setItem('readyToSleep', true);
                localStorage.setItem('readyToEat', false);
                localStorage.setItem('readyToFun', false);
            }
            localStorage.setItem('energy', newEnergy);
        }
    }, 1000);
};

let stopSleep = () => {
    localStorage.setItem('readyToSleep', false);
    localStorage.setItem('readyToEat', true);
    localStorage.setItem('readyToFun', false);
    clearInterval(intervalId);
};

// if (localStorage.getItem('readyToSleep')) {
//     console.info('slleep')
//     document.addEventListener('blur', sleep, true);
// }
document.addEventListener('blur', sleep, true);
document.addEventListener('mousemove', stopSleep, true);
