/* eslint-disable no-unused-vars */

window.addEventListener('load', recovery);

let id;

let getCountOfLives = paramName => localStorage.getItem(paramName) > 1
    ? Number(localStorage.getItem(paramName)) : 1;

function recovery() {
    clearInterval(id);
    id = setInterval(() => {
        let energy = getCountOfLives('energy');
        let fun = getCountOfLives('fun');
        let hungry = getCountOfLives('hungry');

        let isEnergy = energy > 1 ? 1 : 0;
        let isFun = fun > 0 ? 1 : 0;
        let isHunger = hungry > 0 ? 1 : 0;

        if (isEnergy + isFun + isHunger < 2) {
            console.info('die');
            localStorage.setItem('die', isEnergy + isFun + isHunger);
            update();
            clearInterval(id);
        } else {
            localStorage.setItem('energy', energy - 1);
            localStorage.setItem('fun', fun - 1);
            localStorage.setItem('hungry', hungry - 1);

            update();
        }
    }, 1000);
}

function start() {
    init();

    recovery();
}

function init() {
    localStorage.setItem('energy', 100);
    localStorage.setItem('hungry', 100);
    localStorage.setItem('fun', 100);
    localStorage.setItem('die', 3);

    update();
}

function update() {
    document.getElementById('energy-count').innerHTML =
        `energy ${localStorage.getItem('energy')}hp`;
    document.getElementById('fun-count').innerHTML = `fun ${localStorage.getItem('fun')}hp`;
    document.getElementById('hungry-count').innerHTML =
        `hungry ${localStorage.getItem('hungry')}hp`;
}
