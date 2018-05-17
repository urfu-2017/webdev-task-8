export class NotificationAPI {
    constructor() {
        this.isAllow = false;

        if (('Notification' in window)) {
            Notification.requestPermission(permission => {
                this.isAllow = permission === 'granted';
            });
        }
    }

    notify({ mood, satiety }) {
        if (!this.isAllow) {
            return;
        }

        let message = '';

        if (mood === 10) {
            message = 'Запас настроения равен 10%';
        } else if (satiety === 10) {
            message = 'Запас сытости равен 10%';
        }

        if (message) {
            // eslint-disable-next-line no-new
            new Notification('Хрюногочи под угрозой', { body: message });
        }
    }
}
