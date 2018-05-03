const Notification = window.Notification ||
    window.webkitNotification;

export default function notificationSetup(game) {
    if (Notification) {
        if (Notification.permission === 'granted') {
            subscribe(game, Notification);
        } else {
            Notification.requestPermission(result => {
                if (result === 'granted') {
                    subscribe(game);
                }
            });
        }
    }
}

function subscribe(game) {
    game.on('hungry', () => notify('я проголодался'));
    game.on('bored', () => notify('ты что обиделся? ;('));
}

function notify(message) {
    let notification = new Notification('Самара', { body: message });
    setTimeout(notification.close.bind(notification), 5000);
}
