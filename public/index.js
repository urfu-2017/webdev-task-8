import { changeAction, setCurrentAction } from './actions/changeAction';
import grunt from './actions/grunt';
import eat from './actions/eat';
import sleep from './actions/sleep';
import sendNotification from './actions/notify';
import communicate from './actions/communicate';
import { fall, revive } from './actions/animate';


const millisecondsToChange = 500;
const growthFactor = 3;
const stateHrundel = readStateHrundel() || {
    characteristics: {
        satiety: 100,
        energy: 100,
        mood: 100
    },
    isAlive: true
};
const characteristics = Object.keys(stateHrundel.characteristics);
const stateActions = {
    readyActions: {},
    currentAct: 'pass',
    currentTab: true
};
const actToCharacteristic = {
    eat: 'satiety',
    communion: 'mood',
    sleep: 'energy'
};


window.addEventListener('load', () => {
    const newGameButton = document.querySelector('#new-game');
    newGameButton.addEventListener('click', () => {
        setDefaultState();
        revive();
    });
    checkAlive();
    changeAllCharacteristics();
    grunt(stateHrundel);
    eat(stateHrundel, stateActions, actToCharacteristic);
    sleep(stateHrundel, stateActions, actToCharacteristic);
    communicate(stateHrundel, stateActions, actToCharacteristic);
});

function changeAllCharacteristics() {
    const commonBlock = document.querySelector('.characteristics');
    const pxForUnit = commonBlock.clientWidth / 100;
    const nameToScale = {};
    characteristics.forEach(name => {
        const block = document.querySelector(`#${name}`);
        nameToScale[name] = block.querySelector('.characteristics__value');
    });
    const recursivelyChange = function recursivelyChange() {
        if (stateHrundel.isAlive) {
            characteristics.forEach(name => {
                changeCharacteristic(name, nameToScale[name], pxForUnit);
            });
            checkState();
            saveStateHrundel();
        }
        setTimeout(recursivelyChange, millisecondsToChange);
    };
    setTimeout(recursivelyChange, millisecondsToChange);
}

function changeCharacteristic(name, scale, pxForUnit) {
    // communicate обрабатывается по длине распознанной фразы
    if (name === 'mood' && stateActions.currentAct === 'communion') {
        stateHrundel.characteristics[name] = Math.max(0, stateHrundel.characteristics[name] - 1);
    } else {
        stateHrundel.characteristics[name] = actToCharacteristic[stateActions.currentAct] === name
            ? Math.min(100, stateHrundel.characteristics[name] + growthFactor)
            : Math.max(0, stateHrundel.characteristics[name] - 1);
    }
    scale.style.width = `${pxForUnit * stateHrundel.characteristics[name]}px`;
}

function checkState() {
    stateHrundel.isAlive = Object.values(stateHrundel.characteristics)
        .filter(value => value > 0)
        .length >= 2;
    handleNotification();
    changeAction(stateHrundel, stateActions, actToCharacteristic);
    checkAlive();
}

function checkAlive() {
    if (!stateHrundel.isAlive) {
        setCurrentAction(stateActions, 'die');
        fall();
    }
}

function handleNotification() {
    if (!stateActions.currentTab) {
        return;
    }
    for (let i = 0; i < characteristics.length; i++) {
        const characteristic = characteristics[i];
        if (stateHrundel.characteristics[characteristic] <= 10) {
            const action = Object.entries(actToCharacteristic)
                .find(entry => entry[1] === characteristic)[0];
            sendNotification(action);

            return;
        }
    }
}

function saveStateHrundel() {
    localStorage.setItem('stateHrundel', JSON.stringify(stateHrundel));
}

function readStateHrundel() {
    return JSON.parse(localStorage.getItem('stateHrundel'));
}

function setDefaultState() {
    stateHrundel.characteristics = {
        satiety: 100,
        energy: 100,
        mood: 100
    };
    stateHrundel.isAlive = true;
    stateActions.currentAct = 'pass';
}
