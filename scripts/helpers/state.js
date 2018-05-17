module.exports.initState = () => {
    if (!localStorage.state) {
        let state = {
            energy: 100,
            satiety: 100,
            mood: 100
        };

        localStorage.state = JSON.stringify(state);

        return state;
    }

    return JSON.parse(localStorage.state);
};

module.exports.saveState = (state) => {
    localStorage.state = JSON.stringify(state);
};

module.exports.clearState = () => {
    localStorage.removeItem('state');
};
