window.addEventListener('load', async function () {
    const { hrundel } = window;
    setInterval(function () {
        const $stats = document.getElementById('stats');
        $stats.innerHTML = `
                energy: ${hrundel.energy.toFixed(2)}<br>
                food: ${hrundel.food.toFixed(2)}<br>
                mood: ${hrundel.mood.toFixed(2)}<br>
                age: ${hrundel.age.toFixed(0)}`;
        $stats.style.backgroundColor = hrundel.isAlive ? 'white' : '#d34836';
    }, 500);


}, false);


