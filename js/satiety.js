if (!navigator.getBattery) {
    const food = window.svg.snap.image('./image/food-apple.svg', 30, 20, 35, 35);
    if (window.health.satiety === 100) {
        food.attr({ opacity: 0 });
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
    if (window.dead || window.isSleep) {
        return;
    }
    window.mood.recognize.stop();
    window.mood.listening = false;
    const satiety = window.health.satiety + count <= 100 ? count : 100 - window.health.satiety;
    window.health.satiety += satiety;
    window.health.refresh(window.health.satietyHTML, window.health.satiety);
}

function deleteSatiety() {
    if (window.health.satiety > 0) {
        window.health.satiety = window.health.satiety - 1;
        window.health.refresh(window.health.satietyHTML, window.health.satiety);
    }
}
