let notify = () => {
    // stib
};

if (('Notification' in window)) {
    Notification.requestPermission(permission => {
        if (permission !== 'granted') {
            return;
        }

        let isMoodNotify = false;
        let isSatietyNotify = false;

        // eslint-disable-next-line complexity
        notify = ({ mood, satiety }) => {
            let message = '';

            if (mood < 10 && !isMoodNotify) {
                message = 'Запас настроения менее 10%';
                isMoodNotify = true;
            } else if (satiety < 10 && !isSatietyNotify) {
                message = 'Запас сытости менее 10%';
                isSatietyNotify = true;
            }

            // сбрасываем флаги уведовлений если параметр восстановился
            isMoodNotify = !(mood >= 10);
            isSatietyNotify = !(satiety >= 10);

            if (message) {
                // eslint-disable-next-line no-new
                new Notification('Хрюногочи под угрозой', { body: message });
            }
        };
    });
}

export { notify };
