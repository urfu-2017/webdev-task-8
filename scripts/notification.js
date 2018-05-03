'use strict';
/* eslint-disable */

var lastNotificationTime = Date.now();
function checkStat(stat, text) {
    if (parseInt(stat.innerHTML) <= 10 && Date.now() - lastNotificationTime > 10000) {
        console.info(text);
        lastNotificationTime = Date.now();
        notifyMe(text);
    }
}
function notifyMe(text) {
    if (!('Notification' in window)) {
        console.warn('Этот браузер не поддерживает веб-уведомления');
    }

    else if (Notification.permission === 'granted') {
        var notification = new Notification(text);
    }

    else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
            if (permission === 'granted') {
                var notification = new Notification(text);
            }
        });
    }
}
