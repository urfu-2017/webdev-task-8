import Snap from 'snapsvg';

const hrundel = document.querySelector('#hrundel__image');
// eslint-disable-next-line new-cap
const snap = Snap(hrundel);
const aliveEyes = snap.selectAll('.hrundel__eye_alive');
const deadEyes = snap.selectAll('.hrundel__eye_dead');
const month = snap.select('.hrundel__month');
let idIntervalMouth;


export function closeEyes(duration = 0, delay = 0) {
    setTimeout(() => aliveEyes.forEach(eye => eye.animate({ ry: 1 }, duration)), delay);
}

export function openEyes(duration = 1000, delay = 1000) {
    setTimeout(() => aliveEyes.forEach(eye => eye.animate({ ry: 5 }, duration)), delay);
}

export function fall() {
    deadEyes.forEach(eye => eye.node.classList.remove('hide'));
    aliveEyes.forEach(eye => eye.node.classList.add('hide'));
    endLoopAnimationMouth();
}

export function revive() {
    aliveEyes.forEach(eye => eye.node.classList.remove('hide'));
    deadEyes.forEach(eye => eye.node.classList.add('hide'));
    endLoopAnimationMouth();
}

function openMouth(duration = 500, delay = 0) {
    setTimeout(() => month.animate({ ry: 6 }, duration), delay);
}

function closeMouth(duration = 500, delay = 0) {
    setTimeout(() => month.animate({ ry: 1 }, duration), delay);
}

export function loopAnimationMouth() {
    endLoopAnimationMouth();
    idIntervalMouth = setInterval(() => {
        openMouth(500, 0);
        closeMouth(500, 700);
    }, 1400);
}

export function endLoopAnimationMouth() {
    clearInterval(idIntervalMouth);
}
