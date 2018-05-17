'use strict';
/* eslint-disable */

function notice() {
    if (window.Notification || window.webkitNotification) {
        const Notification = window.Notification || window.webkitNotification;
        Notification.requestPermission().then(function (result) {
            if (result === 'denied') {
                console.log('Permission wasn\'t granted. Allow a retry.');
                return;
            }
            if (result === 'default') {
                console.log('The permission request was dismissed.');
                return;
            }
            // Do something with the granted permission.
        });
        const title = 'Твоя свинья';
        const options = {
            body: 'Спаси меня от голода и скуки!',
            dir: 'ltr',
            lang: 'en-US'
        };
        const notification = new Notification(title, options);
    }
}