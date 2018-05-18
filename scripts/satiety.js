export default function satietySetup(game) {
    if (navigator.getBattery) {
        navigator.getBattery().then(battery => {
            battery.addEventListener('chargingchange',
                () => game.startFeeding(battery.charging));
        });
    } else {
        console.info('battery not supported');
    }
}
