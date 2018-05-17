module.exports = class {
    constructor() {
        this.isAvaliable = Boolean(window.Notification);
        this.permission = undefined;
    }

    requestPermission() {
        if (this.permission) {
            return;
        }

        return window.Notification.requestPermission().then(permission => {
            this.permission = permission;
        });
    }

    notify(text) {
        if (this.permission === 'denied') {
            return;
        }

        return new Notification(text);
    }
};
