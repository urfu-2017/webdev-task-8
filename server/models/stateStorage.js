'use strict';

const maxIndicatorValue = 100;

class StateStorage {
    static load() {
        let indicators = localStorage.getItem('indicators');

        if (indicators) {
            return {
                indicators: JSON.parse(indicators),
                catState: localStorage.getItem('catState')
            };
        }

        indicators = {
            satiety: maxIndicatorValue,
            energy: maxIndicatorValue,
            mood: maxIndicatorValue
        };
        const catState = 'smile';

        localStorage.setItem('indicators', JSON.stringify(indicators));
        localStorage.setItem('catState', catState);

        return { indicators, catState };
    }

    static save({ indicators, catState }) {
        localStorage.indicators = JSON.stringify(indicators);
        localStorage.catState = catState;
    }
}

/* eslint-disable */
module.exports = StateStorage;
