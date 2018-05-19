'use strict';
/* eslint-disable */

var restartButton = document.querySelector('.restart-button');
restartButton.addEventListener('click', function (e) {
    resetState();
    initState();
});
