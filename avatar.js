window.addEventListener('load', function () {
    const { Snap, mina } = window;

    const paper = Snap('#avatar'); // eslint-disable-line new-cap
    const style = {
        fill: '#da4dcc',
        stroke: '#000',
        strokeWidth: 5
    };
    const nose = paper.circle(150, 150, 50).attr(style);

    const background = paper.circle(150, 120, 100).attr(style);

    const leftNoozle = paper.circle(130, 140, 10);
    const rightNoozle = paper.circle(170, 140, 10);

    const leftEye = paper.ellipse(100, 70, 7, 5);
    const rightEye = paper.ellipse(200, 70, 7, 5);

    const leftEar = paper.polyline(
        150, 150,
        40, 20,
        20, 60).attr(style);

    const rightEar = paper.polyline(
        150, 150,
        260, 20,
        280, 60).attr(style);
    const head = paper.group(
        leftEar,
        rightEar,
        background,
        nose,
        leftNoozle,
        rightNoozle,
        leftEye,
        rightEye);

    function up() {
        head.animate({ transform: 'translate(0,15)' }, 700, mina.easeout, down);
    }

    function down() {
        head.animate({ transform: 'translate(0,-15)' }, 700, mina.easeout, up);
    }

    up();

}, false);
