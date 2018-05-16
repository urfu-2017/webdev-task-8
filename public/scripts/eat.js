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
    if (battery.target.charging && hrundel.characteristics.satiety < 100 &&
            hrundel.characteristics.state !== 'sleeping') {
        hrundel.characteristics.state = 'eating';
    }
    if (hrundel.characteristics.satiety === 100) {
        hrundel.characteristics.state = 'life';
    }
}

_feed()