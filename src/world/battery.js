const readings = { charging: false };


const handleChargingChange = battery => {
    readings.charging = battery.charging;
};


const initBattery = battery => {
    handleChargingChange(battery);
    battery.addEventListener('oncharchingchange', handleChargingChange.bind(battery));
};


if (navigator.getBattery) {
    navigator.getBattery()
        .then(initBattery);
}


export default readings;
