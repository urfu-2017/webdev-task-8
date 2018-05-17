module.exports.lightnessCheck = (hrundel) => {
    window.addEventListener('devicelight', function (event) {

        if (event.value < 100) {
            hrundel.sleep();
        } else {
            hrundel.awake();
        }

    });
};
