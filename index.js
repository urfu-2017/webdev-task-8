const maxValueCharacteristic = 100;
const linearChangeTime = 250;
const increaseMultiplier = 10;
let state = JSON.parse(localStorage.getItem('state')) || {
    characteristics: {
        satiety: maxValueCharacteristic,
        energy: maxValueCharacteristic,
        mood: maxValueCharacteristic
    },
    pressedAction: [],
    act: undefined,
    isAlive: true
};
const actToCharacteristic = {
    eat: 'satiety'
};


window.addEventListener('load', () => {
    linearChangeAllCharacteristics();
    const newGameButton = document.querySelector('#new-game');
    newGameButton.addEventListener('click', setDefaultState);
    grunt();
    eat();
});


function linearChangeAllCharacteristics() {
    const commonBlock = document.querySelector('.characteristics');
    const pixelsForUnit = commonBlock.clientWidth / maxValueCharacteristic;
    Object.keys(state.characteristics).forEach(characteristicName => {
        const characteristicCommon = document.querySelector(`#${characteristicName}`);
        const characteristicScale =
            characteristicCommon.querySelector('.characteristics__value');
        setInterval(() => {
            linearChangeCharacteristic(characteristicName, characteristicScale, pixelsForUnit);
        }, linearChangeTime);
    });
}

function linearChangeCharacteristic(characteristicName, characteristicScale, pixelsForUnit) {
    if (actToCharacteristic[state.act] === characteristicName) {
        state.characteristics[characteristicName] = Math.min(
            maxValueCharacteristic, state.characteristics[characteristicName] + increaseMultiplier
        );
    } else {
        state.characteristics[characteristicName] =
            Math.max(0, state.characteristics[characteristicName] - 1);
    }
    characteristicScale.style.width =
        `${pixelsForUnit * state.characteristics[characteristicName]}px`;
    saveState();
}

function setCharacteristic(characteristicName, characteristicValue) {
    state.characteristics[characteristicName] = characteristicValue;
}

function saveState() {
    localStorage.setItem('state', JSON.stringify(state));
}

function setDefaultState() {
    Object.keys(state.characteristics).forEach(characteristicName => {
        state.characteristics[characteristicName] = maxValueCharacteristic;
    });
    state.pressedAction.length = 0;
    state.act = undefined;
    state.isAlive = true;
    eat();
}

function grunt() {
    const audio = new Audio();
    audio.src = 'public/grunt.mp3';

    let recursiveGrunt = function innerGrunt() {
        if (state.isAlive) {
            audio.play();
        }
        const randomInterval = getRandomInt(10 ** 4, 2 * 10 ** 4);
        setTimeout(innerGrunt, randomInterval);
    };

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    const randomInterval = getRandomInt(10 ** 2, 2 * 10 ** 4);
    setTimeout(recursiveGrunt, randomInterval);


    const volumeAdjusterBlock = document.querySelector('#volume-hrundel');
    volumeAdjusterBlock.addEventListener('change', () => {
        audio.volume = volumeAdjusterBlock.value / 100;
    });
}

async function eat() {
    if (navigator.getBattery) {
        const battery = await navigator.getBattery();
        changeAction('eat', battery.charging);
        battery.addEventListener('chargingchange', () => {
            if (battery.charging) {
                changeAction('eat', true);
            } else {
                changeAction('eat', false);
            }
        });
    } else {
        const feedHrundelButton = document.querySelector('#feed-hrundel');
        feedHrundelButton.parentNode.style.display = 'block';
        feedHrundelButton.addEventListener('click', () => {
            if (state.isAlive) {
                setCharacteristic('satiety', 100);
            }
        });
    }
}

// function sendNotifications() {
//     const Notification = window.Notification || window.webkitNotification;
//     if (Notification) {
//         Notification.requestPermission(() => {
//             // setInterval(() => {
//             //     if (state.characteristics.)
//             //         }, linearChangeTime);
//         });
//     }
// }

function changeAction(act, actIsOn) {
    if (actIsOn) {
        state.act = act;
    } else {
        state.act = undefined;
    }
    // if (!state.pressedAction.includes(act) && actIsOn) {
    //     state.pressedAction.push(act);
    // } else if (state.pressedAction.includes(act) && !actIsOn) {
    //     // state.pressedAction
    // }
}


// function listen() {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     const recognizer = new SpeechRecognition();
//     recognizer.lang = 'en-US';
//     recognizer.continuous = true;
//     recognizer.interimResults = true;
//     const hrundel = document.querySelector('.hrundel');
//     let isListen = false;
//     hrundel.onclick = () => {
//         if (!isListen) {
//             recognizer.start();
//             isListen = true;
//             console.log('start');
//         } else {
//             recognizer.stop();
//             isListen = false;
//             console.log('end');
//         }
//     };
//
//     recognizer.onresult = function (e) {
//         var index = e.resultIndex;
//         var result = e.results[index][0].transcript.trim();
//         console.log('result', result);
//     };
//
//     recognizer.addEventListener('result', event => {
//         console.log('end');
//         const index = event.resultIndex;
//         const result = event.results[index][0].transcript.trim();
//         console.log(result);
//     });
// }
