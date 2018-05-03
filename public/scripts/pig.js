'use strict';

const s = Snap(265, 260); // eslint-disable-line

let face = s.circle(150, 150, 100);
const alive = {
    fill: '#ff69b4',
    stroke: '#000'
};
const dead = {
    fill: '#8dbdb6',
    stroke: '#000'
};
const eyeColor = {
    fill: '#FFF'
};

face.attr(alive);

let leftEye = createEye(100);
let leftPupil = s.circle(100 + 10, 100, 10);
let rightEye = createEye(200);
let rightPupil = s.circle(200 + 10, 100, 10);

const innerNose = {
    fill: '#f1adb9',
    stroke: '#000',
    strokeWidth: 3
};

const nose = s.circle(150, 160, 40);
nose.attr(innerNose);
s.ellipse(135, 160, 5, 10);
s.ellipse(165, 160, 5, 10);

const die = () => {
    face.attr(dead);
    leftEye.remove();
    leftPupil.remove();
    rightEye.remove();
    rightPupil.remove();
};

setInterval(() => {
    let isDead = localStorage.getItem('isDead') === 'true';
    if (isDead) {
        die();
    }
}, 1000);


function createEye(x) {
    let eye = s.circle(x, 100, 20);
    eye.attr(eyeColor);

    return eye;
}
