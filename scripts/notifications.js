'use strict';
(() => {
    const Notification = window.Notification ||
        window.webkitNotification;

    const createNotification = () => {
        if (Notification.permission === 'granted') {
            new Notification('Твоя хрюка умирает'); // eslint-disable-line
        }
    };

    if (Notification) {
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
})();
