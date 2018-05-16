'use strict';
(() => {

    /*
        почему то всегда пишет 'Мне грустно!',
        даже если делаю new Notification(..) в консоли с другим title
    */
    const Notification = window.Notification ||
        window.webkitNotification;
    const messages = {
        hungry: 'Я голоден!',
        tired: 'Я хочу спать!',
        sad: 'Мне грустно!'
    };
    const notifications = {
        hungry: null,
        tired: null,
        sad: null
    }

    const createNotification = (key) => {
        if (notifications[key] !== null) {
            let notificationToClose = notifications[key];
            setTimeout(() => {
                notificationToClose.close();
            }, 400);
            notifications[key] = null;

            return;
        }
        if (Notification.permission === 'granted') {
            notifications[key] = new Notification(messages[key]);
        }
    };
    const notificationInterval = 1000;

    if (Notification) {
        Notification.requestPermission();
        setInterval(() => {
            if (window.Pig.isDead()) {
                return;
            }
            if (window.Pig.isHungry()) {
                createNotification('hungry');
            }
            if (window.Pig.isTired()) {
                createNotification('tired');
            }
            if (window.Pig.isSad()) {
                createNotification('sad');
            }
        }, notificationInterval);
    }
})();
