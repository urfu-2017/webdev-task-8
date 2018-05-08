let Notification;

function isAvailable() {
    if (window.Notification || window.webkitNotification) {
        return true;
    }

    return false;
}

function init() {
    Notification = window.Notification || window.webkitNotification;
    Notification.requestPermission();
}

function sendNotification(title, text, iconPath) {
    /* eslint-disable no-new */
    new Notification(title, { body: text, icon: iconPath });
}

export default { isAvailable, init, sendNotification };
