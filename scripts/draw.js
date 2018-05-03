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
var mouth = snap.rect(100, 150, 100, 50);
var mouthHole = snap.rect(110, 160, 80, 30);
mouthHole.attr({
    fill: 'pink'
});
