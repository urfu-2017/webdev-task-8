'use strict';
/* eslint-disable */

var charging = document.querySelector('.battery-charging');
if (navigator.getBattery) {
    navigator
        .getBattery()
        .then(initBattery);
}
function initBattery(battery) {
    battery.onchargingchange = updateCharging;
    battery.onchargingchange();
}
function updateCharging() {
    let onOff = this.charging ? 'включена' : 'выключена';
    charging.innerHTML = 'Зарядка: ' + onOff;
    if (this.charging) {
        currentState = states.EATING;
    }
    if (!this.charging && currentState === states.EATING) {
        currentState = states.NOTHING;
    }
}
