'use strict';
/* eslint-disable */

function _feed() {
    if (navigator.getBattery) {
        navigator
            .getBattery()
            .then(initBattery);
    }
}

function initBattery(battery) {
    battery.onchargingchange = updateCharging;
    battery.onchargingchange(battery);
}

function updateCharging(battery) {
    let satiety = hrundel.getCharacteristic('satiety');
    if (battery.target.charging && satiety < 100) {
        hrundel.setState('eating');
    }
    if (satiety === 100) {
        hrundel.setState('live');
    }
}

_feed()