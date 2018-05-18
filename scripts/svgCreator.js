'use strict';
/* eslint-disable */
(() => {
    const snap = Snap(265, 260);
    let face = snap.circle(150, 150, 100);
    const alive = {
        fill: '#fda9f7',
        stroke: '#000',
        strokeWidth: 5
    };

    const dead = {
        fill: '#8dbdb6',
        stroke: '#000',
        strokeWidth: 5
    };

    face.attr(alive);
    const eyeColor = {
        fill: '#000'
    };

    let leftEye = snap.ellipse(110, 100, 20, 30);
    let rightEye = snap.ellipse(190, 100, 20, 30);
    leftEye.attr(eyeColor);
    rightEye.attr(eyeColor);
    const innerNose = {
        fill: '#f1adb9',
        stroke: '#000',
        strokeWidth: 3
    };

    const nose = snap.ellipse(150, 160, 40, 23);
    nose.attr(innerNose);
    const leftNostril = snap.ellipse(135, 160, 5, 10);
    const rightNostril = snap.ellipse(165, 160, 5, 10);
    const nostril = {
        fill: '#de8796',
        stroke: '#000',
        strokeWidth: 3
    };

    leftNostril.attr(nostril);
    rightNostril.attr(nostril);
    const mouth = {
        fill: '#e81339',
        stroke: '#000',
        strokeWidth: 2
    };
    let currentMouth = snap.ellipse(150,220,45, 30, 30, 45, 9);
    currentMouth.attr(mouth);
    const leftEar = snap.polygon([60, 110, 70, 90, 90, 70, 110, 60, 55, 35]);
    leftEar.attr(nostril);
    const rigthEar = snap.polygon([240, 110, 260, 50, 185, 55, 205, 65, 225, 80]);
    rigthEar.attr(nostril);

    const makeSadFace = () => {
        currentMouth.remove();
        currentMouth = snap.polygon([110, 215, 150, 195, 190, 215]);
        currentMouth.attr(mouth);
    };

    const makeHappyFace = () => {
        face.attr(alive);
        currentMouth.remove();
        currentMouth = snap.polygon([110, 195, 150, 215, 190, 195]);
        currentMouth.attr(mouth);
        leftEye.remove();
        rightEye.remove();
        leftEye = snap.ellipse(110, 100, 20, 30);
        rightEye = snap.ellipse(190, 100, 20, 30);
    };

    const makeMehFace = () => {
        currentMouth.remove();
        currentMouth = snap.ellipse(150,220,45, 30, 30, 45, 9);
        currentMouth.attr(mouth);
    };

    const die = () => {
        makeMehFace();
        face.attr(dead);
        leftEye.remove();
        leftEye = snap.text(110, 100, 'О');
        rightEye.remove();
        rightEye = snap.text(175, 100, 'О');
    };

    setInterval(() => {
        const lack = document.querySelectorAll('.lack');
        let death = 0;
        const values = [];
        for (let need of lack) {
            values.push(need.offsetWidth);
            if (need.offsetWidth === 100) {
                death++;
            }
        }
        const max = Math.max(...values);
        if (max >= 50) {
            makeSadFace();
        } else if (max >= 25) {
            makeMehFace();
        } else {
            makeHappyFace();
        }
        if (death > 1) {
            die();
        }
    }, 1000);
})();
