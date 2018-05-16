const food = window.svg.snap.image('./image/food-apple.svg', 30, 20, 35, 35);
food.attr({ opacity: 0 });

if (!navigator.getBattery) {
    if (window.health.satiety !== 100) {
        food.attr({ opacity: 1 });
    }
    setInterval(function () {
        deleteSatiety();
        if (window.health.satiety < 100) {
            food.attr({ opacity: 1 });
        }
    }, 10000);
    food.click(() => {
        if (window.isSleep || window.dead) {
            return;
        }
        if (window.health.satiety < 100) {
            food.attr({ opacity: 0 });
            setTimeout(()=> food.attr({ opacity: 1 }), 300);
            addSatiety(10);
        }
        if (window.health.satiety === 100) {
            food.attr({ opacity: 0 });
        }
    });
} else {
    navigator
        .getBattery()
        .then(initBattery);
}
function initBattery(battery) {
    battery.onlevelchange = updateLevel;
    battery.onlevelchange();
}

function updateLevel() {
    if (this.charging && window.health.satiety < 100) {
        addSatiety();
    }
    if (!this.charging) {
        deleteSatiety();
    }
}

function addSatiety(count) {
    if (window.isSleep || window.dead) {
        return;
    }
    window.mood.recognize.stop();
    window.mood.listening = false;
    food.animate({
        opacity: 1,
        transform: 't115,220'
    }, 400);
    setTimeout(() => {
        food.animate({
            opacity: 0
        }, 200);
    }, 400);
    setTimeout(() => {
        food.attr({
            transform: 't0,0',
            opacity: 1
        });
    }, 700);
    const satiety = window.health.satiety + count <= 100 ? count : 100 - window.health.satiety;
    window.health.satiety += satiety;
    window.health.refresh(window.health.satietyHTML, window.health.satiety);
    if (window.health.satiety === 100) {
        food.attr({ opacity: 0 });
    }
}

function deleteSatiety() {
    if (window.health.satiety > 0) {
        window.health.satiety = window.health.satiety - 1;
        window.health.refresh(window.health.satietyHTML, window.health.satiety);
    }
}
