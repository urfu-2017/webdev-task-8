window.addEventListener('load', async function () {
    const { hrundel, document } = window;
    const $buttonsContainer = document.querySelector('.page__buttons');

    const battery = navigator.battery || navigator.getBattery ? await navigator.getBattery() : null;
    if (battery) {
        battery.addEventListener('chargingchange', function () {
            if (battery.charging) {
                hrundel.startFeeding();
            } else {
                hrundel.endFeeding();
            }
        }, false);
    } else {
        const button = document.createElement('button');
        button.innerText = 'покормить';
        button.onclick = function () {
            hrundel.startFeeding();
            button.disabled = true;
            setTimeout(() => {
                hrundel.endFeeding();
                button.disabled = false;
            }, 3000);
        };
        $buttonsContainer.appendChild(button);
    }

}, false);


