'use strict';
/* eslint-disable no-undef */
const express = require('express');
const path = require('path');
const app = express();

app.use('/public', express.static('public'));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('*', (req, res) => res.sendStatus(404));
app.listen(3000);
console.info('started at 3000 port');
