const path = require('path');
const express = require('express');

const app = new express(); // eslint-disable-line new-cap

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.use('/static/', express.static(path.resolve(__dirname, 'static/')));

app.listen(port, () => {
    console.log(`App starting on ${port}`); // eslint-disable-line no-console
});
