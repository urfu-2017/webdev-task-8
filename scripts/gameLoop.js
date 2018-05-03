'use strict';
/* eslint-disable */

var requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;
var lastGameLoopTime = Date.now();
function gameLoop() {
    if (Date.now() - lastGameLoopTime > 500) {
        lastGameLoopTime = Date.now();
        checkDeath();
        checkStat(satiety, 'WANT TO EAT');
        checkStat(mood, 'WANT TO TALK');
        console.info(currentState);
        switch (currentState) {
            case states.DEAD: dying(); break;
            case states.SLEEPING: sleeping(); break;
            case states.EATING: eating(); break;
            case states.TALKING: talking(); break;
            case states.NOTHING: nothing(); break;
        }
    }
    requestAnimationFrame(gameLoop);
}

if (localStorage.length === 0) {
    resetState();
}
startGame();
requestAnimationFrame(gameLoop);
