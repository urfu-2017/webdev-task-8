'use strict';
/* eslint-disable */

const path = require('path');
const express = require('express');

const publicDir = path.join(__dirname, 'public');

const app = express();

app.use(express.static(publicDir));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.listen(3030, () => console.info('Open http://localhost:3030/'));

module.exports = app;
