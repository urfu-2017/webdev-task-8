window.addEventListener('load', async function () {
    const POLLING_INTERVAL = 2500;
    const { hrundel } = window;
    const Notification = window.Notification || window.webkitNotification;
    if (!Notification) {
        return;
    }

    if (Notification.permission !== 'granted') {
        Notification.requestPermission();
    }

    const notify = (text) => {
        if (Notification.permission === 'granted') {
            new Notification(text); // eslint-disable-line no-new
        }
    };

    setInterval(function () {
        if (document.visibilityState === 'hidden') {
            if (hrundel.mood <= 10) {
                notify('Я соскучился!');
            }
        }
    }, POLLING_INTERVAL);

    setInterval(function () {
        if (document.visibilityState === 'hidden') {
            if (hrundel.food <= 10) {
                notify('Я проголодался');
            }
        }
    }, POLLING_INTERVAL, POLLING_INTERVAL / 2);
}, false);
