/* eslint-disable no-unused-vars */

let getCurrentValue = param => Number(localStorage.getItem(param));

let setUpdateValue = value => {
    let updateValue;
    if (value >= 99) {
        localStorage.setItem('readyToEat', false);
        localStorage.setItem('readyToFun', true);
        localStorage.setItem('readyToSleep', false);
        updateValue = 100;
    } else {
        localStorage.setItem('readyToEat', true);
        localStorage.setItem('readyToFun', false);
        localStorage.setItem('readyToSleep', false);
        updateValue = value;
    }

    return updateValue;
};

function eat() {
    console.info('eat');
    if (localStorage.getItem('readyToEat')) {
        localStorage.setItem('readyToFun', false);
        localStorage.setItem('readyToSleep', false);
        localStorage.setItem('hungry', setUpdateValue(41 + getCurrentValue('hungry')));
    }
}

function initBattery(battery) {
    setInterval(() => {
        if (localStorage.getItem('readyToEat')) {
            if (battery.charging) {
                localStorage.setItem('readyToEat', true);
                localStorage.setItem('readyToFun', false);
                localStorage.setItem('readyToSleep', false);
                localStorage.setItem('hungry', setUpdateValue(11 + getCurrentValue('hungry')));
            } else {
                localStorage.setItem('readyToEat', false);
                localStorage.setItem('readyToFun', true);
                localStorage.setItem('readyToSleep', false);
            }
        }
    }, 1000);
}

if (navigator.getBattery) {
    navigator
        .getBattery()
        .then(initBattery);
}
