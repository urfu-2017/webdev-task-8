window.addEventListener('load', async function () {
    const { hrundel, document } = window;

    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'visible') {
            hrundel.endNap();
        } else if (document.visibilityState === 'hidden') {
            hrundel.startNap();
        }
    });

}, false);


