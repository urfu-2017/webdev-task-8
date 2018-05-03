(function () {
    function insertContainer(containerId) {
        const container = document.createElement('div');
        container.id = containerId;
        container.style.height = '200px';
        container.style.width = '100%';
        document.body.appendChild(container);
    }

    window.showGraph = function (collectionName) {
        const { hrundel, CanvasJS } = window;
        const containerId = collectionName + 'Container';
        insertContainer(containerId);
        setInterval(function () {
            const energyScale = hrundel.getStatScale(collectionName);
            const dataPoints = Array.from({ length: 360 }, (x, i) => i)
                .map(x => ({ x, y: energyScale(x) }));
            const current = dataPoints[Number(hrundel.age.toFixed())];
            if (current) {
                current.markerColor = 'red';
                current.markerSize = 10;
            }

            const chart = new CanvasJS.Chart(containerId, {
                theme: 'light2',
                axisY: {
                    includeZero: false,
                    minimum: 0,
                    maximum: 100
                },
                data: [{
                    type: 'line',
                    dataPoints
                }]
            });
            chart.render();
        }, 200);

    };
}());

