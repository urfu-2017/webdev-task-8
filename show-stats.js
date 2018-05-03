window.addEventListener('load', async function () {
    const { hrundel } = window;
    setInterval(function () {
        const $stats = document.getElementById('stats');
        $stats.innerHTML = `
                energy: ${hrundel.energy.toFixed(2)}<br>
                food: ${hrundel.food.toFixed(2)}<br>
                mood: ${hrundel.mood.toFixed(2)}<br>
                age: ${hrundel.age}`;
        $stats.style.backgroundColor = hrundel.isAlive ? 'white' : 'red';
    }, 500);


}, false);


