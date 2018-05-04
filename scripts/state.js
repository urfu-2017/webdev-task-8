'use strict';
/* eslint-disable */

var states = {
    NOTHING: 'NONE',
    DEAD: 'DEAD',
    SLEEPING: 'SLEEPING',
    EATING: 'EATING',
    TALKING: 'TALKING'
}
var currentState = states.NOTHING;

var satiety = document.querySelector('.stat__amount_satiety');
var energy = document.querySelector('.stat__amount_energy');
var mood = document.querySelector('.stat__amount_mood');
var deathText = document.querySelector('.death-text');

function resetState() {
    localStorage.setItem('satiety', 100);
    localStorage.setItem('energy', 100);
    localStorage.setItem('mood', 100);
    currentState = states.NOTHING;
    deathText.innerHTML = '';
}
function initState() {
    satiety.innerHTML = localStorage.getItem('satiety');
    energy.innerHTML = localStorage.getItem('energy');
    mood.innerHTML = localStorage.getItem('mood');
}
function saveState() {
    localStorage.setItem('satiety', satiety.innerHTML);
    localStorage.setItem('energy', energy.innerHTML);
    localStorage.setItem('mood', mood.innerHTML);
}
function gainStat(stat, value) {
    let oldValue = parseInt(stat.innerHTML);
    let newValue = oldValue + value;
    if (newValue > 100) {
        newValue = 100;
    }
    stat.innerHTML = newValue;

    saveState();
}
function loseStat(stat, value) {
    let oldValue = parseInt(stat.innerHTML);
    let newValue = oldValue - value;
    if (newValue < 0) {
        newValue = 0;
    }
    stat.innerHTML = newValue;

    saveState();
}
