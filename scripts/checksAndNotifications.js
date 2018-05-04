'use strict';
/* eslint-disable */

var notified = false;
function checkStat(stat, text) {
    if (!notified && parseInt(stat.innerHTML) <= 10) {
        console.info(`Notification: ${text}`);
        notifyMe(text);
        notified = true;
    }
    if (notified && parseInt(stat.innerHTML) > 10) {
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
function checkDeath() {
    let satietyIsZero = parseInt(satiety.innerHTML) === 0;
    let energyIsZero = parseInt(energy.innerHTML) === 0;
    let moodIsZero = parseInt(mood.innerHTML) === 0;
    let a = satietyIsZero && energyIsZero;
    let b = energyIsZero && moodIsZero;
    let c = satietyIsZero && moodIsZero;

    if (a || b || c) {
        currentState = states.DEAD;
    }
}
