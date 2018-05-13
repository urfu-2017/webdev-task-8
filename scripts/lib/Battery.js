function isAvailable() {
    return !!navigator.getBattery;
}

function init(onStartCharging, onStopCharging) {
    navigator
        .getBattery()
        .then((battery) => {
            battery.onchargingchange = updateCharging(onStartCharging, onStopCharging);
            battery.onchargingchange();
        });
}

function updateCharging(onStartCharging, onStopCharging) {
    return function () {
        /* eslint-disable-next-line */
        if (this.charging) {
            onStartCharging();
        } else {
            onStopCharging();
        }
    };
}

export default { isAvailable, init };
