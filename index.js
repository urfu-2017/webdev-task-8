/* eslint-disable no-undef */
'use strict';

const express = require('express');
const path = require('path');

const app = express();
const publicDir = path.join(__dirname, 'public');

app.use(express.static(publicDir));

app.get('/', (req, res) => {
    res.sendfile('index.html', { root: '.' });
});

app.listen(8080, () => {
    console.info('Listening on 8080');
});
