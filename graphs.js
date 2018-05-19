(function () {
    const containerId = 'graphs';
    window.addEventListener('load', function () {
        plotGraph(['feedings', 'games', 'naps']);
    }, false);

    function plotGraph(collectionNames) {
        const { hrundel, CanvasJS } = window;

        const chart = new CanvasJS.Chart(containerId, {
            theme: 'light2',
            axisY: {
                includeZero: false,
                minimum: 0,
                maximum: 100
            },
            data: []
        });

        function getDataPoints(collectionName) {
            const energyScale = hrundel.scaleBuilder.getStatScale(collectionName);
            const dataPoints = Array.from({ length: 360 }, (x, i) => i)
                .map(x => ({ x, y: energyScale(x) }));
            const current = dataPoints[Number(hrundel.age.toFixed())];
            if (current) {
                current.markerSize = 10;
            }

            return dataPoints;
        }

        setInterval(function () {
            chart.options.data = collectionNames.map(collectionName => ({
                dataPoints: getDataPoints(collectionName),
                type: 'line'
            }));

            chart.render();
        }, 666);
    }
}());

