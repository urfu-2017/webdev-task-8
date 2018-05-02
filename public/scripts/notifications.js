'use strict';
const Notification = window.Notification ||
    window.webkitNotification;

const createNotification = () => {
    if (Notification.permission === 'granted') {
        new Notification('You need to get here fast!'); // eslint-disable-line
    }
};

if (Notification) {
    // Иногда срабатывает в Chrome, хорошо работает в Firefox
    Notification.requestPermission();
    setInterval(() => {
        if (document.querySelector('.hunger-lack').offsetWidth >= 90 &&
            document.querySelector('.hunger-lack').offsetWidth < 100 ||
            document.querySelector('.mood-lack').offsetWidth >= 90 &&
            document.querySelector('.mood-lack').offsetWidth < 100) {
            createNotification();
        }
    }, 1000);
}
