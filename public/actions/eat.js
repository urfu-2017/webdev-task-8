import { changeAction } from './changeAction';


export default async (stateHrundel, stateActions, actToCharacteristic) => {
    if (!navigator.getBattery) {
        const feedHrundelButton = document.querySelector('#feed-hrundel');
        feedHrundelButton.parentNode.style.display = 'block';
        feedHrundelButton.addEventListener('click', () => {
            stateActions.readyActions.eat = !stateActions.readyActions.eat;
            changeAction(stateHrundel, stateActions, actToCharacteristic);
            feedHrundelButton.value = stateActions.readyActions.eat
                ? 'Покормить Хрюнделя'
                : 'Закончить кормление';
        });

        return;
    }
    const battery = await navigator.getBattery();
    stateActions.readyActions.eat = battery.charging;
    battery.addEventListener('chargingchange', () => {
        stateActions.readyActions.eat = battery.charging;
        changeAction(stateHrundel, stateActions, actToCharacteristic);
    });
};
