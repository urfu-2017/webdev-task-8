/* eslint-disable complexity */

'use strict';

let current = param => Number(localStorage.getItem(param));
let indervalId;

let isEnergyValue;
let isFunValue;
let isHungerValue;

function createNotification(text) {
    return new Notification(text);
}

function notify() {
    Notification
        .requestPermission()
        .then(permission => {
            if (permission === 'granted') {
                indervalId = setInterval(() => {
                    isEnergyValue = localStorage.getItem('energy') > 0 ? 1 : 0;
                    isFunValue = localStorage.getItem('fun') > 0 ? 1 : 0;
                    isHungerValue = localStorage.getItem('hungry') > 0 ? 1 : 0;
                    if (isEnergyValue + isFunValue + isHungerValue > 2) {
                        if (current('hungry') < 10) {
                            createNotification('хочу кушац');
                        } else if (current('fun') < 10) {
                            createNotification('мне скучно');
                        }
                    } else {
                        clearInterval(indervalId);
                    }
                }, 1000);
            } else {
                console.info('Браузер не поддерживает уведомления');
            }
        });
}

document.addEventListener('blur', notify, true);
