function isAvailable() {
    if (navigator.getBattery) {
        return true;
    }

    return false;
}

function init(onStartCharging, onStopCharging) {
    navigator
        .getBattery()
        .then((battery) => {
            battery.onchargingchange = updateCharging(onStartCharging, onStopCharging);
            battery.onchargingchange();
        });
}

function reset() {
    navigator
        .getBattery()
        .then();
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

export default { isAvailable, init, reset };
