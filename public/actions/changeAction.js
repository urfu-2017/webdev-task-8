import { closeEyes, openEyes, endLoopAnimationMouth, loopAnimationMouth } from './animate';


const hrundelPhrase = document.querySelector('#hrundel__phrase');

const actionToPhrase = {
    eat: 'Ням-ням-ням',
    communion: 'Я общительный парень, если захожешь обсудить жс - пиши',
    sleep: 'Хр-р-р',
    die: 'Хрюн погиб. Начни с начала и будь внимательней!',
    pass: 'Бездельничаю'
};


export function changeAction(stateHrundel, stateActions, actToCharacteristic) {
    if (!stateHrundel.isAlive) {
        return;
    }
    const actionsInInterruptOrder = ['sleep', 'communion', 'eat'];
    for (let i = 0; i < actionsInInterruptOrder.length; i++) {
        const action = actionsInInterruptOrder[i];
        if (stateActions.readyActions[action] &&
            stateHrundel.characteristics[actToCharacteristic[action]] !== 100) {
            // eslint-disable-next-line max-depth
            if (stateActions.currentAct === action) {
                return;
            }
            setAnimationForPastAction(stateActions.currentAct);
            setCurrentAction(stateActions, action);
            setAnimationForNewAction(stateActions.currentAct);

            return;
        }
    }
    setAnimationForPastAction(stateActions.currentAct);
    setCurrentAction(stateActions, 'pass');
}

export function setCurrentAction(stateActions, name) {
    stateActions.currentAct = name;
    changeHrundelPhrase(stateActions.currentAct);
}

function changeHrundelPhrase(action) {
    hrundelPhrase.innerHTML = actionToPhrase[action];
}

function setAnimationForPastAction(action) {
    // eslint-disable-next-line default-case
    switch (action) {
        case 'sleep':
            openEyes();
            break;
        case 'eat':
        case 'communion':
            endLoopAnimationMouth();
            break;
    }
}

function setAnimationForNewAction(action) {
    // eslint-disable-next-line default-case
    switch (action) {
        case 'sleep':
            closeEyes();
            break;
        case 'eat':
        case 'communion':
            loopAnimationMouth();
            break;
    }
}
