'use strict';
/* eslint-disable */

var notified = false;
function checkStat(stat, text) {
    if (!notified && parseInt(stat.innerHTML) <= 10) {
        console.info(text);
        notifyMe(text);
        notified = true;
    } else {
        notified = false;
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
