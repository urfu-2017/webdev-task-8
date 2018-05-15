(function () {
    window.hruStorage = {
        setObject(key, value) {
            if (value === null) {
                localStorage.removeItem(key);
            } else {
                localStorage.setItem(key, JSON.stringify(value));
            }
        },

        getObject(key) {
            const value = localStorage.getItem(key);

            return value === null
                ? null
                : JSON.parse(value);
        },

        setDate(key, value) {
            this.setObject(key, value);
        },

        getDate(key) {
            const value = this.getObject(key);

            return value === null
                ? null
                : new Date(value);
        }
    };

}());
