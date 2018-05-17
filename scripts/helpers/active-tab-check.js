module.exports.activeTabCheck = (hrundel) => {
    window.onfocus = () => {
        hrundel.awake();
    };

    window.onblur = () => {
        hrundel.sleep();
    };
};
