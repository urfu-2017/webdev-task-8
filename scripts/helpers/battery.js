module.exports.enableBatteryActivityListeners = (hrundel) => {
    if (!checkBatteryAvailability()) {
        return false;
    }

    navigator.getBattery().then(function (battery) {
        battery.addEventListener('chargingchange', function () {
            let batteryIsCharging = battery.charging;

            if (batteryIsCharging) {
                hrundel.eat();

                return;
            }

            if (!batteryIsCharging) {
                hrundel.stopEating();
            }
        });
    });

    return true;
};

function checkBatteryAvailability() {
    return Boolean(navigator.getBattery);
}
