'use strict';
/* eslint-disable */

var gainConst = 4;
var loseConst = 1;
function eating() {
    gainStat(satiety, gainConst);
    loseStat(energy, loseConst);
    loseStat(mood, loseConst);
}
function sleeping() {
    loseStat(satiety, loseConst);
    gainStat(energy, gainConst);
    loseStat(mood, loseConst);
}
function talking() {
    loseStat(satiety, loseConst);
    loseStat(energy, loseConst);
    gainStat(mood, gainConst * 5);
    currentState = states.NOTHING;
}
function nothing() {
    loseStat(satiety, loseConst);
    loseStat(energy, loseConst);
    loseStat(mood, loseConst);
}
function dying() {
    deathText.innerHTML = 'ХРЮШКА УМЕРЛА';
}
