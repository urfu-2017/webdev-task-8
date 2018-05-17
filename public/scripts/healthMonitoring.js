'use strict';
const Notification = window.Notification ||
    window.webkitNotification;

const createNotification = (text) => {
    if (Notification.permission === 'granted') {
        new Notification(text); // eslint-disable-line
    }
};

if (Notification) {
    Notification.requestPermission();
    setInterval(() => {
        let { hungerValue, moodValue } = getValues();

        if (hungerValue <= 10) {
            createNotification('Свинью нужно срочно покормить');
        }
        if (moodValue <= 10) {
            createNotification('Свинью нужно срочно повеселить');
        }
    }, 1000);
}


setInterval(() => {
    let { hungerValue, moodValue, energyValue } = getValues();
    let count = 0;
    if (hungerValue === 0) {
        count++;
    }
    if (moodValue === 0) {
        count++;
    }
    if (energyValue === 0) {
        count++;
    }
    if (count > 1) {
        localStorage.setItem('isDead', 'true');
    } else {
        localStorage.setItem('isDead', 'false');
    }
}, 1000);

setInterval(()=> {
    let { hungerValue, moodValue, energyValue } = getValues();
    let averageHealth = (hungerValue + moodValue + energyValue) / 3;
    localStorage.setItem('averageHealth', averageHealth);
}, 1000);

function getValues() {
    const hungerValue = Number(localStorage.getItem('hunger'));
    const moodValue = Number(localStorage.getItem('mood'));
    const energyValue = Number(localStorage.getItem('energy'));

    return { hungerValue, moodValue, energyValue };
}
