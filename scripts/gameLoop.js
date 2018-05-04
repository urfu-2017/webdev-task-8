'use strict';
/* eslint-disable */

var delay = 500;
function gameLoop() {
    checkDeath();
    checkStat(satiety, 'WANT TO EAT');
    checkStat(mood, 'WANT TO TALK');
    switch (currentState) {
        case states.DEAD: dying(); break;
        case states.SLEEPING: sleeping(); break;
        case states.EATING: eating(); break;
        case states.TALKING: talking(); break;
        case states.NOTHING: nothing(); break;
    }
    setTimeout(() => gameLoop(), delay);
}

if (localStorage.length === 0) {
    resetState();
}
initState();
setTimeout(() => gameLoop(), delay);
