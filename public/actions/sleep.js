import { changeAction } from './changeAction';


const luxForSleep = 50;


export default (stateHrundel, stateActions, actToCharacteristic) => {
    stateActions.readyActions.sleep = false;
    let currentLux = Number.POSITIVE_INFINITY;
    let pastSleepState;

    window.addEventListener('focus', () => {
        stateActions.currentTab = true;
        pastSleepState = stateActions.readyActions.sleep;
        stateActions.readyActions.sleep = luxForSleep >= currentLux;
        if (stateActions.readyActions.sleep !== pastSleepState) {
            changeAction(stateHrundel, stateActions, actToCharacteristic);
        }
    });
    window.addEventListener('blur', () => {
        stateActions.currentTab = false;
        pastSleepState = stateActions.readyActions.sleep;
        stateActions.readyActions.sleep = true;
        if (stateActions.readyActions.sleep !== pastSleepState) {
            changeAction(stateHrundel, stateActions, actToCharacteristic);
        }
    });

    window.addEventListener('devicelight', event => {
        currentLux = event.value;
        pastSleepState = stateActions.readyActions.sleep;
        stateActions.readyActions.sleep = !stateActions.currentTab && luxForSleep >= currentLux;
        if (stateActions.readyActions.sleep !== pastSleepState) {
            changeAction(stateHrundel, stateActions, actToCharacteristic);
        }
    });
};
