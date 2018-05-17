const readings = { focused: true };


window.onfocus = () => {
    readings.focused = true;
};


window.onblur = () => {
    readings.focused = false;
};


export default readings;
