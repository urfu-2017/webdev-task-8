window.svg = {};
// eslint-disable-next-line
window.svg.snap = Snap('.hru__svg');
const svg = window.svg.snap;
window.svg.size = {
    width: svg.node.clientWidth,
    height: svg.node.clientHeight
};
const svgSize = window.svg.size;

// тело
const body = svg.circle(svgSize.width / 2, svgSize.height / 2 + 110, 90);
body.attr({
    fill: '#ffcaca'
});
const tummy = svg.circle(svgSize.width / 2, svgSize.height / 2 + 110, 60);
tummy.attr({
    fill: '#fcb9b9'
});

const hand1 = svg.path(`M${svgSize.width / 2 - 100},${svgSize.height / 2 + 110} ` +
    'h-30 a30,30 0 1,0 20-30z');
const hand2 = hand1.clone();
hand2.transform('t200 r110');
const hands = svg.group(hand1, hand2);
hands.attr({
    fill: '#f49898'
});
const leg1 = hand1.clone();
leg1.transform('t140,70 r70');
const leg2 = hand2.clone();
leg2.transform('t70,70 r30');


// голова
const head = svg.circle(svgSize.width / 2, svgSize.height / 2, 110);
head.attr({
    fill: '#ffcaca'
});
const penny = svg.ellipse(svgSize.width / 2, svgSize.height / 2 + 35, 55, 35);
penny.attr({
    fill: '#fcb9b9'
});
const eye = svg.circle(svgSize.width / 2 - 50, svgSize.height / 2, 30);
const eyes = svg.group(eye, svg.circle(svgSize.width / 2 + 50, svgSize.height / 2, 30));
eyes.attr({
    fill: '#fff'
});
const pupil = svg.circle(svgSize.width / 2 - 50, svgSize.height / 2 + 5, 20);
const pupils = svg.group(pupil, svg.circle(svgSize.width / 2 + 50, svgSize.height / 2 + 5, 20));
pupils.attr({
    fill: '#000'
});
const shine = svg.circle(svgSize.width / 2 - 50, svgSize.height / 2, 7);
const shines = svg.group(shine, svg.circle(svgSize.width / 2 + 50, svgSize.height / 2, 7));
shines.attr({
    fill: '#fff'
});
window.svg.eyes = svg.g(eyes, pupils, shines);
const nostril = svg.circle(svgSize.width / 2 - 20, svgSize.height / 2 + 30, 15);
const nostrils = svg.group(
    nostril,
    svg.circle(svgSize.width / 2 + 20, svgSize.height / 2 + 30, 15)
);
nostrils.attr({
    fill: '#f9a7a7'
});
window.svg.mouth = svg.path(`M${svgSize.width / 2 - 20},${svgSize.height / 2 + 55} A48,78` +
    ` 0 0,0 ${svgSize.width / 2 + 20},${svgSize.height / 2 + 55}`);
const mouth = window.svg.mouth;
mouth.attr({
    fill: '#fcb9b9',
    stroke: '#000',
    strokeWidth: 2
});
window.svg.mouthSleep = svg.circle(svgSize.width / 2, svgSize.height / 2 + 57, 8);
window.svg.mouthSleep.attr({
    fill: 'none',
    stroke: '#000',
    strokeWidth: 2,
    opacity: 0
});
window.svg.mouthSadly = svg.line(
    svgSize.width / 2 - 20,
    svgSize.height / 2 + 55,
    svgSize.width / 2 + 20,
    svgSize.height / 2 + 55
);
window.svg.mouthSadly.attr({
    fill: 'none',
    stroke: '#000',
    strokeWidth: 2,
    opacity: 0
});

const eyeLine1Dead = svg.line(
    svgSize.width / 2 - 55, svgSize.height / 2 - 20,
    svgSize.width / 2 - 30, svgSize.height / 2 + 10
);
const eyeLine2Dead = svg.line(
    svgSize.width / 2 - 30, svgSize.height / 2 - 20,
    svgSize.width / 2 - 55, svgSize.height / 2 + 10
);
const eye1Dead = svg.g(eyeLine1Dead, eyeLine2Dead);
eye1Dead.attr({
    fill: 'none',
    stroke: '#000',
    strokeWidth: 2
});
const eye2Dead = eye1Dead.clone();
eye2Dead.attr({ transform: 't85' });
window.svg.eyeDead = svg.g(eye1Dead, eye2Dead);
window.svg.eyeDead.attr({ opacity: 0 });

const eye1Sleep = svg.path(`M${svgSize.width / 2 - 60},${svgSize.height / 2 + 5} A29,78` +
` 0 0,1 ${svgSize.width / 2 - 25},${svgSize.height / 2 + 5}`);
const eye2Sleep = eye1Sleep.clone();
eye2Sleep.transform('t75');
window.svg.eyesSleep = svg.group(eye1Sleep, eye2Sleep);
window.svg.eyesSleep.attr({
    fill: 'none',
    stroke: '#000',
    strokeWidth: 2,
    opacity: 0
});

// уши

const ear1 = svg.circle(svgSize.width / 2 - 100, svgSize.height / 2 - 80, 70);
const earMask1 = svg.rect(
    svgSize.width / 2 - 170,
    svgSize.height / 2 - 80,
    140,
    70
);
earMask1.attr({
    fill: '#fff'
});
ear1.attr({
    mask: earMask1
});
ear1.transform('r-45');
const ear2 = svg.circle(svgSize.width / 2 + 100, svgSize.height / 2 - 80, 70);
const earMask2 = svg.rect(
    svgSize.width / 2 + 30,
    svgSize.height / 2 - 80,
    140,
    70
);
earMask2.attr({
    fill: '#fff'
});
ear2.attr({
    mask: earMask2
});
ear2.transform('r45');
const ears = svg.group(ear1, ear2);
ears.attr({ fill: '#f9a7a7' });

window.svg.state = {
    dead() {
        window.svg.eyes.attr({ opacity: 0 });
        window.svg.eyeDead.attr({ opacity: 1 });
        window.svg.mouth.attr({ transform: 's-1' });
    },
    default() {
        window.svg.eyesSleep.attr({ opacity: 0 });
        window.svg.eyes.attr({ opacity: 1 });
        window.svg.eyeDead.attr({ opacity: 0 });
        window.svg.mouthSleep.attr({ opacity: 0 });
        window.svg.mouth.attr({ transform: 's1', opacity: 1 });
    },
    earUp() {
        ear2.transform('r20 t0,-30');
    },
    earDown() {
        ear2.transform('r45');
    },
    sleep() {
        window.svg.eyes.attr({ opacity: 0 });
        window.svg.eyesSleep.attr({ opacity: 1 });
        window.svg.mouth.attr({ opacity: 0 });
        window.svg.mouthSleep.attr({ opacity: 1 });
    }
};
