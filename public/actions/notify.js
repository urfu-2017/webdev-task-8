const Notification = window.Notification || window.webkitNotification;
const lifeTimeNotifications = 2 * 10 ** 3;
const millisecondsBetweenNotifications = 7 * 10 ** 3;
let pauseBetweenNotificationsIsOver = true;


export default desiredAction => {
    if (!Notification) {
        return;
    }
    Notification.requestPermission()
        .then(() => {
            if (!pauseBetweenNotificationsIsOver) {
                return;
            }
            pauseBetweenNotificationsIsOver = false;
            const notification = createNotification(desiredAction);
            setTimeout(notification.close.bind(notification), lifeTimeNotifications);
            setTimeout(listenToNotifications, millisecondsBetweenNotifications);
        });
};

function createNotification(desiredAction) {
    const title = 'Hrundel';
    const options = {
        body: `Hrundel want ${desiredAction}`,
        icon: './pictures/hrundel-icon.png'
    };

    return new Notification(title, options);
}

function listenToNotifications() {
    pauseBetweenNotificationsIsOver = true;
}
