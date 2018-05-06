'use strict';
/* eslint-disable */

Notification = window.Notification || window.webkitNotification;
Notification.requestPermission();
function notifyMe(text) {
    new Notification(text);
}
function checkStat(stat, text, isStatNotified) {
    if (!isStatNotified && parseInt(stat.innerHTML) <= 10) {
        notifyMe(text);
        return true;
    }
    if (isStatNotified && parseInt(stat.innerHTML) > 10) {
        return false;
    }
    return isStatNotified;
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
