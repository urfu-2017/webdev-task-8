'use strict';

const LIFE_ATTRIBUTE = 'hunger';
const burger = document.querySelector('.hunger-handler__bourger');

function updateHunger() {
    console.info('покормил');
    let newHungerValue = normalizeValue(50 + getCurrentValue());
    localStorage.setItem(LIFE_ATTRIBUTE, newHungerValue);
}

burger.addEventListener('click', updateHunger);

function initBattery(battery) {
    setInterval(() => {
        if (battery.charging) {
            let newHungerValue = normalizeValue(5 + getCurrentValue());
            localStorage.setItem(LIFE_ATTRIBUTE, newHungerValue);
        }
    }, 1000);
}

if (navigator.getBattery) {
    navigator
        .getBattery()
        .then(initBattery);
}

function getCurrentValue() {
    return Number(localStorage.getItem(LIFE_ATTRIBUTE));
}

function normalizeValue(newValue) {
    if (newValue > 100) {
        return 100;
    }

    return newValue;
}
