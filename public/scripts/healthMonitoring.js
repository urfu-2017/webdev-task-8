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
        const hungerValue = localStorage.getItem('hunger');
        const moodValue = localStorage.getItem('mood');

        if (hungerValue <= 10) {
            createNotification('Свинью нужно срочно покормить');
        }
        if (moodValue <= 10) {
            createNotification('Свинью нужно срочно повеселить');
        }
    }, 1000);
}


setInterval(() => {
    const hungerValue = localStorage.getItem('hunger');
    const moodValue = localStorage.getItem('mood');
    const energyValue = localStorage.getItem('energy');

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

