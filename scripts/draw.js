'use strict';
/* eslint-disable */

var snap = Snap('.svg');
var body = snap.circle(150, 150, 100);
body.attr({
    fill: 'pink',
    stroke: '#000',
    strokeWidth: 2
});
var leftEye = snap.circle(100, 110, 20);
var rightEye = snap.circle(200, 110, 20);
var leftEar = snap.polygon(
    90, 80,
    70, 80,
    60, 70,
    75, 60,
    85, 60,
    100, 70);
var rightEar = snap.polygon(
    220, 80,
    200, 80,
    190, 70,
    205, 60,
    215, 60,
    230, 70);
var mouth = snap.ellipse(150, 190, 60, 30);
var mouthHole = snap.ellipse(150, 190, 50, 20);
mouthHole.attr({
    fill: 'pink'
});
