'use strict';
/* eslint-disable */
const express = require('express');

const app = express();

app.use(express.static('./'));

app.get('/', (req, res) =>
    res.sendFile('./index.html')
);

app.listen(4000, () => {
    console.info('Opened in localhost:4000');
});

module.exports = app;
