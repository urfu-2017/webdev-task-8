'use strict';

(() => {

    const retrieveState = () => {
        const hunger = localStorage.getItem('hunger');
        const energy = localStorage.getItem('energy');
        const mood = localStorage.getItem('mood');
        document.querySelector('.hunger-lack').style.width = hunger + '%';
        document.querySelector('.energy-lack').style.width = energy + '%';
        document.querySelector('.mood-lack').style.width = mood + '%';
    };

    window.addEventListener('load', retrieveState);

    setInterval(() => {
        localStorage.setItem('hunger', document.querySelector('.hunger-lack').offsetWidth);
        localStorage.setItem('energy', document.querySelector('.energy-lack').offsetWidth);
        localStorage.setItem('mood', document.querySelector('.mood-lack').offsetWidth);
    }, 100);
})();
