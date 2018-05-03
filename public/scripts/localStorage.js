'use strict';

const resetButton = document.querySelector('.reset-button');

function init() {
    localStorage.setItem('hunger', 100);
    localStorage.setItem('energy', 100);
    localStorage.setItem('mood', 100);

    updateParameters();
}

function updateParameters() {
    document.querySelector('.hunger').innerHTML = localStorage.getItem('hunger') + '%';
    document.querySelector('.energy').innerHTML = localStorage.getItem('energy') + '%';
    document.querySelector('.mood').innerHTML = localStorage.getItem('mood') + '%';
}


window.addEventListener('load', updateParameters);
resetButton.addEventListener('click', init);


setInterval(()=> {
    localStorage.setItem('hunger', getNewValue('hunger'));
    localStorage.setItem('energy', getNewValue('energy'));
    localStorage.setItem('mood', getNewValue('mood'));

    updateParameters();
}, 1000);

function getNewValue(parameterName) {
    var newValue = localStorage.getItem(parameterName) - 1;
    if (newValue > 0) {
        return newValue;
    }

    return 0;
}
