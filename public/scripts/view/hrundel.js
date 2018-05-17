'use strict';
/* eslint-disable */

const svg = Snap("#svg");

const face = svg.circle(120, 50, 50);
const leftEye = svg.circle(100, 40, 5);
const rightEye = svg.circle(130, 40, 5);
leftEye.attr({
    fill: 'coral',
    stroke: 'coral',
    strokeOpacity: 0.3,
    strokeWidth: 10
});
rightEye.attr({
    fill: 'coral',
    stroke: 'coral',
    strokeOpacity: 0.3,
    strokeWidth: 10
});

function svgSleep() {
    leftEye.animate({ r: 0 }, 1000);
    rightEye.animate({ r: 0 }, 1000);
}

function svgLive() {
    leftEye.animate({ r: 5 }, 1000);
    rightEye.animate({ r: 5 }, 1000);
}
