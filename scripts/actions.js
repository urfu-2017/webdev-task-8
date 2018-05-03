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
    gainStat(mood, gainConst * 4);
    currentState = states.NOTHING;
}
function nothing() {
    loseStat(satiety, loseConst);
    loseStat(energy, loseConst);
    loseStat(mood, loseConst);
}
function dying() {
    console.info('FATALITY');
}
function checkDeath() {
    let satietyIsZero = parseInt(satiety.innerHTML) === 0;
    let energyIsZero = parseInt(energy.innerHTML) === 0;
    let moodIsZero = parseInt(mood.innerHTML) === 0;
    let a = satietyIsZero && energyIsZero;
    let b = energyIsZero && moodIsZero;
    let c = satietyIsZero && moodIsZero;

    if (a || b || c) {
        currentState = states.DEAD;
    }
}
