import { initDomElements, DomHruborgImage, DomFeedButton,
    DomNewGameButton, DomCloseHelpButton, DomHelp } from './DomElements/DomElements';
import battery from './lib/Battery';
import { сonfigurateHrundel } from './HrundelConfigurator';
import Hrundel from './Hrundel/Hrundel';

let hrundel;

document.addEventListener('DOMContentLoaded', async () => {
    initDomElements();

    hrundel = new Hrundel();
    hrundel = сonfigurateHrundel(hrundel);

    DomNewGameButton.onclick = () => {
        hrundel.resetState();
        initBattery();
        hrundel.startDying(); // lol
    };

    DomCloseHelpButton.onclick = () => {
        DomHelp.hidden = true;
    };

    startGame();
});


function startGame() {
    DomHruborgImage.onclick = () => hrundel.startSpeaking();

    window.onblur = () => hrundel.startSleeping();
    window.onfocus = () => hrundel.stopSleeping();

    initBattery();

    hrundel.startDying();
}

function initBattery() {
    if (battery.isAvailable()) {
        DomFeedButton.style.display = 'none';
        battery.init(hrundel.startEating.bind(hrundel), hrundel.stopEating.bind(hrundel));
    } else {
        DomFeedButton.onclick = hrundel.quickEat.bind(hrundel);
    }
}
