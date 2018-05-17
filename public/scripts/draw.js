'use strict';

let energyOffset = document.getElementById('energy-offset');
let hungryOffset = document.getElementById('hungry-offset');
let funOffset = document.getElementById('fun-offset');

energyOffset.style.position = 'absolute';
energyOffset.style.top = '26px';
energyOffset.style.marginLeft = '8px';

funOffset.style.position = 'absolute';
funOffset.style.top = '64px';
funOffset.style.marginLeft = '8px';

hungryOffset.style.position = 'absolute';
hungryOffset.style.top = '102px';
hungryOffset.style.marginLeft = '8px';

let isEnergy = localStorage.getItem('energy') > 0 ? 1 : 0;
let isFun = localStorage.getItem('fun') > 0 ? 1 : 0;
let isHunger = localStorage.getItem('hungry') > 0 ? 1 : 0;

setInterval(() => {
    isEnergy = localStorage.getItem('energy') > 0 ? 1 : 0;
    isFun = localStorage.getItem('fun') > 0 ? 1 : 0;
    isHunger = localStorage.getItem('hungry') > 0 ? 1 : 0;
    if (isEnergy + isFun + isHunger >= 2) {
        // clearInterval(drawId);
        energyOffset.style.left = `${Number(localStorage.getItem('energy'))}px`;
        funOffset.style.left = `${Number(localStorage.getItem('fun'))}px`;
        hungryOffset.style.left = `${Number(localStorage.getItem('hungry'))}px`;
    } else {
        return;
    }
}, 1000);
