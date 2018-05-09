'use strict';
/* eslint-disable */
(() => {
    const s = Snap(265, 260);
    let face = s.circle(150, 150, 100);
    const alive = {
        fill: '#fdd7e4',
        stroke: '#000',
        strokeWidth: 5
    };

    face.attr(alive);
    const eyeColor = {
        fill: '#000'
    };

    let leftEye = s.ellipse(110, 100, 20, 30);
    let rightEye = s.ellipse(190, 100, 20, 30);
    leftEye.attr(eyeColor);
    rightEye.attr(eyeColor);
    leftEye.attr(eyeColor);
    const innerNose = {
        fill: '#f1adb9',
        stroke: '#000',
        strokeWidth: 3
    };

    const nose = s.ellipse(150, 160, 40, 23);
    nose.attr(innerNose);
    const leftNostril = s.ellipse(135, 160, 5, 10);
    const rightNostril = s.ellipse(165, 160, 5, 10);
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
    let currentMouth = s.polygon([110, 195, 150, 215, 190, 195]);
    currentMouth.attr(mouth);
    const leftEar = s.polygon([60, 110, 70, 90, 90, 70, 110, 60, 55, 35]);
    leftEar.attr(nostril);
    const rigthEar = s.polygon([240, 110, 260, 50, 185, 55, 205, 65, 225, 80]);
    rigthEar.attr(nostril);

    const makeSadFace = () => {
        currentMouth.remove();
        currentMouth = s.polygon([110, 215, 150, 195, 190, 215]);
        currentMouth.attr(mouth);
    };

    const makeHappyFace = () => {
        face.attr(alive);
        currentMouth.remove();
        currentMouth = s.polygon([110, 195, 150, 215, 190, 195]);
        currentMouth.attr(mouth);
        leftEye.remove();
        rightEye.remove();
        leftEye = s.ellipse(110, 100, 20, 30);
        rightEye = s.ellipse(190, 100, 20, 30);
    };

    const makeMehFace = () => {
        currentMouth.remove();
        currentMouth = s.polygon([110, 195, 190, 195]);
        currentMouth.attr(mouth);
    };

    const die = () => {
        makeMehFace();
        face.attr({
            fill: '#8dbdb6',
            stroke: '#000',
            strokeWidth: 5
        });
        leftEye.remove();
        leftEye = s.text(110, 100, 'X');
        rightEye.remove();
        rightEye = s.text(175, 100, 'X');
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
