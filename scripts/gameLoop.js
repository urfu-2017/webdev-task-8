'use strict';
/* eslint-disable */

var delay = 1000;
var isSatietyNotified = false;
var isMoodNotified = false;
function gameLoop() {
    checkDeath();
    isSatietyNotified = checkStat(satiety, 'WANT TO EAT', isSatietyNotified);
    isMoodNotified = checkStat(mood, 'WANT TO TALK', isMoodNotified);
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
