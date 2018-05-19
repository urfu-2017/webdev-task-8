'use strict';
/* eslint-disable */

function failingASleepAnimation(delay) {
    leftEye.animate({ transform: 's0.5' }, delay, mina.linear);
    rightEye.animate({ transform: 's0.5' }, delay, mina.linear);
}

function awakeningAnimation(delay) {
    leftEye.animate({ transform: 's1' }, delay, mina.linear);
    rightEye.animate({ transform: 's1' }, delay, mina.linear);
}

function eatingAnimation(delay) {
    mouthHole.animate({ transform: 's0.5' }, delay, mina.linear);
    setTimeout(() => mouthHole.animate({ transform: 's1' }, delay, mina.linear), delay);
}

function talkingAnimation(delay) {
    delay *= 2;
    leftEar.animate({ transform: 's2' }, delay, mina.linear);
    rightEar.animate({ transform: 's2' }, delay, mina.linear);
    setTimeout(() => leftEar.animate({ transform: 's1' }, delay, mina.linear), delay);
    setTimeout(() => rightEar.animate({ transform: 's1' }, delay, mina.linear), delay);
}

function dyingAnimation() {
    body.attr({ fill: 'black' });
    mouthHole.attr({ fill: 'black' });
}

function respawnAnimation() {
    body.attr({ fill: 'pink' });
    mouthHole.attr({ fill: 'pink' });
}
