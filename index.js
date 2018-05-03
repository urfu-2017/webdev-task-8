/* eslint-disable no-unused-vars */

function start() {
    let elemEnergy = document.getElementById('energy');
    let elemHungry = document.getElementById('hungry');
    elemEnergy.style.width = elemEnergy.clientWidth - 1 + 'px';
    elemHungry.style.width = elemHungry.clientWidth - 1 + 'px';
    let id = setInterval(frame, 1000);
    function frame() {
        if (elemEnergy.style.width === '0px') {
            clearInterval(id);
        } else {
            elemHungry.style.width = parseInt(elemHungry.style.width) - 1 + 'px';
            elemEnergy.style.width = parseInt(elemEnergy.style.width) - 1 + 'px';
        }
    }
}

function eatMe() {
    let elemEnergy = document.getElementById('energy');
    elemEnergy.style.width = 300 + 'px';
}

function sleep() {
    let elemHungry = document.getElementById('hungry');
    elemHungry.style.width = 300 + 'px';
}
