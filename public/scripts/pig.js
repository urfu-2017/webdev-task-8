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
let leftPupil = createPupil(100, 10);
let rightEye = createEye(200);
let rightPupil = createPupil(200, 10);

const innerNose = {
    fill: '#f1adb9',
    stroke: '#000',
    strokeWidth: 3
};

const nose = s.circle(150, 160, 40);
nose.attr(innerNose);
s.ellipse(135, 160, 5, 10);
s.ellipse(165, 160, 5, 10);

const mouth = {
    fill: '#e81339',
    stroke: '#000',
    strokeWidth: 2
};
let currentMouth = s.ellipse(150, 220, 10, 5);
currentMouth.attr(mouth);

const die = () => {
    face.attr(dead);
    leftEye.remove();
    leftPupil.remove();
    rightEye.remove();
    rightPupil.remove();
};

const live = () => {
    face.attr(alive);
    leftEye = createEye(100);
    let direction = getPupilDirecton();
    leftPupil = createPupil(100, direction);
    rightEye = createEye(200);
    rightPupil = createPupil(200, direction);
    currentMouth.remove();
    currentMouth = getMouth();
    currentMouth.attr(mouth);
};

setInterval(() => {
    let isDead = localStorage.getItem('isDead') === 'true';
    if (isDead) {
        die();
    } else {
        live();
    }
}, 1000);


function createEye(x) {
    let eye = s.circle(x, 100, 20);
    eye.attr(eyeColor);

    return eye;
}

function createPupil(x, offset) {
    return s.circle(x + offset, 100, 10);
}

function getMouth() {
    let averageHealth = Number(localStorage.getItem('averageHealth'));
    if (averageHealth > 70) {
        return s.ellipse(150, 220, 25, 5);
    }
    if (averageHealth > 40) {
        return s.ellipse(150, 220, 15, 5);
    }

    return s.ellipse(150, 220, 10, 5);
}

let previousDirection = 0;
function getPupilDirecton() {
    if (previousDirection === 0) {
        if (Math.random() > 0.5) {
            previousDirection = 10;

            return previousDirection;
        }
        previousDirection = -10;

        return previousDirection;
    }
    previousDirection = 0;

    return 0;
}
