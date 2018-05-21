'use strict';

const path = require('path');
const express = require('express');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.listen(8080, () => console.info('Open http://localhost:8080/'));

module.exports = app;
