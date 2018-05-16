// eslint-disable-next-line
module.exports.alternate = function alternate(element, startAttr, endAttr, fullTime, count) {
    if (count <= 0) {
        return;
    }

    element.animate(startAttr, fullTime / 2, () => {
        element.animate(endAttr, fullTime / 2, () => {
            alternate(element, startAttr, endAttr, fullTime, --count);
        });
    });
};

module.exports.reset = function reset(element, time) {
    element.stop();
    element.animate({
        transform: 't0,0 r0 s1',
        opacity: 1
    }, time || 200);
};
