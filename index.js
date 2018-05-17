let action = null;

let stats = null;

function saveStats(newStats) {
    console.log('save');
    if (newStats) {
        stats = { ...newStats };
    }
    Object.keys(stats).forEach(stat => {
        if (stats[stat] > 100) {
            stats[stat] = 100;
        } else if (stats[stat] < 0) {
            stats[stat] = 0;
        };
        document.getElementById(stat).innerText = Number(stats[stat]).toFixed(3);
    });
    localStorage.stats = JSON.stringify(stats);
}

function startNewGame() {
    console.log('new game');
    action = null;
    saveStats({
        happy: 100,
        tireness: 100,
        hunger: 100
    });
}

function setAction(newAction) {
    return () => {
        action = newAction;
    }
}

function gameTick() {
    Object.keys(stats).forEach(stat => {
        stats[stat] -= 0.005;
    });
    if (action && stats[action]) {
        stats[action] += 0.025;
    };
    saveStats();
}

function initGame() {
    if (localStorage.stats) {
        const restoredStats = JSON.parse(localStorage.stats);
        saveStats({
            happy: Number(restoredStats.happy),
            tireness: Number(restoredStats.tireness),
            hunger: Number(restoredStats.hunger)
        });
    } else {
        startNewGame();
    }
    setInterval(gameTick, 3000);
}

window.onload = () => {
    initGame();
    document.getElementById('new game').onclick = startNewGame;
    document.getElementById('feed').onclick = setAction('hunger');
    document.getElementById('sleep').onclick = setAction('tireness');
}
